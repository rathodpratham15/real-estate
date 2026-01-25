import { DateTime } from 'luxon'
import { BaseModel, column, hasMany } from '@adonisjs/lucid/orm'
import type { HasMany } from '@adonisjs/lucid/types/relations'
import Property from '#models/property'

export default class Agent extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column({ columnName: 'first_name' })
  declare firstName: string

  @column({ columnName: 'last_name' })
  declare lastName: string

  @column()
  declare email: string

  @column()
  declare phone: string | null

  @column()
  declare bio: string | null

  @column()
  declare photo: string | null

  @column({ columnName: 'license_number' })
  declare licenseNumber: string | null

  @column({ columnName: 'years_of_experience' })
  declare yearsOfExperience: number | null

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
  declare specialties: string[]

  @column({
    columnName: 'social_links',
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
  declare socialLinks: Record<string, string> | null

  @column({ columnName: 'is_active' })
  declare isActive: boolean

  @hasMany(() => Property)
  declare properties: HasMany<typeof Property>

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}
