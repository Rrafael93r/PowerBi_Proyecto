import type { HttpContext } from '@adonisjs/core/http'
import Usuario from '#models/usuario'

export default class UsuarioController {
  async index({ response }: HttpContext) {
    const usuarios = await Usuario.query().preload('areas').preload('role').preload('estado').preload('areaPrincipal')
    return response.ok(usuarios)
  }

  async store({ request, response }: HttpContext) {
    const data = request.only([
      'nombre',
      'segundo_nombre',
      'apellido_1',
      'apellido_2',
      'usuario',
      'contrasena',
      'correo',
      'roleId',
      'estadoId',
      'areaPrincipalId'
    ])
    const areas = request.input('areas', [])

    const usuario = await Usuario.create(data)
    if (areas.length > 0) {
      await usuario.related('areas').attach(areas)
    }

    // Cargar relaciones para la respuesta
    await usuario.load('areas')

    return response.created(usuario)
  }

  async show({ params, response }: HttpContext) {
    const usuario = await Usuario.query().where('id', params.id).preload('areas').preload('role').preload('estado').preload('areaPrincipal').first()
    if (!usuario) return response.notFound({ mensaje: 'Usuario no encontrado' })
    return response.ok(usuario)
  }

  async update({ params, request, response }: HttpContext) {
    const usuario = await Usuario.find(params.id)
    if (!usuario) return response.notFound({ mensaje: 'Usuario no encontrado' })

    const data = request.only([
      'nombre',
      'segundo_nombre',
      'apellido_1',
      'apellido_2',
      'usuario',
      'contrasena',
      'correo',
      'roleId',
      'estadoId',
      'areaPrincipalId'
    ])

    const areas = request.input('areas')

    usuario.merge(data)
    await usuario.save()

    if (areas) {
      await usuario.related('areas').sync(areas)
    }

    // Cargar relaciones
    await usuario.load('areas')

    return response.ok(usuario)
  }

}
