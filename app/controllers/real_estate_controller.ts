import type { HttpContext } from '@adonisjs/core/http'
import Property from '#models/property'
import Agent from '#models/agent'
import BlogPost from '#models/blog_post'
import Testimonial from '#models/testimonial'
import Contact from '#models/contact'

export default class RealEstateController {
  /**
   * Home page - displays featured properties, testimonials, and blog posts
   */
  async home({ inertia }: HttpContext) {
    const featuredProperties = await Property.query()
      .where('featured', true)
      .where('status', 'for_sale')
      .preload('agent')
      .limit(6)
      .orderBy('created_at', 'desc')

    const testimonials = await Testimonial.query()
      .where('featured', true)
      .orderBy('order', 'asc')
      .limit(6)

    const recentBlogPosts = await BlogPost.query()
      .where('published', true)
      .preload('author')
      .orderBy('published_at', 'desc')
      .limit(3)

    return inertia.render('real-estate/home-new', {
      featuredProperties,
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
    const propertyType = request.input('propertyType', null)
    const status = request.input('status', 'for_sale')
    const city = request.input('city', null)
    const minPrice = request.input('minPrice', null)
    const maxPrice = request.input('maxPrice', null)
    const bedrooms = request.input('bedrooms', null)

    const query = Property.query()
      .preload('agent')
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

    const properties = await query
      .orderBy('created_at', 'desc')
      .paginate(page, limit)

    // Get unique cities for filter dropdown
    const cities = await Property.query()
      .select('city')
      .whereNotNull('city')
      .groupBy('city')
      .orderBy('city', 'asc')

    return inertia.render('real-estate/listings-new', {
      properties,
      filters: {
        propertyType,
        status,
        city,
        minPrice,
        maxPrice,
        bedrooms,
      },
      cities: cities.map((p) => p.city),
    })
  }

  /**
   * Property detail page
   */
  async property({ params, inertia, response }: HttpContext) {
    const property = await Property.query()
      .where('slug', params.slug)
      .preload('agent')
      .first()

    if (!property) {
      return response.notFound()
    }

    // Get similar properties
    const similarProperties = await Property.query()
      .where('property_type', property.propertyType)
      .where('id', '!=', property.id)
      .where('status', 'for_sale')
      .preload('agent')
      .limit(4)
      .orderBy('created_at', 'desc')

    return inertia.render('real-estate/property-detail-new', {
      property,
      similarProperties,
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
  async contact({ inertia, request, response, session }: HttpContext) {
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

      // Save to database
      await Contact.create({
        name,
        email,
        phone: phone || null,
        subject: subject || null,
        message,
        agentId: agentId ? parseInt(agentId) : null,
        status: 'new',
      })

      session.flash('success', 'Thank you for your message! We will get back to you soon.')

      return response.redirect().back()
    }

    const agents = await Agent.query()
      .where('is_active', true)
      .orderBy('created_at', 'asc')

    return inertia.render('real-estate/contact-new', {
      agents,
    })
  }
}
