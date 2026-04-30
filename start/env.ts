import { Env } from '@adonisjs/core/env'

export default await Env.create(new URL('../', import.meta.url), {
  NODE_ENV: Env.schema.enum(['development', 'production', 'test'] as const),
  DEBUG: Env.schema.boolean(),
  PORT: Env.schema.number(),
  APP_KEY: Env.schema.string(),
  APP_NAME: Env.schema.string.optional(),
  HOST: Env.schema.string({ format: 'host' }),
  LOG_LEVEL: Env.schema.string(),
  
  SESSION_DRIVER: Env.schema.enum(['cookie', 'memory'] as const),
  
  // Database
  DB_HOST: Env.schema.string(),
  DB_PORT: Env.schema.number(),
  DB_USER: Env.schema.string(),
  DB_PASSWORD: Env.schema.string(),
  DB_DATABASE: Env.schema.string(),
  
  // WhatsApp (optional)
  WHATSAPP_NUMBER: Env.schema.string.optional(),
  GOOGLE_MAPS_API_KEY: Env.schema.string.optional(),
  DEFAULT_MAP_LATITUDE: Env.schema.number.optional(),
  DEFAULT_MAP_LONGITUDE: Env.schema.number.optional(),
  
  // Email configuration
  SMTP_HOST: Env.schema.string.optional(),
  SMTP_PORT: Env.schema.number.optional(),
  SMTP_USER: Env.schema.string.optional(),
  SMTP_PASSWORD: Env.schema.string.optional(),
  MAIL_FROM_ADDRESS: Env.schema.string.optional(),
  MAIL_FROM_NAME: Env.schema.string.optional(),
  ADMIN_EMAIL: Env.schema.string.optional(),
})
