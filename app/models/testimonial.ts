import { DateTime } from 'luxon'
import { BaseModel, column } from '@adonisjs/lucid/orm'

export default class Testimonial extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column({ columnName: 'client_name' })
  declare clientName: string

  @column({ columnName: 'client_photo' })
  declare clientPhoto: string | null

  @column()
  declare content: string

  @column()
  declare rating: number | null

  @column({ columnName: 'property_type' })
  declare propertyType: string | null

  @column()
  declare featured: boolean

  @column()
  declare order: number

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}
