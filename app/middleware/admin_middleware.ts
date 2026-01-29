import type { HttpContext } from '@adonisjs/core/http'
import type { NextFn } from '@adonisjs/core/types/http'

/**
 * Admin middleware ensures only admin users can access admin routes
 */
export default class AdminMiddleware {
  redirectTo = '/admin/login'

  async handle(ctx: HttpContext, next: NextFn) {
    await ctx.auth.authenticateUsing(['web'], { loginRoute: this.redirectTo })

    const user = ctx.auth.user
    if (!user || !user.isAdmin()) {
      return ctx.response.unauthorized({ message: 'Admin access required' })
    }

    return next()
  }
}
