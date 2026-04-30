import type { HttpContext } from '@adonisjs/core/http'
import Property from '#models/property'
import Agent from '#models/agent'
import BlogPost from '#models/blog_post'
import Testimonial from '#models/testimonial'
import Contact from '#models/contact'
import env from '#start/env'
import NotificationService from '#services/notification_service'
import PropertyAiCopilotService from '#services/property_ai_copilot_service'
import app from '@adonisjs/core/services/app'
import { mkdir } from 'fs/promises'

export default class RealEstateController {
  private copilotService = new PropertyAiCopilotService()
  private parseNumber(value: unknown): number | null {
    if (value === undefined || value === null || value === '') return null
    const parsed = Number(value)
    return Number.isFinite(parsed) ? parsed : null
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

  private async enrichPropertiesWithRatings(properties: any[]) {
    if (properties.length === 0) return properties

    const propertyIds = properties.map((property) => property.id)
    const ratings = await Testimonial.query()
      .whereIn('property_id', propertyIds)
      .whereNotNull('rating')
      .select('property_id')
      .avg('rating as avg_rating')
      .count('rating as rating_count')
      .groupBy('property_id')

    const ratingsMap = new Map<number, { avg: number | null; count: number }>()
    for (const row of ratings) {
      ratingsMap.set((row as any).$extras.property_id, {
        avg: (row as any).$extras.avg_rating ? Number((row as any).$extras.avg_rating) : null,
        count: Number((row as any).$extras.rating_count || 0),
      })
    }

    return properties.map((property) => {
      const summary = ratingsMap.get(property.id)
      const autoRating = summary?.avg ?? null
      const overallRating = property.rating !== null && property.rating !== undefined ? Number(property.rating) : autoRating

      return {
        ...property,
        overallRating: overallRating !== null ? Number(overallRating.toFixed(1)) : null,
        ratingCount: summary?.count || 0,
      }
    })
  }

  /**
   * Home page - displays featured properties, testimonials, and blog posts
   */
  async home({ inertia }: HttpContext) {
    const featuredProperties = await Property.query()
      .where('featured', true)
      .where('status', 'for_sale')
      .limit(6)
      .orderBy('created_at', 'desc')
    const featuredPropertiesWithRatings = await this.enrichPropertiesWithRatings(
      featuredProperties.map((property) => property.serialize())
    )

    const testimonials = await Testimonial.query()
      .preload('property', (query) => query.select(['id', 'title', 'slug']))
      .orderBy('order', 'asc')
      .orderBy('created_at', 'desc')
      .limit(30)

    const recentBlogPosts = await BlogPost.query()
      .where('published', true)
      .preload('author')
      .orderBy('published_at', 'desc')
      .limit(3)

    return inertia.render('real-estate/home-new', {
      featuredProperties: featuredPropertiesWithRatings,
      testimonials,
      recentBlogPosts,
    })
  }

  /**
   * Listings page - displays all properties with filters
   */
  async listings({ request, inertia }: HttpContext) {
    const page = request.input('page', 1)
    const limit = 12
    const search = request.input('search', null)
    const sort = request.input('sort', 'popular')
    const propertyType = request.input('propertyType', null)
    const status = request.input('status', 'for_sale')
    const city = request.input('city', null)
    const minPrice = request.input('minPrice', null)
    const maxPrice = request.input('maxPrice', null)
    const bedrooms = request.input('bedrooms', null)
    const popularOnlyInput = request.input('popularOnly', false)
    const popularOnly = popularOnlyInput === true || popularOnlyInput === 'true'
    const latitude = this.parseNumber(request.input('latitude', null))
    const longitude = this.parseNumber(request.input('longitude', null))
    const radiusKm = this.parseNumber(request.input('radiusKm', 25)) ?? 25
    const hasGeoPoint = latitude !== null && longitude !== null

    const query = Property.query()
      .where('status', status)

    if (propertyType) {
      query.where('property_type', propertyType)
    }

    if (city) {
      query.where('city', 'like', `%${city}%`)
    }

    if (minPrice) {
      query.where('price', '>=', minPrice)
    }

    if (maxPrice) {
      query.where('price', '<=', maxPrice)
    }

    if (bedrooms) {
      query.where('bedrooms', '>=', bedrooms)
    }

    if (search) {
      query.where((builder) => {
        builder
          .whereILike('title', `%${search}%`)
          .orWhereILike('address', `%${search}%`)
          .orWhereILike('city', `%${search}%`)
      })
    }

    if (popularOnly) {
      query.where('is_popular', true)
    }

    if (hasGeoPoint) {
      query.whereNotNull('latitude').whereNotNull('longitude')
      query.whereRaw(
        `(
          6371 * acos(
            cos(radians(?)) * cos(radians(latitude)) *
            cos(radians(longitude) - radians(?)) +
            sin(radians(?)) * sin(radians(latitude))
          )
        ) <= ?`,
        [latitude!, longitude!, latitude!, radiusKm]
      )
    }

    switch (sort) {
      case 'price_low':
        query.orderBy('price', 'asc')
        break
      case 'price_high':
        query.orderBy('price', 'desc')
        break
      case 'rating_high':
        query.orderByRaw('COALESCE(rating, 0) DESC').orderBy('is_popular', 'desc')
        break
      case 'latest':
        query.orderBy('created_at', 'desc')
        break
      case 'distance':
        if (hasGeoPoint) {
          query.orderByRaw(
            `(
              6371 * acos(
                cos(radians(?)) * cos(radians(latitude)) *
                cos(radians(longitude) - radians(?)) +
                sin(radians(?)) * sin(radians(latitude))
              )
            ) ASC`,
            [latitude!, longitude!, latitude!]
          )
        } else {
          query.orderBy('is_popular', 'desc').orderBy('created_at', 'desc')
        }
        break
      case 'popular':
      default:
        query.orderBy('is_popular', 'desc').orderBy('created_at', 'desc')
        break
    }

    const properties = await query.paginate(page, limit)
    const serializedProperties = properties.serialize()
    const enrichedPropertiesWithRatings = await this.enrichPropertiesWithRatings(serializedProperties.data as any)
    const enrichedProperties = enrichedPropertiesWithRatings.map((property) => {
      if (!hasGeoPoint || property.latitude === null || property.longitude === null) {
        return { ...property, distanceKm: null }
      }

      const distanceKm = this.distanceInKm(latitude!, longitude!, Number(property.latitude), Number(property.longitude))
      return { ...property, distanceKm: Number(distanceKm.toFixed(1)) }
    })

    // Get unique cities for filter dropdown
    const cities = await Property.query()
      .select('city')
      .whereNotNull('city')
      .groupBy('city')
      .orderBy('city', 'asc')

    return inertia.render('real-estate/listings-new', {
      properties: {
        ...serializedProperties,
        data: enrichedProperties,
      },
      filters: {
        search,
        sort,
        popularOnly,
        latitude,
        longitude,
        radiusKm,
        propertyType,
        status,
        city,
        minPrice,
        maxPrice,
        bedrooms,
      },
      cities: cities.map((p) => p.city),
      googleMapsApiKey: env.get('GOOGLE_MAPS_API_KEY', '') || null,
      defaultMapCenter: {
        lat: Number(env.get('DEFAULT_MAP_LATITUDE', 19.076)),
        lng: Number(env.get('DEFAULT_MAP_LONGITUDE', 72.8777)),
      },
    })
  }

  async propertyCopilot({ request, response }: HttpContext) {
    const question = request.input('question', '').toString().trim()

    if (!question) {
      return response.badRequest({
        message: 'question is required',
      })
    }

    const toNumber = (value: unknown): number | null => {
      if (value === undefined || value === null || value === '') return null
      const parsed = Number(value)
      return Number.isFinite(parsed) ? parsed : null
    }

    const result = await this.copilotService.ask({
      question,
      filters: {
        city: request.input('city', null),
        status: request.input('status', null),
        minPrice: toNumber(request.input('minPrice', null)),
        maxPrice: toNumber(request.input('maxPrice', null)),
        bedrooms: toNumber(request.input('bedrooms', null)),
        latitude: toNumber(request.input('latitude', null)),
        longitude: toNumber(request.input('longitude', null)),
      },
    })

    return response.ok(result)
  }

  async propertyCopilotEval({ response }: HttpContext) {
    const evalResult = await this.copilotService.runEvaluation()
    return response.ok(evalResult)
  }

  /**
   * Property detail page
   */
  async property({ params, inertia, response }: HttpContext) {
    const property = await Property.query()
      .where('slug', params.slug)
      .first()

    if (!property) {
      return response.notFound()
    }

    const [enrichedProperty] = await this.enrichPropertiesWithRatings([property.serialize() as any])

    // Get similar properties
    const similarProperties = await Property.query()
      .where('property_type', property.propertyType)
      .where('id', '!=', property.id)
      .where('status', 'for_sale')
      .limit(4)
      .orderBy('created_at', 'desc')
    const similarPropertiesWithRatings = await this.enrichPropertiesWithRatings(
      similarProperties.map((item) => item.serialize())
    )

    const propertyTestimonials = await Testimonial.query()
      .where('property_id', property.id)
      .orderBy('created_at', 'desc')
      .limit(12)

    return inertia.render('real-estate/property-detail-new', {
      property: enrichedProperty,
      similarProperties: similarPropertiesWithRatings,
      propertyTestimonials,
      whatsappNumber: env.get('WHATSAPP_NUMBER', '+919876543210'), // Default Indian number format
    })
  }

  /**
   * Blog listing page
   */
  async blog({ request, inertia }: HttpContext) {
    const page = request.input('page', 1)
    const limit = 9
    const category = request.input('category', null)
    const tag = request.input('tag', null)

    const query = BlogPost.query()
      .where('published', true)
      .preload('author')
      .orderBy('published_at', 'desc')

    if (category) {
      query.where('category', category)
    }

    if (tag) {
      query.whereRaw("JSON_CONTAINS(tags, ?)", [JSON.stringify(tag)])
    }

    const posts = await query.paginate(page, limit)

    // Get unique categories
    const categories = await BlogPost.query()
      .select('category')
      .whereNotNull('category')
      .where('published', true)
      .groupBy('category')
      .orderBy('category', 'asc')

    return inertia.render('real-estate/blog-new', {
      posts,
      filters: {
        category,
        tag,
      },
      categories: categories.map((p) => p.category).filter(Boolean),
    })
  }

  /**
   * Blog post detail page
   */
  async blogPost({ params, inertia, response }: HttpContext) {
    const post = await BlogPost.query()
      .where('slug', params.slug)
      .where('published', true)
      .preload('author')
      .first()

    if (!post) {
      return response.notFound()
    }

    // Get related posts
    const relatedPosts = await BlogPost.query()
      .where('id', '!=', post.id)
      .where('published', true)
      .where('category', post.category || '')
      .preload('author')
      .limit(3)
      .orderBy('published_at', 'desc')

    return inertia.render('real-estate/blog-post-new', {
      post,
      relatedPosts,
    })
  }

  /**
   * About page
   */
  async about({ inertia }: HttpContext) {
    const agents = await Agent.query()
      .where('is_active', true)
      .orderBy('created_at', 'asc')
      .limit(4)

    // Calculate stats from database
    const totalPropertiesSold = await Property.query()
      .where('status', 'sold')
      .count('* as total')
      .first()

    const totalHappyClients = await Testimonial.query()
      .count('* as total')
      .first()

    const oldestAgent = await Agent.query()
      .where('is_active', true)
      .whereNotNull('years_of_experience')
      .orderBy('years_of_experience', 'desc')
      .first()

    const totalProperties = await Property.query()
      .where('status', 'sold')
      .count('* as total')
      .first()

    const totalTestimonials = await Testimonial.query()
      .count('* as total')
      .first()

    // Calculate satisfaction rate (assuming it's based on testimonials with rating >= 4)
    const positiveTestimonials = await Testimonial.query()
      .whereNotNull('rating')
      .where('rating', '>=', 4)
      .count('* as total')
      .first()

    const allRatedTestimonials = await Testimonial.query()
      .whereNotNull('rating')
      .count('* as total')
      .first()

    const satisfactionRate =
      allRatedTestimonials && allRatedTestimonials.$extras.total > 0
        ? Math.round(
          ((positiveTestimonials?.$extras.total || 0) / allRatedTestimonials.$extras.total) * 100
        )
        : 98

    const stats = {
      happyClients: totalHappyClients?.$extras.total || 500,
      propertiesSold: totalPropertiesSold?.$extras.total || 1200,
      yearsExperience: oldestAgent?.yearsOfExperience || 15,
      satisfactionRate,
    }

    return inertia.render('real-estate/about-new', {
      agents,
      stats,
    })
  }

  /**
   * Contact page
   */
  async contact({ inertia, request, response, session, auth }: HttpContext) {
    if (request.method() === 'POST') {
      // Handle form submission
      const { name, email, phone, subject, message, agentId } = request.only([
        'name',
        'email',
        'phone',
        'subject',
        'message',
        'agentId',
      ])

      // Get user if logged in
      let userId = null
      try {
        await auth.check()
        if (auth.user) {
          userId = auth.user.id
        }
      } catch {
        // User not authenticated, continue with null userId
      }

      // Save to database
      await Contact.create({
        userId: userId,
        name,
        email,
        phone: phone || null,
        subject: subject || null,
        message,
        agentId: agentId ? parseInt(agentId) : null,
        status: 'new',
      })

      // Check if this is a property inquiry (subject contains "Inquiry about")
      const isPropertyInquiry = subject?.includes('Inquiry about')
      
      if (isPropertyInquiry) {
        // Extract property title from subject
        const propertyTitle = subject.replace('Inquiry about ', '').trim()
        
        // Try to find the property to get full details
        const property = await Property.query()
          .where('title', propertyTitle)
          .orWhere('slug', propertyTitle.toLowerCase().replace(/\s+/g, '-'))
          .first()
        
        if (property) {
          // Send property inquiry notification
          await NotificationService.notifyAdminPropertyInquiry({
            name,
            email,
            phone: phone || null,
            propertyTitle: property.title,
            propertyAddress: property.address,
            propertyPrice: property.price,
            message,
          })
        } else {
          // Fallback to regular contact notification if property not found
          await NotificationService.notifyAdminNewContact({
            name,
            email,
            phone: phone || null,
            subject: subject || null,
            message,
          })
        }
      } else {
        // Send regular contact notification
        await NotificationService.notifyAdminNewContact({
          name,
          email,
          phone: phone || null,
          subject: subject || null,
          message,
        })
      }

      session.flash('success', 'Thank you for your message! We will get back to you soon.')

      return response.redirect().back()
    }

    const agents = await Agent.query()
      .where('is_active', true)
      .orderBy('created_at', 'asc')

    return inertia.render('real-estate/contact-new', {
      agents,
      whatsappNumber: env.get('WHATSAPP_NUMBER', '+919876543210'), // Default Indian number format
    })
  }

  /**
   * Public testimonial submission form
   */
  async showTestimonialForm({ inertia, request }: HttpContext) {
    const properties = await Property.query()
      .select(['id', 'title', 'slug'])
      .orderBy('created_at', 'desc')
      .limit(300)

    const selectedPropertyId = request.input('propertyId', null)
    const normalizedSelectedPropertyId =
      selectedPropertyId && !Number.isNaN(Number(selectedPropertyId))
        ? Number(selectedPropertyId)
        : null

    return inertia.render('real-estate/share-testimonial', {
      properties,
      selectedPropertyId: normalizedSelectedPropertyId,
    })
  }

  /**
   * Store public testimonial submission
   */
  async submitTestimonial({ request, response, session }: HttpContext) {
    const data = request.only(['clientName', 'content', 'rating', 'propertyId'])

    if (!data.clientName || !data.content) {
      session.flash('error', 'Name and testimonial content are required.')
      return response.redirect().back()
    }

    const parsedPropertyId = data.propertyId ? Number(data.propertyId) : null
    const propertyId =
      parsedPropertyId && !Number.isNaN(parsedPropertyId) ? parsedPropertyId : null
    let selectedProperty: Property | null = null

    if (propertyId) {
      selectedProperty = await Property.find(propertyId)
      if (!selectedProperty) {
        session.flash('error', 'Selected property was not found.')
        return response.redirect().back()
      }
    }

    const parsedRating = data.rating ? Number(data.rating) : null
    const normalizedRating =
      parsedRating !== null && !Number.isNaN(parsedRating)
        ? Math.max(0, Math.min(5, parsedRating))
        : null

    let clientPhotoPath: string | null = null
    const clientPhotoFile = request.file('clientPhoto', {
      size: '5mb',
      extnames: ['jpg', 'jpeg', 'png', 'webp', 'heic'],
    })

    if (clientPhotoFile) {
      const uploadsDir = app.publicPath('uploads/testimonials')
      await mkdir(uploadsDir, { recursive: true })
      const fileName = `${Date.now()}-${clientPhotoFile.clientName.replace(/\s+/g, '-')}`
      await clientPhotoFile.move(uploadsDir, { name: fileName, overwrite: true })
      clientPhotoPath = `/uploads/testimonials/${fileName}`
    }

    await Testimonial.create({
      clientName: data.clientName.trim(),
      clientPhoto: clientPhotoPath,
      content: data.content.trim(),
      rating: normalizedRating,
      propertyType: selectedProperty
        ? selectedProperty.propertyType === 'other' && selectedProperty.propertyTypeOther
          ? selectedProperty.propertyTypeOther
          : selectedProperty.propertyType
        : null,
      propertyId,
      featured: false,
      order: 0,
    })

    session.flash('success', 'Thank you! Your testimonial has been submitted for review.')
    return response.redirect('/testimonials/share')
  }
}
