import { HttpContext } from '@adonisjs/core/http'
import { container } from '@adonisjs/core/services/container'

export default class ContainerBindingsMiddleware {
  async handle(ctx: HttpContext, next: () => Promise<void>) {
    ctx.containerResolver = container.createResolver()
    await next()
  }
}
