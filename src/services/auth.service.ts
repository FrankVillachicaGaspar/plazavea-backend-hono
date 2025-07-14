import { eq } from 'drizzle-orm'
import { db } from '../config/database'
import { usuarios } from '../db/schema'
import type { LoginData, RegisterData } from '../schemas/auth.schema'
import { comparePassword, hashPassword } from '../utils/hash'
import { generateToken } from '../utils/jwt'

export class AuthService {
  async register(data: RegisterData) {
    // Verificar si el usuario ya existe
    const existingUser = await db
      .select()
      .from(usuarios)
      .where(eq(usuarios.email, data.email))
      .limit(1)

    if (existingUser.length > 0) {
      throw new Error('El usuario ya existe')
    }

    // Hash de la contraseña
    const hashedPassword = await hashPassword(data.password)

    // Crear el usuario
    const [newUser] = await db
      .insert(usuarios)
      .values({
        ...data,
        password: hashedPassword,
        fechaRegistro: new Date().toISOString(),
        activo: true,
      })
      .returning({
        id: usuarios.id,
        nombre: usuarios.nombre,
        apellidos: usuarios.apellidos,
        email: usuarios.email,
        telefono: usuarios.telefono,
        fechaRegistro: usuarios.fechaRegistro,
      })

    // Generar token JWT
    const token = await generateToken({
      userId: newUser.id,
      email: newUser.email,
    })

    return {
      user: newUser,
      token,
    }
  }

  async login(data: LoginData) {
    // Buscar usuario por email
    const [user] = await db
      .select()
      .from(usuarios)
      .where(eq(usuarios.email, data.email))
      .limit(1)

    if (!user) {
      throw new Error('Credenciales inválidas')
    }

    // Verificar si el usuario está activo
    if (!user.activo) {
      throw new Error('Usuario inactivo')
    }

    // Verificar contraseña
    const isPasswordValid = await comparePassword(data.password, user.password)
    if (!isPasswordValid) {
      throw new Error('Credenciales inválidas')
    }

    // Actualizar último acceso
    await db
      .update(usuarios)
      .set({ ultimoAcceso: new Date().toISOString() })
      .where(eq(usuarios.id, user.id))

    // Generar token JWT
    const token = await generateToken({
      userId: user.id,
      email: user.email,
    })

    return {
      user: {
        id: user.id,
        nombre: user.nombre,
        apellidos: user.apellidos,
        email: user.email,
        telefono: user.telefono,
        fechaRegistro: user.fechaRegistro,
      },
      token,
    }
  }

  async getProfile(userId: number) {
    const [user] = await db
      .select({
        id: usuarios.id,
        nombre: usuarios.nombre,
        apellidos: usuarios.apellidos,
        email: usuarios.email,
        telefono: usuarios.telefono,
        fechaNacimiento: usuarios.fechaNacimiento,
        genero: usuarios.genero,
        tipoDocumento: usuarios.tipoDocumento,
        numeroDocumento: usuarios.numeroDocumento,
        departamento: usuarios.departamento,
        provincia: usuarios.provincia,
        distrito: usuarios.distrito,
        direccion: usuarios.direccion,
        referencia: usuarios.referencia,
        codigoPostal: usuarios.codigoPostal,
        aceptaMarketing: usuarios.aceptaMarketing,
        fechaRegistro: usuarios.fechaRegistro,
        ultimoAcceso: usuarios.ultimoAcceso,
      })
      .from(usuarios)
      .where(eq(usuarios.id, userId))
      .limit(1)

    if (!user) {
      throw new Error('Usuario no encontrado')
    }

    return user
  }
}
