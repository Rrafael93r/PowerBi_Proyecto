import type { HttpContext } from '@adonisjs/core/http'
import Usuario from '#models/usuario'

export default class UsuarioController {
  async index({ response }: HttpContext) {
    const usuarios = await Usuario.all()
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
      'estado',
      'visualizacion'
    ])
    const usuario = await Usuario.create(data)
    return response.created(usuario)
  }

  async show({ params, response }: HttpContext) {
    const usuario = await Usuario.find(params.id)
    if (!usuario) return response.notFound({ mensaje: 'Usuario no encontrado' })
    return response.ok(usuario)
  }

  async update({ params, request, response }: HttpContext) {
    const usuario = await Usuario.find(params.id)
    if (!usuario) return response.notFound({ mensaje: 'Usuario no encontrado' })
    const data = request.only(['nombre',
      'segundo_nombre',
      'apellido_1',
      'apellido_2',
      'usuario',
      'contrasena',
      'correo',
      'roleId', 
      'estado',
      'visualizacion'])
    usuario.merge(data)
    await usuario.save()
    return response.ok(usuario)
  }

}
