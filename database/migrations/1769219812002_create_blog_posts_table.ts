import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'blog_posts'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').notNullable()
      table.string('title').notNullable()
      table.string('slug').notNullable().unique()
      table.text('excerpt').nullable()
      table.text('content').notNullable()
      table.string('featured_image').nullable()
      table.string('category').nullable()
      table.integer('author_id').unsigned().nullable()
      table.foreign('author_id').references('id').inTable('agents').onDelete('SET NULL')
      table.json('tags').nullable()
      table.boolean('published').notNullable().defaultTo(false)
      table.timestamp('published_at').nullable()
      table.timestamp('created_at').notNullable()
      table.timestamp('updated_at').nullable()
      
      table.index(['published'])
      table.index(['slug'])
      table.index(['category'])
      table.index(['published_at'])
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
