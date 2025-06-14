import type { HttpContext } from '@adonisjs/core/http'
import Usuario from '#models/usuario'

export default class UsuarioController {
  async index({ response }: HttpContext) {
    const usuarios = await Usuario.all()
    return response.ok(usuarios)
  }

  async store({ request, response }: HttpContext) {
    const data = request.only(['nombre', 'contrasena', 'correo', 'rol', 'estado', 'visualizacion'])
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
    const data = request.only(['nombre', 'contrasena', 'correo', 'rol', 'estado', 'visualizacion'])
    usuario.merge(data)
    await usuario.save()
    return response.ok(usuario)
  }

}
