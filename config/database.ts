import { defineConfig } from '@adonisjs/lucid'
import env from '#start/env'

const dbConfig = defineConfig({
  connection: 'postgres',
  connections: {
    postgres: {
      client: 'pg',
      connection: {
        host: env.get('DB_HOST'),
        user: env.get('DB_USER'),
        port: env.get('DB_PORT'),
        password: env.get('DB_PASSWORD'),
        database: env.get('DB_DATABASE'),
        ssl: false,
      },
      pool: {
        min: 2,
        max: 20,
      },
      migrations: {
        naturalSort: true,
        paths: ['database/migrations'],
      },
      debug: false,
    },
  },
})

export default dbConfig
