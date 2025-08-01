import { createRoute, OpenAPIHono, z } from '@hono/zod-openapi'
import { ProductController } from '@/controllers/products.controller'
import {
  productByIdParam,
  productFilterSchema,
  responseProductByIdSchema,
  responseProductSchema,
  responseProductsWithFiltersSchema,
} from '@/schemas/products.schema'
import {
  errorResponseSchema,
  successResponseSchema,
} from '@/schemas/response.schema'

const product = new OpenAPIHono()
const productController = new ProductController()
const tag = ['Productos']

export const getProducts = createRoute({
  method: 'get',
  path: '/',
  tags: tag,
  summary: 'Obtener todos los productos',
  description: 'Obtiene una lista de todos los productos',
  request: {
    query: productFilterSchema,
  },
  responses: {
    200: {
      description: 'Productos obtenidos exitosamente',
      content: {
        'application/json': {
          schema: successResponseSchema(responseProductsWithFiltersSchema),
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

export const getProductById = createRoute({
  method: 'get',
  path: '/{id}',
  tags: tag,
  summary: 'Obtener todos los productos',
  description: 'Obtiene una lista de todos los productos',
  request: {
    params: productByIdParam,
  },
  responses: {
    200: {
      description: 'Productos obtenidos exitosamente',
      content: {
        'application/json': {
          schema: successResponseSchema(responseProductByIdSchema),
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

export const getRecommendedProducts = createRoute({
  method: 'get',
  path: '/recommended/{quantity}',
  tags: tag,
  summary: 'Obtener productos recomendados',
  description: 'Obtiene una lista de productos recomendados',
  request: {
    params: z.object({
      quantity: z
        .string()
        .transform(Number)
        .refine(val => val > 0)
        .default('10'),
    }),
  },
  responses: {
    200: {
      description: 'Productos obtenidos exitosamente',
      content: {
        'application/json': {
          schema: successResponseSchema(z.array(responseProductSchema)),
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

product.openapi(getProducts, productController.getProducts)
product.openapi(getProductById, productController.getProductById)
product.openapi(
  getRecommendedProducts,
  productController.getRecommendedProducts,
)

export default product
