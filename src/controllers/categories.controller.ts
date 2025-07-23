import type { RouteHandler } from '@hono/zod-openapi'
import type { getCategories } from '@/routes/categories'
import { CategoryService } from '@/services/categories.service'
import { createResponse } from '@/utils/response'

export class CategoryController {
  private categoryService = new CategoryService()

  getCategories: RouteHandler<typeof getCategories> = async c => {
    try {
      const { quantity } = c.req.valid('param')

      console.log(quantity)
      const categories = await this.categoryService.getCategories(quantity)

      return c.json(
        createResponse.success(categories, 'Categorías obtenidas exitosamente'),
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
