import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected propertiesTable = 'properties'
  protected testimonialsTable = 'testimonials'

  async up() {
    this.schema.alterTable(this.propertiesTable, (table) => {
      table.decimal('rating', 3, 1).nullable()
      table.boolean('is_popular').notNullable().defaultTo(false)
      table.index(['is_popular'])
    })

    this.schema.alterTable(this.testimonialsTable, (table) => {
      table.decimal('rating', 3, 1).nullable().alter()
    })
  }

  async down() {
    this.schema.alterTable(this.testimonialsTable, (table) => {
      table.integer('rating').nullable().alter()
    })

    this.schema.alterTable(this.propertiesTable, (table) => {
      table.dropIndex(['is_popular'])
      table.dropColumn('is_popular')
      table.dropColumn('rating')
    })
  }
}
