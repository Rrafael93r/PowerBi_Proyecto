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
      table.string('estado', 50).nullable().defaultTo('activo')
      table.string('visualizacion', 50).nullable().defaultTo('todos')

      table.timestamp('created_at').nullable()
      table.timestamp('updated_at').nullable()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
