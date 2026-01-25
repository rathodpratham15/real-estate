import { defineConfig } from '@adonisjs/core/bodyparser'

const bodyParserConfig = defineConfig({
  /**
   * The bodyparser middleware will parse the following HTTP request
   * body content types automatically.
   */
  allowedMethods: ['POST', 'PUT', 'PATCH', 'DELETE'],

  /**
   * The bodyparser middleware will only parse HTTP request body when
   * route explicitly opts-in by defining the following property.
   */
  form: {
    convertEmptyStringsToNull: true,
    types: ['application/x-www-form-urlencoded'],
  },
  json: {
    convertEmptyStringsToNull: true,
    types: [
      'application/json',
      'application/json-patch+json',
      'application/vnd.api+json',
      'application/csp-report',
    ],
  },
  raw: {
    types: ['text/*'],
  },
  multipart: {
    /**
     * Enabling auto process allows bodyparser middleware to automatically
     * process all requests by detecting their content type. Without this
     * option, you will have to manually call the `process` method.
     */
    autoProcess: true,
    processManually: [],
    /**
     * The maximum value of the `content-length` header. If the value
     * exceeds the configured value, the request will be rejected.
     */
    maxFields: 1000,
    limit: '20mb',
    types: ['multipart/form-data'],
  },
})

export default bodyParserConfig
