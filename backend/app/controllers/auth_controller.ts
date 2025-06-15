
import type { HttpContext } from '@adonisjs/core/http'
import Usuario from '#models/usuario'
import Hash from '@adonisjs/core/services/hash'

export default class AuthController {
  public async login({ request, response }: HttpContext) {
    const { usuario, contrasena } = request.only(['usuario', 'contrasena'])

    const user = await Usuario.query()
      .where('usuario', usuario)
      .preload('role') // si quieres traer info del rol
      .first()

    if (!user) {
      return response.unauthorized({ mensaje: 'Usuario no encontrado' })
    }

    const isPasswordValid = await Hash.verify(user.contrasena, contrasena)
    if (!isPasswordValid) {
      return response.unauthorized({ mensaje: 'Contraseña incorrecta' })
    }

    return response.ok({
      mensaje: 'Inicio de sesión exitoso',
      usuario: {
        id: user.id,
        nombre: user.nombre,
        usuario: user.usuario,
        rol: user.role.name, 
        estado: user.estado,
        visualizacion: user.visualizacion,
      },
    })
  }
}
