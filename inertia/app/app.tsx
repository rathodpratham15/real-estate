import '../css/app.css'
import { useEffect, useState } from 'react'
import { hydrateRoot } from 'react-dom/client'
import { createInertiaApp } from '@inertiajs/react'
import { resolvePageComponent } from '@adonisjs/inertia/helpers'
import { TooltipProvider } from '@/components/ui/tooltip'
import { Toaster } from '@/components/ui/toaster'

const appName = import.meta.env.VITE_APP_NAME || 'Realest'

const ClientSideWrapper = ({ children }: { children: React.ReactNode }) => {
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  if (!isMounted) {
    return null
  }

  return children
}

createInertiaApp({
  progress: { color: '#1e293b' },

  title: (title) => `${title} - ${appName}`,

  resolve: async (name) => {
    const page: any = await resolvePageComponent(
      `../pages/${name}.tsx`,
      import.meta.glob('../pages/**/*.tsx')
    )
    return page
  },

  setup({ el, App, props }) {
    const WrappedApp = () => (
      <TooltipProvider>
        <App {...props} />
        <ClientSideWrapper>
          <Toaster />
        </ClientSideWrapper>
      </TooltipProvider>
    )

    hydrateRoot(el, <WrappedApp />)
  },
})
