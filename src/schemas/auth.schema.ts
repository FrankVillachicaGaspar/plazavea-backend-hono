import { z } from '@hono/zod-openapi'

export const registerSchema = z
  .object({
    nombre: z
      .string()
      .min(2, 'Nombre debe tener al menos 2 caracteres')
      .openapi({ description: 'User name', example: 'Carlos' }),
    apellidos: z
      .string()
      .min(2, 'Apellidos debe tener al menos 2 caracteres')
      .openapi({ description: 'User last name', example: '' }),
    email: z
      .string()
      .email('Email inválido')
      .openapi({ description: 'User email', example: 'cacahuate@sample.com' }),
    password: z
      .string()
      .min(6, 'Password debe tener al menos 6 caracteres')
      .openapi({
        description: 'User password',
        example: 'securepassword123$$',
      }),
    telefono: z.string().optional().openapi({
      description: 'User phone number',
      example: '987654321',
    }),
    fechaNacimiento: z.string().optional().openapi({
      description: 'User birth date',
      example: '1990-01-01',
    }),
    genero: z.enum(['M', 'F', 'Otro']).optional().openapi({
      description: 'User gender',
      example: 'M',
    }),
    tipoDocumento: z.enum(['DNI', 'CE', 'Pasaporte']).default('DNI').openapi({
      description: 'User document type',
      example: 'DNI',
    }),
    numeroDocumento: z.string().optional().openapi({
      description: 'User document number',
      example: '12345678',
    }),
    // Dirección opcional
    departamento: z.string().optional().openapi({
      description: 'User department',
      example: 'Lima',
    }),
    provincia: z.string().optional().openapi({
      description: 'User province',
      example: 'Lima',
    }),
    distrito: z.string().optional().openapi({
      description: 'User district',
      example: 'Miraflores',
    }),
    direccion: z.string().optional().openapi({
      description: 'User address',
      example: 'Av. Principal 123',
    }),
    referencia: z.string().optional().openapi({
      description: 'User reference point',
      example: 'Oficina Central',
    }),
    codigoPostal: z.string().optional().openapi({
      description: 'User postal code',
      example: '12345',
    }),
    // Configuración
    aceptaMarketing: z.boolean().default(false).openapi({
      description: 'User marketing consent',
      example: true,
    }),
    aceptaTerminos: z
      .boolean()
      .refine(val => val === true, 'Debe aceptar términos y condiciones')
      .openapi({
        description: 'User terms consent',
        example: true,
      }),
  })
  .openapi('Register')

// Esquemas de respuesta
export const userResponseSchema = z
  .object({
    id: z.number().openapi({ description: 'ID del usuario', example: 1 }),
    nombre: z
      .string()
      .openapi({ description: 'Nombre del usuario', example: 'Juan' }),
    apellidos: z
      .string()
      .openapi({
        description: 'Apellidos del usuario',
        example: 'Pérez García',
      }),
    email: z
      .string()
      .email()
      .openapi({
        description: 'Email del usuario',
        example: 'juan@ejemplo.com',
      }),
    telefono: z
      .string()
      .nullable()
      .openapi({ description: 'Teléfono del usuario', example: '987654321' }),
    fechaRegistro: z.string().openapi({
      description: 'Fecha de registro',
      example: '2024-01-15T10:30:00.000Z',
    }),
  })
  .openapi('User')

export const authResponseSchema = z
  .object({
    user: userResponseSchema,
    token: z.string().openapi({
      description: 'JWT token',
      example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
    }),
  })
  .openapi('Auth')

export const loginSchema = z
  .object({
    email: z.string().email('Email inválido'),
    password: z.string().min(1, 'Password es requerido'),
  })
  .openapi('Login')

export const profileResponseSchema = z
  .object({
    id: z.number().openapi({ description: 'ID del usuario', example: 1 }),
    nombre: z
      .string()
      .openapi({ description: 'Nombre del usuario', example: 'Juan' }),
    apellidos: z
      .string()
      .openapi({
        description: 'Apellidos del usuario',
        example: 'Pérez García',
      }),
    email: z
      .string()
      .email()
      .openapi({
        description: 'Email del usuario',
        example: 'juan@ejemplo.com',
      }),
    telefono: z
      .string()
      .nullable()
      .openapi({ description: 'Teléfono del usuario', example: '987654321' }),
    fechaNacimiento: z
      .string()
      .nullable()
      .openapi({ description: 'Fecha de nacimiento', example: '1990-01-15' }),
    genero: z
      .enum(['M', 'F', 'Otro'])
      .nullable()
      .openapi({ description: 'Género del usuario', example: 'M' }),
    tipoDocumento: z
      .string()
      .openapi({ description: 'Tipo de documento', example: 'DNI' }),
    numeroDocumento: z
      .string()
      .nullable()
      .openapi({ description: 'Número de documento', example: '12345678' }),
    departamento: z
      .string()
      .nullable()
      .openapi({ description: 'Departamento', example: 'Lima' }),
    provincia: z
      .string()
      .nullable()
      .openapi({ description: 'Provincia', example: 'Lima' }),
    distrito: z
      .string()
      .nullable()
      .openapi({ description: 'Distrito', example: 'Miraflores' }),
    direccion: z
      .string()
      .nullable()
      .openapi({ description: 'Dirección', example: 'Av. Larco 123' }),
    referencia: z
      .string()
      .nullable()
      .openapi({ description: 'Referencia', example: 'Cerca al parque' }),
    codigoPostal: z
      .string()
      .nullable()
      .openapi({ description: 'Código postal', example: '15074' }),
    aceptaMarketing: z
      .boolean()
      .openapi({ description: 'Acepta marketing', example: false }),
    fechaRegistro: z.string().openapi({
      description: 'Fecha de registro',
      example: '2024-01-15T10:30:00.000Z',
    }),
    ultimoAcceso: z.string().nullable().openapi({
      description: 'Último acceso',
      example: '2024-01-15T12:00:00.000Z',
    }),
  })
  .openapi('Profile')

export type RegisterData = z.infer<typeof registerSchema>
export type LoginData = z.infer<typeof loginSchema>
