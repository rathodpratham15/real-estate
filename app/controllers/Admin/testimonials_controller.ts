import type { HttpContext } from '@adonisjs/core/http'
import Testimonial from '#models/testimonial'
import Property from '#models/property'

export default class TestimonialsController {
  async index({ inertia, request }: HttpContext) {
    const page = request.input('page', 1)
    const limit = 20

    const testimonials = await Testimonial.query()
      .preload('property', (query) => query.select(['id', 'title', 'slug']))
      .orderBy('created_at', 'desc')
      .paginate(page, limit)

    return inertia.render('admin/testimonials/index', {
      testimonials,
    })
  }

  async create({ inertia }: HttpContext) {
    const properties = await Property.query()
      .select(['id', 'title', 'slug'])
      .orderBy('created_at', 'desc')
      .limit(300)

    return inertia.render('admin/testimonials/create', {
      properties,
    })
  }

  async store({ request, response, session }: HttpContext) {
    const data = request.only(['clientName', 'clientPhoto', 'content', 'rating', 'propertyId', 'featured', 'order'])
    const parsedPropertyId = data.propertyId ? Number(data.propertyId) : null
    const propertyId =
      parsedPropertyId && !Number.isNaN(parsedPropertyId) ? parsedPropertyId : null
    const property = propertyId ? await Property.find(propertyId) : null
    const parsedRating = data.rating ? Number(data.rating) : null
    const normalizedRating =
      parsedRating !== null && !Number.isNaN(parsedRating)
        ? Math.max(0, Math.min(5, parsedRating))
        : null

    await Testimonial.create({
      clientName: data.clientName?.trim(),
      clientPhoto: data.clientPhoto?.trim() || null,
      content: data.content?.trim(),
      rating: normalizedRating,
      propertyType: property
        ? property.propertyType === 'other' && property.propertyTypeOther
          ? property.propertyTypeOther
          : property.propertyType
        : null,
      propertyId: property?.id || null,
      featured: Boolean(data.featured),
      order: data.order ? Number(data.order) : 0,
    })

    session.flash('success', 'Testimonial created successfully!')
    return response.redirect('/admin/testimonials')
  }

  async edit({ params, inertia }: HttpContext) {
    const testimonial = await Testimonial.findOrFail(params.id)
    const properties = await Property.query()
      .select(['id', 'title', 'slug'])
      .orderBy('created_at', 'desc')
      .limit(300)

    return inertia.render('admin/testimonials/edit', {
      testimonial,
      properties,
    })
  }

  async update({ params, request, response, session }: HttpContext) {
    const testimonial = await Testimonial.findOrFail(params.id)
    const data = request.only(['clientName', 'clientPhoto', 'content', 'rating', 'propertyId', 'featured', 'order'])
    const parsedPropertyId = data.propertyId ? Number(data.propertyId) : null
    const propertyId =
      parsedPropertyId && !Number.isNaN(parsedPropertyId) ? parsedPropertyId : null
    const property = propertyId ? await Property.find(propertyId) : null
    const parsedRating = data.rating ? Number(data.rating) : null
    const normalizedRating =
      parsedRating !== null && !Number.isNaN(parsedRating)
        ? Math.max(0, Math.min(5, parsedRating))
        : null

    testimonial.merge({
      clientName: data.clientName?.trim(),
      clientPhoto: data.clientPhoto?.trim() || null,
      content: data.content?.trim(),
      rating: normalizedRating,
      propertyType: property
        ? property.propertyType === 'other' && property.propertyTypeOther
          ? property.propertyTypeOther
          : property.propertyType
        : null,
      propertyId: property?.id || null,
      featured: Boolean(data.featured),
      order: data.order ? Number(data.order) : 0,
    })

    await testimonial.save()

    session.flash('success', 'Testimonial updated successfully!')
    return response.redirect('/admin/testimonials')
  }

  async destroy({ params, response, session }: HttpContext) {
    const testimonial = await Testimonial.findOrFail(params.id)
    await testimonial.delete()

    session.flash('success', 'Testimonial deleted successfully!')
    return response.redirect('/admin/testimonials')
  }
}
