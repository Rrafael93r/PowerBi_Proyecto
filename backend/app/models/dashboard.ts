import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import Area from './area.js'
import Estado from './estado.js'

export default class Dashboard extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare title: string

  @column()
  declare description: string

  @column()
  declare thumbnail: string

  @column()
  declare url: string

  @column.date()
  declare lastUpdated: DateTime

  @column({ columnName: 'estado_id' })
  declare estadoId: number

  @column({ columnName: 'area_id' })
  declare areaId: number

  @belongsTo(() => Area)
  declare area: BelongsTo<typeof Area>

  @belongsTo(() => Estado)
  declare estado: BelongsTo<typeof Estado>

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}