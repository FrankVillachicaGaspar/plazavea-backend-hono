import type { RouteHandler } from '@hono/zod-openapi'
import type {
  getProductById,
  getProducts,
  getRecommendedProducts,
} from '@/routes/products'
import { ProductService } from '@/services/products.service'
import { createResponse } from '@/utils/response'

export class ProductController {
  private productService = new ProductService()

  getProductById: RouteHandler<typeof getProductById> = async c => {
    try {
      const { id } = c.req.valid('param')

      const product = await this.productService.getProductById(id)

      return c.json(
        createResponse.success(product, 'Productos obtenidos exitosamente'),
        200,
      )
    } catch (error) {
      if (error instanceof Error) {
        return c.json(createResponse.error(error.message), 400)
      }
      return c.json(createResponse.error('Error interno del servidor'), 500)
    }
  }

  getProducts: RouteHandler<typeof getProducts> = async c => {
    try {
      const filters = c.req.valid('query')

      const products = await this.productService.getProducts(filters)

      return c.json(
        createResponse.success(products, 'Productos obtenidos exitosamente'),
        200,
      )
    } catch (error) {
      if (error instanceof Error) {
        return c.json(createResponse.error(error.message), 400)
      }
      return c.json(createResponse.error('Error interno del servidor'), 500)
    }
  }

  getRecommendedProducts: RouteHandler<typeof getRecommendedProducts> =
    async c => {
      try {
        const { quantity } = c.req.valid('param')

        const products =
          await this.productService.getRecommendedProducts(quantity)

        return c.json(
          createResponse.success(
            products,
            'Productos recomendados obtenidos exitosamente',
          ),
          200,
        )
      } catch (error) {
        if (error instanceof Error) {
          return c.json(createResponse.error(error.message), 400)
        }
        return c.json(createResponse.error('Error interno del servidor'), 500)
      }
    }
}
