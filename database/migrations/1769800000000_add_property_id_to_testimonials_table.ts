import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'testimonials'

  async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table
        .integer('property_id')
        .unsigned()
        .nullable()
        .references('id')
        .inTable('properties')
        .onDelete('SET NULL')

      table.index(['property_id'])
    })
  }

  async down() {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropIndex(['property_id'])
      table.dropColumn('property_id')
    })
  }
}
