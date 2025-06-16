import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'areas'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.string('name', 255).notNullable().unique()
      table.string('descripcion', 500).nullable()
      table
        .integer('estado_id')
        .unsigned()
        .references('id')
        .inTable('estados')
        .onDelete('CASCADE')
        .notNullable()
      table.datetime('created_at').nullable().defaultTo(this.now())
      table.datetime('updated_at').nullable().defaultTo(this.now())
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
