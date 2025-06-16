import { DateTime } from 'luxon'
import Hash from '@adonisjs/core/services/hash'
import {
  BaseModel,
  column,
  belongsTo,
  beforeSave
} from '@adonisjs/lucid/orm'

import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import Role from '../models/role.js'
import Area from '../models/area.js'
import Estado from '../models/estado.js'

export default class Usuario extends BaseModel {
  @column({ isPrimary: true })
  public id!: number


  @column()
  public nombre!: string

  @column()
  public segundo_nombre!: string

  @column()
  public apellido_2!: string

  @column()
  public apellido_1!: string

  @column()
  public correo!: string

  @column()
  public usuario!: string

  @column({ serializeAs: null })
  public contrasena!: string

  @column({ columnName: 'role_id' })
  public roleId!: number

  @belongsTo(() => Role)
  public role!: BelongsTo<typeof Role>

  @column({ columnName: 'estado_id' })
  public estadoId!: number

  @belongsTo(() => Estado)
  public estado!: BelongsTo<typeof Estado>

  @column({ columnName: 'area_id' })
  public areaId!: number

  @belongsTo(() => Area)
  public area!: BelongsTo<typeof Area>

  @column.dateTime({ autoCreate: true })
  public createdAt!: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt!: DateTime

  @beforeSave()
  public static async hashPassword(usuario: Usuario) {
    if (usuario.$dirty.contrasena) {
      usuario.contrasena = await Hash.make(usuario.contrasena)
    }
  }
}
