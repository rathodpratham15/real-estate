import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'properties'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').notNullable()
      table.string('title').notNullable()
      table.string('slug').notNullable().unique()
      table.text('description').nullable()
      table.string('address').notNullable()
      table.string('city').notNullable()
      table.string('state').notNullable()
      table.string('zip_code').notNullable()
      table.string('country').notNullable().defaultTo('US')
      table.decimal('price', 12, 2).notNullable()
      table.enum('property_type', ['house', 'apartment', 'condo', 'townhouse', 'land', 'commercial']).notNullable()
      table.integer('bedrooms').nullable()
      table.integer('bathrooms').nullable()
      table.integer('square_feet').nullable()
      table.integer('year_built').nullable()
      table.enum('status', ['for_sale', 'sold', 'pending', 'off_market']).notNullable().defaultTo('for_sale')
      table.boolean('featured').notNullable().defaultTo(false)
      table.string('main_image').nullable()
      table.json('images').nullable()
      table.integer('agent_id').unsigned().nullable()
      table.foreign('agent_id').references('id').inTable('agents').onDelete('SET NULL')
      table.json('features').nullable()
      table.timestamp('created_at').notNullable()
      table.timestamp('updated_at').nullable()
      
      table.index(['status'])
      table.index(['property_type'])
      table.index(['city', 'state'])
      table.index(['featured'])
      table.index(['slug'])
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
