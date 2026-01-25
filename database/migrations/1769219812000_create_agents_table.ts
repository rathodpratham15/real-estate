import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'agents'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').notNullable()
      table.string('first_name').notNullable()
      table.string('last_name').notNullable()
      table.string('email').notNullable()
      table.string('phone').nullable()
      table.text('bio').nullable()
      table.string('photo').nullable()
      table.string('license_number').nullable()
      table.integer('years_of_experience').nullable()
      table.json('specialties').nullable()
      table.json('social_links').nullable()
      table.boolean('is_active').notNullable().defaultTo(true)
      table.timestamp('created_at').notNullable()
      table.timestamp('updated_at').nullable()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
