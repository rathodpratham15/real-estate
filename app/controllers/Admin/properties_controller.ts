import type { HttpContext } from '@adonisjs/core/http'
import Property from '#models/property'
import Agent from '#models/agent'

export default class PropertiesController {
  /**
   * List all properties (admin view)
   */
  async index({ inertia, request }: HttpContext) {
    const page = request.input('page', 1)
    const limit = 15

    const properties = await Property.query()
      .preload('agent')
      .preload('user')
      .orderBy('created_at', 'desc')
      .paginate(page, limit)

    return inertia.render('admin/properties/index', {
      properties,
    })
  }

  /**
   * Show create property form
   */
  async create({ inertia }: HttpContext) {
    const agents = await Agent.query().where('is_active', true).orderBy('first_name', 'asc')

    return inertia.render('admin/properties/create', {
      agents,
    })
  }

  /**
   * Store new property
   */
  async store({ request, response, session, auth }: HttpContext) {
    const user = await auth.use('web').authenticate()
    const data = request.only([
      'title',
      'description',
      'address',
      'city',
      'state',
      'zipCode',
      'country',
      'price',
      'propertyType',
      'bedrooms',
      'bathrooms',
      'squareFeet',
      'yearBuilt',
      'status',
      'featured',
      'mainImage',
      'images',
      'agentId',
      'features',
    ])

    // Generate slug from title
    const slug = data.title
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '')
    let uniqueSlug = slug
    let counter = 1

    // Ensure slug is unique
    while (await Property.findBy('slug', uniqueSlug)) {
      uniqueSlug = `${slug}-${counter}`
      counter++
    }

    const property = await Property.create({
      title: data.title,
      description: data.description || null,
      address: data.address,
      city: data.city,
      state: data.state,
      zipCode: data.zipCode,
      country: data.country,
      price: parseFloat(data.price),
      propertyType: data.propertyType,
      bedrooms: data.bedrooms ? parseInt(data.bedrooms) : null,
      bathrooms: data.bathrooms ? parseFloat(data.bathrooms) : null,
      squareFeet: data.squareFeet ? parseInt(data.squareFeet) : null,
      yearBuilt: data.yearBuilt ? parseInt(data.yearBuilt) : null,
      status: data.status,
      featured: data.featured,
      mainImage: data.mainImage || null,
      images: data.images || [],
      agentId: data.agentId ? parseInt(data.agentId) : null,
      features: data.features || null,
      slug: uniqueSlug,
      userId: user.id,
    })

    session.flash('success', 'Property created successfully!')
    return response.redirect(`/admin/properties/${property.id}/edit`)
  }

  /**
   * Show edit property form
   */
  async edit({ params, inertia, response }: HttpContext) {
    const property = await Property.findOrFail(params.id)
    const agents = await Agent.query().where('is_active', true).orderBy('first_name', 'asc')

    return inertia.render('admin/properties/edit', {
      property,
      agents,
    })
  }

  /**
   * Update property
   */
  async update({ params, request, response, session }: HttpContext) {
    const property = await Property.findOrFail(params.id)
    const data = request.only([
      'title',
      'description',
      'address',
      'city',
      'state',
      'zipCode',
      'country',
      'price',
      'propertyType',
      'bedrooms',
      'bathrooms',
      'squareFeet',
      'yearBuilt',
      'status',
      'featured',
      'mainImage',
      'images',
      'agentId',
      'features',
    ])

    // Update slug if title changed
    if (data.title && data.title !== property.title) {
      const slug = data.title
        .toLowerCase()
        .trim()
        .replace(/[^\w\s-]/g, '')
        .replace(/[\s_-]+/g, '-')
        .replace(/^-+|-+$/g, '')
      let uniqueSlug = slug
      let counter = 1

      while (await Property.query().where('slug', uniqueSlug).where('id', '!=', property.id).first()) {
        uniqueSlug = `${slug}-${counter}`
        counter++
      }
      data.slug = uniqueSlug
    }

    property.merge({
      title: data.title,
      description: data.description || null,
      address: data.address,
      city: data.city,
      state: data.state,
      zipCode: data.zipCode,
      country: data.country,
      price: parseFloat(data.price),
      propertyType: data.propertyType,
      bedrooms: data.bedrooms ? parseInt(data.bedrooms) : null,
      bathrooms: data.bathrooms ? parseFloat(data.bathrooms) : null,
      squareFeet: data.squareFeet ? parseInt(data.squareFeet) : null,
      yearBuilt: data.yearBuilt ? parseInt(data.yearBuilt) : null,
      status: data.status,
      featured: data.featured,
      mainImage: data.mainImage || null,
      images: data.images || [],
      agentId: data.agentId ? parseInt(data.agentId) : null,
      features: data.features || null,
      slug: data.slug || property.slug,
    })
    await property.save()

    session.flash('success', 'Property updated successfully!')
    return response.redirect().back()
  }

  /**
   * Delete property
   */
  async destroy({ params, response, session }: HttpContext) {
    const property = await Property.findOrFail(params.id)
    await property.delete()

    session.flash('success', 'Property deleted successfully!')
    return response.redirect('/admin/properties')
  }
}
