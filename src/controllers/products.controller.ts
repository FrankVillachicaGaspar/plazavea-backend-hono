import type { Context } from 'hono'
import {
  type ProductFilterDto,
  productFilterSchema,
} from '@/schemas/products.schema'
import { ProductService } from '@/services/products.service'
import { createResponse } from '@/utils/response'

export class ProductController {
  private productService = new ProductService()

  getProducts = async (c: Context) => {
    try {
      const queryParams = c.req.query()

      const filters: ProductFilterDto = productFilterSchema.parse(queryParams)

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
}
