import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'areas'

  async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table.string('icon').nullable()
      table.string('color').nullable()
      table.string('route').nullable()
    })
  }

  async down() {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropColumn('icon')
      table.dropColumn('color')
      table.dropColumn('route')
    })
  }
}