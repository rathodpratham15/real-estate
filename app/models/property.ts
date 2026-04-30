import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo, manyToMany } from '@adonisjs/lucid/orm'
import type { BelongsTo, ManyToMany } from '@adonisjs/lucid/types/relations'
import Agent from '#models/agent'
import User from '#models/user'

export default class Property extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column({ columnName: 'user_id' })
  declare userId: number | null

  @belongsTo(() => User, {
    foreignKey: 'userId',
  })
  declare user: BelongsTo<typeof User>

  @column()
  declare title: string

  @column()
  declare slug: string

  @column()
  declare description: string | null

  @column()
  declare address: string

  @column()
  declare city: string

  @column()
  declare state: string

  @column({ columnName: 'zip_code' })
  declare zipCode: string

  @column()
  declare country: string

  @column()
  declare latitude: number | null

  @column()
  declare longitude: number | null

  @column()
  declare price: number

  @column({ columnName: 'property_type' })
  declare propertyType: 'house' | 'shop' | 'godown' | 'land' | 'commercial' | 'other'

  @column({ columnName: 'property_type_other' })
  declare propertyTypeOther: string | null

  @column()
  declare bedrooms: number | null

  @column()
  declare bathrooms: number | null

  @column({ columnName: 'square_feet' })
  declare squareFeet: number | null

  @column({ columnName: 'year_built' })
  declare yearBuilt: number | null

  @column()
  declare status: 'for_sale' | 'rental'

  @column()
  declare featured: boolean

  @column()
  declare rating: number | null

  @column({ columnName: 'is_popular' })
  declare isPopular: boolean

  @column({ columnName: 'main_image' })
  declare mainImage: string | null

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
  declare images: string[]

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
  declare videos: string[]

  @column({ columnName: 'agent_id' })
  declare agentId: number | null

  @belongsTo(() => Agent, {
    foreignKey: 'agentId',
  })
  declare agent: BelongsTo<typeof Agent>

  @manyToMany(() => User, {
    pivotTable: 'property_user',
    pivotForeignKey: 'property_id',
    pivotRelatedForeignKey: 'user_id',
  })
  declare favoritedBy: ManyToMany<typeof User>

  @column({
    prepare: (value: Record<string, any> | null) => (value ? JSON.stringify(value) : null),
    consume: (value: string | null) => {
      if (!value) return null
      if (typeof value === 'string') {
        try {
          return JSON.parse(value)
        } catch {
          return null
        }
      }
      return value
    },
  })
  declare features: Record<string, any> | null

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}
