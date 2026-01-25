import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'testimonials'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').notNullable()
      table.string('client_name').notNullable()
      table.string('client_photo').nullable()
      table.text('content').notNullable()
      table.integer('rating').nullable()
      table.string('property_type').nullable()
      table.boolean('featured').notNullable().defaultTo(false)
      table.integer('order').notNullable().defaultTo(0)
      table.timestamp('created_at').notNullable()
      table.timestamp('updated_at').nullable()
      
      table.index(['featured'])
      table.index(['order'])
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
