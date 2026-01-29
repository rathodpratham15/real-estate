import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'contacts'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.string('name').notNullable()
      table.string('email').notNullable()
      table.string('phone').nullable()
      table.string('subject').nullable()
      table.text('message').notNullable()
      table.integer('agent_id').unsigned().nullable()
      table.foreign('agent_id').references('id').inTable('agents').onDelete('SET NULL')
      table.enum('status', ['new', 'read', 'replied', 'archived']).defaultTo('new')
      table.timestamp('created_at', { useTz: true })
      table.timestamp('updated_at', { useTz: true })
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
