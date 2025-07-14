import { createRoute, OpenAPIHono } from '@hono/zod-openapi'
import { ProductController } from '@/controllers/products.controller'
import {
  productFilterSchema,
  responseProductsWithFiltersSchema,
} from '@/schemas/products.schema'
import {
  errorResponseSchema,
  successResponseSchema,
} from '@/schemas/response.schema'

const product = new OpenAPIHono()
const productController = new ProductController()
const tag = ['Products']

const getProducts = createRoute({
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

product.openapi(getProducts, productController.getProducts)

export default product
