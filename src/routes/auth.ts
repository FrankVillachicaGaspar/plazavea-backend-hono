import { createRoute, OpenAPIHono } from '@hono/zod-openapi'
import {
  errorResponseSchema,
  successResponseSchema,
} from '@/schemas/response.schema'
import { AuthController } from '../controllers/auth.controller'
import { authenticateJWT } from '../middleware/auth'
import {
  authResponseSchema,
  loginSchema,
  profileResponseSchema,
  registerSchema,
} from '../schemas/auth.schema'

const auth = new OpenAPIHono()
const authController = new AuthController()
const tag = ['Authentication']

// Public routes
const signUpRoute = createRoute({
  method: 'post',
  path: '/signup',
  tags: tag,
  summary: 'Registrar un nuevo usuario',
  description: 'Registrar un nuevo usuario con la información ingresada',
  request: {
    body: {
      content: {
        'application/json': {
          schema: registerSchema,
        },
      },
    },
  },
  responses: {
    201: {
      description: 'User registered successfully',
      content: {
        'application/json': {
          schema: successResponseSchema(authResponseSchema),
        },
      },
    },
    400: {
      description: 'Bad request',
      content: {
        'application/json': {
          schema: errorResponseSchema,
        },
      },
    },
    500: {
      description: 'Internal server error',
      content: {
        'application/json': {
          schema: errorResponseSchema,
        },
      },
    },
  },
})

const signInRoute = createRoute({
  method: 'post',
  path: '/signin',
  tags: tag,
  summary: 'Iniciar sesión',
  description: 'Autentica un usuario y devuelve un token JWT',
  request: {
    body: {
      content: {
        'application/json': {
          schema: loginSchema,
        },
      },
    },
  },
  responses: {
    200: {
      content: {
        'application/json': {
          schema: successResponseSchema(authResponseSchema),
        },
      },
      description: 'Inicio de sesión exitoso',
    },
    401: {
      content: {
        'application/json': {
          schema: errorResponseSchema,
        },
      },
      description: 'Credenciales inválidas',
    },
    500: {
      content: {
        'application/json': {
          schema: errorResponseSchema,
        },
      },
      description: 'Error interno del servidor',
    },
  },
})

const profileRoute = createRoute({
  method: 'get',
  path: '/profile',
  tags: ['Authentication'],
  summary: 'Obtener perfil del usuario',
  description: 'Obtiene el perfil del usuario autenticado',
  middleware: [authenticateJWT] as const,
  security: [
    {
      Bearer: [],
    },
  ],
  responses: {
    200: {
      content: {
        'application/json': {
          schema: successResponseSchema(profileResponseSchema),
        },
      },
      description: 'Perfil obtenido exitosamente',
    },
    401: {
      content: {
        'application/json': {
          schema: errorResponseSchema,
        },
      },
      description: 'Token inválido o no proporcionado',
    },
    404: {
      content: {
        'application/json': {
          schema: errorResponseSchema,
        },
      },
      description: 'Usuario no encontrado',
    },
    500: {
      content: {
        'application/json': {
          schema: errorResponseSchema,
        },
      },
      description: 'Error interno del servidor',
    },
  },
})

// Rutas públicas
auth.openapi(signUpRoute, authController.signup)
auth.openapi(signInRoute, authController.signin)
auth.openapi(profileRoute, authController.profile)

export default auth
