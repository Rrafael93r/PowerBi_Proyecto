import type { DateTime } from "luxon"
import { BaseModel, column, beforeSave, belongsTo } from "@adonisjs/lucid/orm"
import type { BelongsTo } from "@adonisjs/lucid/types/relations"
import Hash from "@adonisjs/core/services/hash"
import { DbAccessTokensProvider } from "@adonisjs/auth/access_tokens"

import Role from "#models/role"
import Area from "#models/area"
import Estado from "#models/estado"

export default class Usuario extends BaseModel {
  // Configurar el proveedor de access tokens
  static accessTokens = DbAccessTokensProvider.forModel(Usuario)

  @column({ isPrimary: true })
  declare id: number

  @column()
  declare nombre: string

  @column()
  declare segundo_nombre: string

  @column()
  declare apellido_1: string

  @column()
  declare apellido_2: string

  @column()
  declare correo: string

  @column()
  declare usuario: string

  @column({ serializeAs: null })
  declare contrasena: string

  @column({ columnName: "role_id" })
  declare roleId: number

  @belongsTo(() => Role)
  declare role: BelongsTo<typeof Role>

  @column({ columnName: "estado_id" })
  declare estadoId: number

  @belongsTo(() => Estado)
  declare estado: BelongsTo<typeof Estado>

  @column({ columnName: "area_id" })
  declare areaId: number

  @belongsTo(() => Area)
  declare area: BelongsTo<typeof Area>

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  @beforeSave()
  public static async hashPassword(usuario: Usuario) {
    if (usuario.$dirty.contrasena) {
      usuario.contrasena = await Hash.make(usuario.contrasena)
    }
  }

  // Método para verificar contraseña
  public async verifyPassword(plainPassword: string): Promise<boolean> {
    return Hash.verify(this.contrasena, plainPassword)
  }

  // Método estático para encontrar usuario por campo 'usuario' (para autenticación)
  public static async findForAuth(value: string) {
    return this.query().where("usuario", value).first()
  }
}
