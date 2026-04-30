import type { HttpContext } from '@adonisjs/core/http'
import Property from '#models/property'
import Contact from '#models/contact'

export default class UserDashboardController {
  /**
   * Show user dashboard
   */
  async index({ inertia, auth }: HttpContext) {
    const user = await auth.use('web').authenticate()

    // Get user's favorite properties
    const favoriteProperties = await user
      .related('favoriteProperties')
      .query()
      .orderBy('created_at', 'desc')

    // Get user's inquiries
    const inquiries = await Contact.query()
      .where('user_id', user.id)
      .orderBy('created_at', 'desc')
      .limit(10)

    return inertia.render('user/dashboard', {
      favoriteProperties,
      inquiries,
    })
  }

  /**
   * Toggle favorite property
   */
  async toggleFavorite({ params, response, auth }: HttpContext) {
    const user = await auth.use('web').authenticate()
    const property = await Property.findOrFail(params.id)

    const isFavorited = await user
      .related('favoriteProperties')
      .query()
      .where('properties.id', property.id)
      .first()

    if (isFavorited) {
      await user.related('favoriteProperties').detach([property.id])
      return response.json({ favorited: false })
    } else {
      await user.related('favoriteProperties').attach([property.id])
      return response.json({ favorited: true })
    }
  }

  /**
   * Get favorite status for a property
   */
  async getFavoriteStatus({ params, auth }: HttpContext) {
    const user = await auth.use('web').authenticate()
    const property = await Property.findOrFail(params.id)

    const isFavorited = await user
      .related('favoriteProperties')
      .query()
      .where('properties.id', property.id)
      .first()

    return { favorited: !!isFavorited }
  }
}
