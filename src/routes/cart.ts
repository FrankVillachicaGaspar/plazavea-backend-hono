import { createRoute, OpenAPIHono, z } from '@hono/zod-openapi'
import { CartController } from '@/controllers/cart.controller'
import { authenticateJWT } from '@/middleware/auth'
import { addCartItemParam, cartItem } from '@/schemas/cart.schema'
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
          schema: successResponseSchema(z.array(cartItem)),
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

carts.openapi(getCartByUserId, cartController.getCartByUserId)
carts.openapi(addCartItem, cartController.addCartItem)
carts.openapi(decreaseCartItem, cartController.decreaseCartItem)
carts.openapi(removeCartItem, cartController.removeCartItem)

export default carts
