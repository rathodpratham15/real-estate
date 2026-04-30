import type { HttpContext } from '@adonisjs/core/http'
import User from '#models/user'
import hash from '@adonisjs/core/services/hash'

export default class UserAuthController {
  /**
   * Show user registration page
   */
  async showRegister({ inertia }: HttpContext) {
    return inertia.render('auth/register')
  }

  /**
   * Handle user registration
   */
  async register({ request, response, session, auth }: HttpContext) {
    const { firstName, lastName, email, password, passwordConfirmation } = request.only([
      'firstName',
      'lastName',
      'email',
      'password',
      'passwordConfirmation',
    ])

    // Validation
    if (password !== passwordConfirmation) {
      session.flash('error', 'Passwords do not match.')
      return response.redirect().back()
    }

    if (password.length < 8) {
      session.flash('error', 'Password must be at least 8 characters long.')
      return response.redirect().back()
    }

    try {
      // Check if user already exists
      const existingUser = await User.findBy('email', email)
      if (existingUser) {
        session.flash('error', 'An account with this email already exists.')
        return response.redirect().back()
      }

      // Create new user
      const user = await User.create({
        firstName,
        lastName,
        email,
        password,
        role: 'user',
        isActive: true,
      })

      // Auto-login after registration
      await auth.use('web').login(user)

      session.flash('success', 'Account created successfully! Welcome!')
      return response.redirect('/dashboard')
    } catch (error: any) {
      console.error('Registration error:', error)
      session.flash('error', 'Failed to create account. Please try again.')
      return response.redirect().back()
    }
  }

  /**
   * Show user login page
   */
  async showLogin({ inertia }: HttpContext) {
    return inertia.render('auth/login')
  }

  /**
   * Handle user login
   */
  async login({ request, response, session, auth }: HttpContext) {
    const { email, password } = request.only(['email', 'password'])

    try {
      const user = await User.verifyCredentials(email, password)

      if (!user.isActive) {
        session.flash('error', 'Your account is inactive. Please contact support.')
        return response.redirect().back()
      }

      // Allow both admin and regular users to login
      await auth.use('web').login(user)

      // Redirect based on role
      if (user.isAdmin()) {
        return response.redirect('/admin/properties')
      }

      return response.redirect('/dashboard')
    } catch (error: any) {
      console.error('Login error:', error)
      session.flash('error', 'Invalid email or password.')
      return response.redirect().back()
    }
  }

  /**
   * Handle user logout
   */
  async logout({ auth, response }: HttpContext) {
    await auth.use('web').logout()
    return response.redirect('/')
  }
}
