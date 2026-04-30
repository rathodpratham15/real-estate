import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'contacts'

  async up() {
    // Add user_id to contacts table
    this.schema.alterTable(this.tableName, (table) => {
      table.integer('user_id').unsigned().nullable().after('id')
      table.foreign('user_id').references('id').inTable('users').onDelete('SET NULL')
      table.text('admin_response').nullable().after('message')
    })

    // Create favorites pivot table
    this.schema.createTable('property_user', (table) => {
      table.increments('id')
      table.integer('user_id').unsigned().notNullable()
      table.integer('property_id').unsigned().notNullable()
      table.timestamp('created_at', { useTz: true })
      table.timestamp('updated_at', { useTz: true })

      table.foreign('user_id').references('id').inTable('users').onDelete('CASCADE')
      table.foreign('property_id').references('id').inTable('properties').onDelete('CASCADE')
      table.unique(['user_id', 'property_id'])
    })
  }

  async down() {
    this.schema.dropTable('property_user')
    this.schema.alterTable(this.tableName, (table) => {
      table.dropForeign('user_id')
      table.dropColumn('user_id')
      table.dropColumn('admin_response')
    })
  }
}
