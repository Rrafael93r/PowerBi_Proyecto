import type { HttpContext } from "@adonisjs/core/http"
import Usuario from "#models/usuario"

export default class AuthController {
  public async login({ request, response }: HttpContext) {
    const { usuario, contrasena } = request.only(["usuario", "contrasena"])

    if (!usuario || !contrasena) {
      return response.badRequest({ mensaje: "Usuario y contraseña son requeridos" })
    }

    try {
      // Buscar el usuario con sus relaciones
      const user = await Usuario.query()
        .where("usuario", usuario)
        .preload("role")
        .preload("area")
        .preload("estado")
        .first()

      if (!user) {
        return response.unauthorized({ error: "Credenciales incorrectas" })
      }

      // Verificar la contraseña usando el método del modelo
      const isValidPassword = await user.verifyPassword(contrasena)

      if (!isValidPassword) {
        return response.unauthorized({ error: "Credenciales incorrectas" })
      }

      // Generar token usando el sistema de access tokens
      const token = await Usuario.accessTokens.create(user)

      return response.ok({
        token: token.value!.release(),
        usuario: {
          id: user.id,
          nombre: user.nombre,
          segundo_nombre: user.segundo_nombre,
          apellido_1: user.apellido_1,
          apellido_2: user.apellido_2,
          correo: user.correo,
          usuario: user.usuario,
          role: user.role,
          area: user.area,
          estado: user.estado,
        },
      })
    } catch (error) {
      console.error("Error en login:", error)
      return response.unauthorized({ error: "Credenciales incorrectas" })
    }
  }

  public async logout({ auth, response }: HttpContext) {
    try {
      const user = auth.getUserOrFail() as Usuario

      // Obtener el token actual y eliminarlo específicamente
      const tokens = await Usuario.accessTokens.all(user)

      // Eliminar TODOS los tokens del usuario para mayor seguridad
      for (const token of tokens) {
        await Usuario.accessTokens.delete(user, token.identifier)
      }

      return response.ok({
        mensaje: "Sesión cerrada correctamente",
        success: true,
      })
    } catch (error) {
      console.error("Error en logout:", error)
      return response.ok({
        mensaje: "Sesión cerrada",
        success: true,
      }) // Siempre retornar success para que el frontend limpie
    }
  }

  public async me({ auth, response }: HttpContext) {
    try {
      // Obtener el usuario autenticado y hacer cast al tipo Usuario
      const authUser = auth.getUserOrFail() as Usuario

      // Buscar el usuario completo con sus relaciones usando el ID
      const user = await Usuario.query()
        .where("id", authUser.id)
        .preload("role")
        .preload("area")
        .preload("estado")
        .firstOrFail()

      return response.ok({
        usuario: {
          id: user.id,
          nombre: user.nombre,
          segundo_nombre: user.segundo_nombre,
          apellido_1: user.apellido_1,
          apellido_2: user.apellido_2,
          correo: user.correo,
          usuario: user.usuario,
          role: user.role,
          area: user.area,
          estado: user.estado,
        },
      })
    } catch (error) {
      return response.unauthorized({ error: "Token inválido" })
    }
  }
}
