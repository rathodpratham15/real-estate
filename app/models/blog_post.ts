import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import Agent from '#models/agent'

export default class BlogPost extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare title: string

  @column()
  declare slug: string

  @column()
  declare excerpt: string | null

  @column()
  declare content: string

  @column({ columnName: 'featured_image' })
  declare featuredImage: string | null

  @column()
  declare category: string | null

  @column({ columnName: 'author_id' })
  declare authorId: number | null

  @belongsTo(() => Agent, {
    foreignKey: 'authorId',
  })
  declare author: BelongsTo<typeof Agent>

  @column({
    prepare: (value: string[] | null) => (value ? JSON.stringify(value) : null),
    consume: (value: string | null) => {
      if (!value) return []
      if (typeof value === 'string') {
        try {
          return JSON.parse(value)
        } catch {
          return []
        }
      }
      return value
    },
  })
  declare tags: string[]

  @column()
  declare published: boolean

  @column.dateTime({ columnName: 'published_at' })
  declare publishedAt: DateTime | null

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}
