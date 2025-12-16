import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'area_usuario'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.integer('usuario_id').unsigned().references('usuarios.id').onDelete('CASCADE')
      table.integer('area_id').unsigned().references('areas.id').onDelete('CASCADE')
      table.unique(['usuario_id', 'area_id'])
      table.timestamp('created_at')
      table.timestamp('updated_at')
    })

    this.schema.alterTable('usuarios', (table) => {
      table.dropForeign('area_id')
      table.dropColumn('area_id')
    })
  }

  async down() {
    this.schema.table('usuarios', (table) => {
      table.integer('area_id').unsigned().references('areas.id').onDelete('SET NULL')
    })

    this.schema.dropTable(this.tableName)
  }
}