import { DateTime } from 'luxon'
import {
  BaseModel,
  column,
  belongsTo,
  manyToMany,
} from '@adonisjs/lucid/orm'
import type { BelongsTo, ManyToMany } from '@adonisjs/lucid/types/relations'
import Estado from './estado.js'
import Usuario from './usuario.js'

export default class Area extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare name: string

  @column()
  declare descripcion: string

  @column()
  declare icon: string | null

  @column()
  declare color: string | null

  @column()
  declare route: string | null

  @column({ columnName: 'estado_id' })
  public estadoId!: number

  @belongsTo(() => Estado)
  public estado!: BelongsTo<typeof Estado>

  @manyToMany(() => Usuario, {
    pivotTable: 'area_usuario',
  })
  public usuarios!: ManyToMany<typeof Usuario>

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}