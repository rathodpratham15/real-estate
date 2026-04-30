import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import Agent from '#models/agent'
import User from '#models/user'

export default class Contact extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column({ columnName: 'user_id' })
  declare userId: number | null

  @belongsTo(() => User, {
    foreignKey: 'userId',
  })
  declare user: BelongsTo<typeof User>

  @column()
  declare name: string

  @column()
  declare email: string

  @column()
  declare phone: string | null

  @column()
  declare subject: string | null

  @column()
  declare message: string

  @column({ columnName: 'admin_response' })
  declare adminResponse: string | null

  @column({ columnName: 'agent_id' })
  declare agentId: number | null

  @belongsTo(() => Agent, {
    foreignKey: 'agentId',
  })
  declare agent: BelongsTo<typeof Agent>

  @column()
  declare status: 'new' | 'read' | 'replied' | 'archived'

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}
