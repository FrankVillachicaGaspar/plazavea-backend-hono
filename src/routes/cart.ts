import { createRoute, OpenAPIHono, z } from '@hono/zod-openapi'
import { CartController } from '@/controllers/cart.controller'
import { authenticateJWT } from '@/middleware/auth'
import { addCartItemParam, CartItem } from '@/schemas/cart.schema'
import {
  errorResponseSchema,
  successMessageResponseSchema,
  successResponseSchema,
} from '@/schemas/response.schema'

const carts = new OpenAPIHono()
const cartController = new CartController()
const tag = ['Carrito']

export const getCartByUserId = createRoute({
  method: 'get',
  path: '/',
  tags: tag,
  summary: 'Obtener todos los productos del carrito',
  description: 'Obtiene una lista de todos los productos del carrito',
  middleware: [authenticateJWT] as const,
  security: [
    {
      Bearer: [],
    },
  ],
  responses: {
    200: {
      description: 'Productos obtenidos exitosamente',
      content: {
        'application/json': {
          schema: successResponseSchema(z.array(CartItem)),
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

export const addCartItem = createRoute({
  method: 'post',
  path: 'add-item/{idProducto}',
  tags: tag,
  summary: 'Agregar producto al carrito',
  description: 'Agrega un producto al carrito',
  request: {
    params: addCartItemParam,
  },
  middleware: [authenticateJWT] as const,
  security: [
    {
      Bearer: [],
    },
  ],
  responses: {
    200: {
      description: 'Productos agregado exitosamente al carrito',
      content: {
        'application/json': {
          schema: successMessageResponseSchema,
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

export const decreaseCartItem = createRoute({
  method: 'post',
  path: 'decrease-item/{idProducto}',
  tags: tag,
  summary: 'Disminuir cantidad producto en el carrito',
  description: 'Disminuye la cantidad de un producto en el carrito',
  request: {
    params: addCartItemParam,
  },
  middleware: [authenticateJWT] as const,
  security: [
    {
      Bearer: [],
    },
  ],
  responses: {
    200: {
      description: 'Productos disminuido exitosamente del carrito',
      content: {
        'application/json': {
          schema: successMessageResponseSchema,
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

export const removeCartItem = createRoute({
  method: 'delete',
  path: 'remove-item/{idProducto}',
  tags: tag,
  summary: 'Eliminar producto del carrito',
  description: 'Elimina un producto del carrito',
  request: {
    params: addCartItemParam,
  },
  middleware: [authenticateJWT] as const,
  security: [
    {
      Bearer: [],
    },
  ],
  responses: {
    200: {
      description: 'Productos eliminado exitosamente del carrito',
      content: {
        'application/json': {
          schema: successMessageResponseSchema,
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

export const getCount = createRoute({
  method: 'get',
  path: '/count',
  tags: tag,
  summary: 'Obtener cantidad de productos del carrito',
  description: 'Obtiene la cantidad de productos del carrito',
  middleware: [authenticateJWT] as const,
  security: [
    {
      Bearer: [],
    },
  ],
  responses: {
    200: {
      description: 'Cantidad de productos obtenida exitosamente',
      content: {
        'application/json': {
          schema: successResponseSchema(
            z.object({
              count: z.number(),
            }),
          ),
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

export const getResume = createRoute({
  method: 'get',
  path: '/resume',
  tags: tag,
  summary: 'Obtener resumen del carrito',
  description: 'Obtiene el resumen del carrito',
  middleware: [authenticateJWT] as const,
  security: [
    {
      Bearer: [],
    },
  ],
  responses: {
    200: {
      description: 'Resumen del carrito obtenido exitosamente',
      content: {
        'application/json': {
          schema: successResponseSchema(
            z.object({
              subTotal: z.number(),
              envio: z.number(),
              total: z.number(),
            }),
          ),
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

export const clearCart = createRoute({
  method: 'delete',
  path: '/clear',
  tags: tag,
  summary: 'Limpiar carrito',
  description: 'Limpia el carrito',
  middleware: [authenticateJWT] as const,
  security: [
    {
      Bearer: [],
    },
  ],
  responses: {
    200: {
      description: 'Carrito limpiado exitosamente',
      content: {
        'application/json': {
          schema: successMessageResponseSchema,
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

carts.openapi(getCartByUserId, cartController.getCartByUserId)
carts.openapi(addCartItem, cartController.addCartItem)
carts.openapi(decreaseCartItem, cartController.decreaseCartItem)
carts.openapi(removeCartItem, cartController.removeCartItem)
carts.openapi(getCount, cartController.getCount)
carts.openapi(getResume, cartController.getResume)
carts.openapi(clearCart, cartController.clearCart)

export default carts
