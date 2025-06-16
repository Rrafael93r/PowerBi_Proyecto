import { HttpContext } from '@adonisjs/core/http'
import Area from '#models/area'


export default class AreasController {

async index({ response }: HttpContext) {
    const areas = await Area.all()
    return response.ok(areas)
  }
    async store({ request, response }: HttpContext) {
        const data = request.only(['name', 'description'])
        const area = await Area.create(data)
        return response.created(area)
    }
    async show({ params, response }: HttpContext) {
        const area = await Area.find(params.id)
        if (!area) return response.notFound({ mensaje: 'Área no encontrada' })
        return response.ok(area)
    }
    async update({ params, request, response }: HttpContext) {
        const area = await Area.find(params.id)
        if (!area) return response.notFound({ mensaje: 'Área no encontrada' })
        const data = request.only(['name', 'description'])
        area.merge(data)
        await area.save()
        return response.ok(area)
    }
    
}