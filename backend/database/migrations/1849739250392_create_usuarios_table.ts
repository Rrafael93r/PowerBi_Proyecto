import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'usuarios'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.string('nombre', 255).nullable()
      table.string('segundo_nombre', 255).nullable()
      table.string('apellido_1', 255).nullable()
      table.string('apellido_2', 255).nullable()
      table.string('usuario', 255).nullable()
      table.string('contrasena', 255).nullable()
      table.string('correo', 255).nullable().unique()
      table
        .integer('role_id')
        .unsigned()
        .references('id')
        .inTable('roles')
        .onDelete('CASCADE')
        .notNullable()

      table.integer('estado_id')
        .unsigned()
        .references('id')
        .inTable('estados')
        .onDelete('CASCADE')
        .notNullable()

      table.integer('area_id')
        .unsigned()
        .references('id')
        .inTable('areas')
        .onDelete('CASCADE')
        .notNullable()

      table.datetime('created_at').notNullable().defaultTo(this.now())
      table.datetime('updated_at').notNullable().defaultTo(this.now())
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
