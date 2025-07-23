import { createRoute, OpenAPIHono, z } from '@hono/zod-openapi'
import { CategoryController } from '@/controllers/categories.controller'
import { categoriaDto, getCategoriesParams } from '@/schemas/categories.schema'
import {
  errorResponseSchema,
  successResponseSchema,
} from '@/schemas/response.schema'

const category = new OpenAPIHono()
const categoryController = new CategoryController()
const tag = ['Category']

export const getCategories = createRoute({
  method: 'get',
  path: '/{quantity}',
  tags: tag,
  summary: 'Obtener todas las categorías',
  description: 'Obtiene una lista de todas las categorías',
  request: {
    params: getCategoriesParams,
  },
  responses: {
    200: {
      description: 'Categorías obtenidas exitosamente',
      content: {
        'application/json': {
          schema: successResponseSchema(z.array(categoriaDto)),
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

category.openapi(getCategories, categoryController.getCategories)

export default category
