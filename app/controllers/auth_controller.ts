import type { HttpContext } from '@adonisjs/core/http'
import User from '#models/user'

export default class AuthController {
  /**
   * Show login page
   */
  async showLogin({ inertia }: HttpContext) {
    return inertia.render('admin/login')
  }

  /**
   * Handle login
   */
  async login(ctx: HttpContext) {
    const { request, response, session, auth } = ctx
    const { email, password } = request.only(['email', 'password'])

    try {
      const user = await User.verifyCredentials(email, password)

      if (!user.isActive) {
        session.flash('error', 'Your account is inactive. Please contact support.')
        return response.redirect().back()
      }

      if (!user.isAdmin()) {
        session.flash('error', 'Admin access required.')
        return response.redirect().back()
      }

      // Use ctx.auth which is injected by the auth provider
      await auth.use('web').login(user)

      return response.redirect('/admin/properties')
    } catch (error: any) {
      console.error('Login error:', error?.message || error)
      console.error('Full error:', error)
      session.flash('error', 'Invalid credentials')
      return response.redirect().back()
    }
  }

  /**
   * Handle logout
   */
  async logout({ auth, response }: HttpContext) {
    await auth.use('web').logout()
    return response.redirect('/admin/login')
  }
}
