import { db } from '@/config/database'

export class CategoryService {
  async getCategories(quantity: number) {
    const categorias = await db.query.categorias.findMany({ limit: quantity })
    return categorias
  }
}
