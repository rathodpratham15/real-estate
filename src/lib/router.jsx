import React, { createContext, useCallback, useContext, useMemo, useSyncExternalStore } from 'react'

const RouterContext = createContext({
  path: '/',
  params: {},
  navigate: () => {},
})

const subscribe = (callback) => {
  window.addEventListener('popstate', callback)
  return () => window.removeEventListener('popstate', callback)
}

const getSnapshot = () => window.location.pathname
const getServerSnapshot = () => '/'

const toPath = (to) => {
  if (typeof to === 'number') return to
  return to || '/'
}

const matchPath = (pattern, path) => {
  const patternParts = pattern.split('/').filter(Boolean)
  const pathParts = path.split('/').filter(Boolean)

  if (patternParts.length !== pathParts.length) return null

  const params = {}
  for (let index = 0; index < patternParts.length; index += 1) {
    const patternPart = patternParts[index]
    const pathPart = pathParts[index]

    if (patternPart.startsWith(':')) {
      params[patternPart.slice(1)] = decodeURIComponent(pathPart)
    } else if (patternPart !== pathPart) {
      return null
    }
  }

  return params
}

export const BrowserRouter = ({ children }) => {
  const path = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)

  const navigate = useCallback((to) => {
    const nextPath = toPath(to)

    if (typeof nextPath === 'number') {
      window.history.go(nextPath)
      return
    }

    if (nextPath !== window.location.pathname) {
      window.history.pushState({}, '', nextPath)
      window.dispatchEvent(new PopStateEvent('popstate'))
    }
  }, [])

  const value = useMemo(() => ({ path, params: {}, navigate }), [path, navigate])

  return <RouterContext.Provider value={value}>{children}</RouterContext.Provider>
}

export const Routes = ({ children }) => {
  const { path, navigate } = useContext(RouterContext)
  const routes = React.Children.toArray(children)

  for (const route of routes) {
    if (!React.isValidElement(route)) continue

    const params = matchPath(route.props.path, path)
    if (params) {
      return (
        <RouterContext.Provider value={{ path, params, navigate }}>
          {route.props.element}
        </RouterContext.Provider>
      )
    }
  }

  return null
}

export const Route = () => null

export const Link = ({ to, onClick, children, ...props }) => {
  const { navigate } = useContext(RouterContext)

  const handleClick = (event) => {
    onClick?.(event)
    if (
      event.defaultPrevented ||
      event.button !== 0 ||
      event.metaKey ||
      event.altKey ||
      event.ctrlKey ||
      event.shiftKey
    ) {
      return
    }

    event.preventDefault()
    navigate(to)
  }

  return (
    <a href={typeof to === 'string' ? to : '#'} onClick={handleClick} {...props}>
      {children}
    </a>
  )
}

export const useLocation = () => {
  const { path } = useContext(RouterContext)
  return { pathname: path }
}

export const useParams = () => {
  const { params } = useContext(RouterContext)
  return params
}

export const useNavigate = () => {
  const { navigate } = useContext(RouterContext)
  return navigate
}
