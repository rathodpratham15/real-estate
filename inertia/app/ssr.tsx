import ReactDOMServer from 'react-dom/server'
import { createInertiaApp } from '@inertiajs/react'
import { Suspense } from 'react'
import { TooltipProvider } from '@/components/ui/tooltip'

export default function render(page: any) {
  return createInertiaApp({
    page,
    render: ReactDOMServer.renderToString,
    resolve: (name) => {
      const pages = import.meta.glob('../pages/**/*.tsx', { eager: true })
      return pages[`../pages/${name}.tsx`]
    },
    setup: ({ App, props }) => (
      <Suspense fallback={<div></div>}>
        <TooltipProvider>
          <App {...props} />
        </TooltipProvider>
      </Suspense>
    ),
  })
}
