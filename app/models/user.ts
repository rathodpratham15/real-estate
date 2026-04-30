import { DateTime } from 'luxon'
import hash from '@adonisjs/core/services/hash'
import { BaseModel, column, hasMany, manyToMany } from '@adonisjs/lucid/orm'
import type { HasMany, ManyToMany } from '@adonisjs/lucid/types/relations'
import { withAuthFinder } from '@adonisjs/auth/mixins/lucid'
import { compose } from '@adonisjs/core/helpers'
import Property from '#models/property'
import Contact from '#models/contact'

const AuthFinder = withAuthFinder(() => hash.use('scrypt'), {
  uids: ['email'],
  passwordColumnName: 'password',
})

export default class User extends compose(BaseModel, AuthFinder) {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare email: string

  @column({ serializeAs: null })
  declare password: string

  @column({ columnName: 'first_name' })
  declare firstName: string

  @column({ columnName: 'last_name' })
  declare lastName: string

  @column()
  declare role: 'admin' | 'user'

  @column({ columnName: 'is_active' })
  declare isActive: boolean

  @hasMany(() => Property)
  declare properties: HasMany<typeof Property>

  @hasMany(() => Contact)
  declare contacts: HasMany<typeof Contact>

  @manyToMany(() => Property, {
    pivotTable: 'property_user',
    pivotForeignKey: 'user_id',
    pivotRelatedForeignKey: 'property_id',
  })
  declare favoriteProperties: ManyToMany<typeof Property>

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  get fullName() {
    return `${this.firstName} ${this.lastName}`
  }

  isAdmin() {
    return this.role === 'admin'
  }
}
