import { defineConfig, transports } from '@adonisjs/mail'
import env from '#start/env'

const mailConfig = defineConfig({
  default: 'smtp',
  mailers: {
    smtp: transports.smtp({
      host: env.get('SMTP_HOST', 'smtp.gmail.com'),
      port: env.get('SMTP_PORT', 587),
      secure: false,
      auth: {
        user: env.get('SMTP_USER'),
        pass: env.get('SMTP_PASSWORD'),
      },
    }),
  },
  from: {
    address: env.get('MAIL_FROM_ADDRESS', 'noreply@realest.com'),
    name: env.get('MAIL_FROM_NAME', 'Realest'),
  },
})

export default mailConfig
