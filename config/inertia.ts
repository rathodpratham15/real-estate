import { defineConfig } from '@adonisjs/inertia'
import type { InferSharedProps } from '@adonisjs/inertia/types'

const inertiaConfig = defineConfig({
  rootView: 'inertia_layout',
  
  sharedData: {
    flash: (ctx) => ctx.session?.flashMessages.all(),
    auth: {
      user: async (ctx) => {
        try {
          await ctx.auth.check()
          if (ctx.auth.user) {
            return {
              id: ctx.auth.user.id,
              email: ctx.auth.user.email,
              firstName: ctx.auth.user.firstName,
              lastName: ctx.auth.user.lastName,
              fullName: ctx.auth.user.fullName,
              role: ctx.auth.user.role,
              isAdmin: ctx.auth.user.isAdmin(),
            }
          }
        } catch {
          // User not authenticated
        }
        return null
      },
    },
  },
  
  ssr: {
    enabled: true,
    entrypoint: 'inertia/app/ssr.tsx',
  },
})

export default inertiaConfig

declare module '@adonisjs/inertia/types' {
  export interface SharedProps extends InferSharedProps<typeof inertiaConfig> {}
}
