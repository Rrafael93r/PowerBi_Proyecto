import type { HttpContext } from '@adonisjs/core/http'
import Role from '#models/role'

export default class RolesController {
    async index({ response }: HttpContext) {
        const roles = await Role.all()
        return response.ok(roles)
    }

    async store({ request, response }: HttpContext) {
        const data = request.only(['name', 'description'])
        const role = await Role.create(data)
        return response.created(role)
    }
    async show({ params, response }: HttpContext) {
        const role = await Role.find(params.id)
        if (!role) return response.notFound({ mensaje: 'Rol no encontrado' })
        return response.ok(role)
    }
    async update({ params, request, response }: HttpContext) {
        const role = await Role.find(params.id)
        if (!role) return response.notFound({ mensaje: 'Rol no encontrado' })
        const data = request.only(['name', 'description'])
        role.merge(data)
        await role.save()
        return response.ok(role)
    }
    async destroy({ params, response }: HttpContext) {
        const role = await Role.find(params.id)
        if (!role) return response.notFound({ mensaje: 'Rol no encontrado' })
        await role.delete()
        return response.ok({ mensaje: 'Rol eliminado' })
    }

}