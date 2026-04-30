import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'properties'

  async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table.decimal('latitude', 10, 7).nullable().after('country')
      table.decimal('longitude', 10, 7).nullable().after('latitude')
      table.index(['latitude', 'longitude'])
    })
  }

  async down() {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropIndex(['latitude', 'longitude'])
      table.dropColumn('latitude')
      table.dropColumn('longitude')
    })
  }
}
