import type { Context } from 'hono'
import type { LoginData, RegisterData } from '../schemas/auth.schema'
import { AuthService } from '../services/auth.service'
import { createResponse } from '../utils/response'

export class AuthController {
  private authService = new AuthService()

  signup = async (c: Context) => {
    try {
      const data = c.get('validatedData') as RegisterData
      const result = await this.authService.register(data)

      return c.json(
        createResponse.success(result, 'Usuario registrado exitosamente'),
        201,
      )
    } catch (error) {
      console.error('Error en signup:', error)

      if (error instanceof Error) {
        return c.json(createResponse.error(error.message), 400)
      }

      return c.json(createResponse.error('Error interno del servidor'), 500)
    }
  }

  signin = async (c: Context) => {
    try {
      const data = (await c.req.json()) as LoginData
      const result = await this.authService.login(data)

      return c.json(
        createResponse.success(result, 'Inicio de sesión exitoso'),
        200,
      )
    } catch (error) {
      console.error('Error en signin:', error)

      if (error instanceof Error) {
        return c.json(createResponse.error(error.message), 401)
      }

      return c.json(createResponse.error('Error interno del servidor'), 500)
    }
  }

  profile = async (c: Context) => {
    try {
      const user = c.get('user') as { userId: number }
      const profile = await this.authService.getProfile(user.userId)

      return c.json(
        createResponse.success(profile, 'Perfil obtenido exitosamente'),
        200,
      )
    } catch (error) {
      console.error('Error en profile:', error)

      if (error instanceof Error) {
        return c.json(createResponse.error(error.message), 404)
      }

      return c.json(createResponse.error('Error interno del servidor'), 500)
    }
  }
}
