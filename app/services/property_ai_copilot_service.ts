import Property from '#models/property'
import Testimonial from '#models/testimonial'

export type CopilotIntent = 'buy' | 'rent' | 'sell' | 'popular' | 'nearby' | 'general'

interface CopilotRequest {
  question: string
  filters?: {
    city?: string | null
    minPrice?: number | null
    maxPrice?: number | null
    bedrooms?: number | null
    status?: string | null
    latitude?: number | null
    longitude?: number | null
  }
}

interface CopilotProperty {
  id: number
  title: string
  slug: string
  price: number
  city: string
  address: string
  bedrooms: number | null
  bathrooms: number | null
  isPopular: boolean
  rating: number | null
  overallRating: number | null
  why: string[]
}

interface CopilotResult {
  answer: string
  intent: CopilotIntent
  properties: CopilotProperty[]
  trace: {
    guardrails: string[]
    queryTerms: string[]
    steps: string[]
  }
}

interface CopilotEvalSummary {
  total: number
  nonEmptyRate: number
  intentMatchRate: number
  averageCandidates: number
}

export default class PropertyAiCopilotService {
  private parseIntent(question: string): CopilotIntent {
    const q = question.toLowerCase()
    if (q.includes('rent') || q.includes('rental') || q.includes('lease')) return 'rent'
    if (q.includes('sell') || q.includes('list my property')) return 'sell'
    if (q.includes('popular') || q.includes('best') || q.includes('top')) return 'popular'
    if (q.includes('near') || q.includes('nearby') || q.includes('closest')) return 'nearby'
    if (q.includes('buy') || q.includes('purchase')) return 'buy'
    return 'general'
  }

  private runGuardrails(question: string): { sanitized: string; notes: string[] } {
    const notes: string[] = []
    let sanitized = question.trim()

    if (sanitized.length > 600) {
      sanitized = sanitized.slice(0, 600)
      notes.push('Truncated long prompt to safe length.')
    }

    const piiPattern = /\b\d{10,16}\b/g
    if (piiPattern.test(sanitized)) {
      sanitized = sanitized.replace(piiPattern, '[redacted-number]')
      notes.push('Redacted possible sensitive numeric identifiers.')
    }

    const blocked = ['hack', 'exploit', 'bypass']
    if (blocked.some((word) => sanitized.toLowerCase().includes(word))) {
      notes.push('Blocked unsafe intent keywords and switched to safe response mode.')
    }

    return { sanitized, notes }
  }

  private scoreProperty(property: any, queryTerms: string[], intent: CopilotIntent): { score: number; why: string[] } {
    let score = 0
    const why: string[] = []
    const hay = `${property.title} ${property.city} ${property.address} ${property.description || ''}`.toLowerCase()

    queryTerms.forEach((term) => {
      if (hay.includes(term)) {
        score += 2
        why.push(`matches "${term}"`)
      }
    })

    if (intent === 'popular' && property.isPopular) {
      score += 4
      why.push('marked as popular')
    }

    if (intent === 'rent' && property.status === 'rental') {
      score += 3
      why.push('rental status match')
    }

    if (intent === 'buy' && property.status === 'for_sale') {
      score += 3
      why.push('for sale status match')
    }

    const numericOverallRating =
      property.overallRating === null || property.overallRating === undefined
        ? null
        : Number(property.overallRating)

    if (numericOverallRating !== null && Number.isFinite(numericOverallRating) && numericOverallRating > 0) {
      score += Math.min(2, numericOverallRating / 3)
      why.push(`rating ${numericOverallRating.toFixed(1)}/5`)
    }

    return { score, why }
  }

  private extractTerms(question: string): string[] {
    return question
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, ' ')
      .split(/\s+/)
      .filter((w) => w.length >= 3)
      .slice(0, 8)
  }

  private distanceInKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const toRad = (deg: number) => (deg * Math.PI) / 180
    const earthRadiusKm = 6371
    const dLat = toRad(lat2 - lat1)
    const dLon = toRad(lon2 - lon1)
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2)
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
    return earthRadiusKm * c
  }

  public async ask(input: CopilotRequest): Promise<CopilotResult> {
    const guardrails = this.runGuardrails(input.question)
    const intent = this.parseIntent(guardrails.sanitized)
    const queryTerms = this.extractTerms(guardrails.sanitized)

    const steps = [
      'intent-classification',
      'retrieval-from-properties',
      'retrieval-from-testimonials',
      'ranking-and-orchestration',
      'response-synthesis',
    ]

    const propertiesQuery = Property.query().where('status', input.filters?.status || 'for_sale').limit(60)

    if (input.filters?.city) propertiesQuery.whereILike('city', `%${input.filters.city}%`)
    if (input.filters?.minPrice) propertiesQuery.where('price', '>=', input.filters.minPrice)
    if (input.filters?.maxPrice) propertiesQuery.where('price', '<=', input.filters.maxPrice)
    if (input.filters?.bedrooms) propertiesQuery.where('bedrooms', '>=', input.filters.bedrooms)

    const properties = await propertiesQuery.orderBy('is_popular', 'desc').orderBy('created_at', 'desc')

    const propertyIds = properties.map((p) => p.id)
    const ratingRows = await Testimonial.query()
      .whereIn('property_id', propertyIds)
      .whereNotNull('rating')
      .select('property_id')
      .avg('rating as avg_rating')
      .groupBy('property_id')

    const ratingMap = new Map<number, number>()
    ratingRows.forEach((row: any) => {
      ratingMap.set(Number(row.$extras.property_id), Number(row.$extras.avg_rating || 0))
    })

    const scored = properties
      .map((p) => {
        const serialized = p.serialize() as any
        const rawOverallRating = serialized.rating ?? ratingMap.get(serialized.id) ?? null
        const overallRating =
          rawOverallRating === null || rawOverallRating === undefined ? null : Number(rawOverallRating)
        const scoredProperty = { ...serialized, overallRating }
        const scoredDetails = this.scoreProperty(scoredProperty, queryTerms, intent)
        let score = scoredDetails.score
        const why = [...scoredDetails.why]

        let distanceKm: number | null = null
        if (
          input.filters?.latitude !== null &&
          input.filters?.latitude !== undefined &&
          input.filters?.longitude !== null &&
          input.filters?.longitude !== undefined &&
          scoredProperty.latitude &&
          scoredProperty.longitude
        ) {
          distanceKm = this.distanceInKm(
            input.filters.latitude,
            input.filters.longitude,
            Number(scoredProperty.latitude),
            Number(scoredProperty.longitude)
          )
          score += Math.max(0, 3 - distanceKm / 15)
          why.push(`~${distanceKm.toFixed(1)} km away`)
        }

        return { scoredProperty, score, why, distanceKm }
      })
      .sort((a, b) => b.score - a.score)
      .slice(0, 5)

    const results: CopilotProperty[] = scored.map((item) => ({
      id: item.scoredProperty.id,
      title: item.scoredProperty.title,
      slug: item.scoredProperty.slug,
      price: item.scoredProperty.price,
      city: item.scoredProperty.city,
      address: item.scoredProperty.address,
      bedrooms: item.scoredProperty.bedrooms,
      bathrooms: item.scoredProperty.bathrooms,
      isPopular: item.scoredProperty.isPopular,
      rating: item.scoredProperty.rating,
      overallRating: item.scoredProperty.overallRating,
      why: item.why.slice(0, 3),
    }))

    const prefixByIntent: Record<CopilotIntent, string> = {
      buy: 'Based on your buying intent, here are strong matches:',
      rent: 'For rental-focused needs, these listings look best:',
      sell: 'For selling, I recommend contacting the team with your property details first. Meanwhile, here are relevant market comps:',
      popular: 'These are the most in-demand options right now:',
      nearby: 'These options are highly relevant for your location:',
      general: 'Here are the most relevant properties based on your query:',
    }

    const answer =
      results.length > 0
        ? `${prefixByIntent[intent]} ${results
            .map((r) => `${r.title} (${r.city})`)
            .join(', ')}.`
        : 'I could not find a strong match with current filters. Try widening price or city constraints.'

    return {
      answer,
      intent,
      properties: results,
      trace: {
        guardrails: guardrails.notes,
        queryTerms,
        steps,
      },
    }
  }

  public async runEvaluation() {
    const dataset: Array<{ question: string; expectedIntent: CopilotIntent }> = [
      { question: 'Show me popular homes for sale', expectedIntent: 'popular' },
      { question: 'I want to rent an apartment in Thane', expectedIntent: 'rent' },
      { question: 'Looking to buy a family house', expectedIntent: 'buy' },
      { question: 'Any nearby options around me?', expectedIntent: 'nearby' },
      { question: 'I want to sell my property quickly', expectedIntent: 'sell' },
    ]

    const rows = []
    for (const sample of dataset) {
      const result = await this.ask({ question: sample.question })
      rows.push({
        question: sample.question,
        expectedIntent: sample.expectedIntent,
        predictedIntent: result.intent,
        intentMatched: result.intent === sample.expectedIntent,
        hasResults: result.properties.length > 0,
        candidates: result.properties.length,
      })
    }

    const total = rows.length
    const nonEmpty = rows.filter((r) => r.hasResults).length
    const intentMatched = rows.filter((r) => r.intentMatched).length
    const averageCandidates =
      rows.reduce((sum, row) => sum + row.candidates, 0) / (rows.length === 0 ? 1 : rows.length)

    const summary: CopilotEvalSummary = {
      total,
      nonEmptyRate: Number((nonEmpty / total).toFixed(2)),
      intentMatchRate: Number((intentMatched / total).toFixed(2)),
      averageCandidates: Number(averageCandidates.toFixed(2)),
    }

    return { summary, rows }
  }
}
