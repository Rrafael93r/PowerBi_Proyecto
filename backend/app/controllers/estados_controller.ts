import { HttpContext } from '@adonisjs/core/http'
import Estado from '#models/estado'

export default class EstadosController {
    async index({ response }: HttpContext) {
        const estados = await Estado.all()
        return response.ok(estados)
    }
    async store({ request, response }: HttpContext) {
        const data = request.only(['name', 'description'])
        const estado = await Estado.create(data)
        return response.created(estado)
    }
    async show({ params, response }: HttpContext) {
        const estado = await Estado.find(params.id)
        if (!estado) return response.notFound({ mensaje: 'Estado no encontrado' })
        return response.ok(estado)
    }
    async update({ params, request, response }: HttpContext) {
        const estado = await Estado.find(params.id)
        if (!estado) return response.notFound({ mensaje: 'Estado no encontrado' })
        const data = request.only(['name', 'description'])
        estado.merge(data)
        await estado.save()
        return response.ok(estado)
    }
}