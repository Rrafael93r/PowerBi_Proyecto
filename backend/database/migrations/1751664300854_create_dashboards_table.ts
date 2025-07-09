import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'dashboards'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')

      table.string('title', 255).notNullable()
      table.text('description').notNullable()
      table.string('thumbnail', 255).notNullable()
      table.string('url', 500).notNullable()
      table.date('last_updated')

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

      table.timestamp('created_at')
      table.timestamp('updated_at')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
