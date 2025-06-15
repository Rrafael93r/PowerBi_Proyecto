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

  @column()
  public estado!: string

  @column()
  public visualizacion!: string

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
