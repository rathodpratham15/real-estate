import { defineConfig } from '@adonisjs/shield'

const shieldConfig = defineConfig({
  /**
   * Configure CSP policies to control and secure resources which can
   * be loaded on your website.
   *
   * Learn more at https://developer.mozilla.org/en-US/docs/Web/HTTP/CSP
   */
  csp: {
    enabled: false,
    directives: {},
    reportOnly: false,
  },
  /**
   * Configure CSRF protection options. By default, we use the SameSite
   * cookie to detect risk and then validate the CSRF token.
   *
   * Learn more at https://developer.mozilla.org/en-US/docs/Web/HTTP/Cookies#samesite_attribute
   */
  csrf: {
    enabled: true,
    exceptRoutes: [],
    enableXsrfCookie: true,
    methods: ['POST', 'PUT', 'PATCH', 'DELETE'],
  },
  /**
   * Control how your website should be embedded inside iFrames
   */
  xFrame: {
    enabled: true,
    action: 'DENY',
  },
  /**
   * Force browser to always use HTTPS
   */
  hsts: {
    enabled: true,
    maxAge: '180 days',
  },
  /**
   * Disable browsers from sniffing the content type of a response
   * outside the declared content-type
   */
  contentTypeSniffing: {
    enabled: true,
  },
})

export default shieldConfig
