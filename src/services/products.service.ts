import { and, asc, eq, gt, like, lte, sql } from 'drizzle-orm'
import { db } from '@/config/database'
import { productos } from '@/db/schema'
import type { ProductFilterDto } from '@/schemas/products.schema'

export class ProductService {
  async getProducts(filters: ProductFilterDto) {
    const whereClause = [gt(productos.stock, 0)]

    if (filters.categoryId)
      whereClause.push(eq(productos.categoriaId, filters.categoryId))

    if (filters.maxPrice)
      whereClause.push(lte(productos.precio, filters.maxPrice))

    if (filters.searchText)
      whereClause.push(like(productos.descripcion, `%${filters.searchText}%`))

    const orderClause = (() => {
      switch (filters.orderBy) {
        case 'precioAsc':
          return productos.precio
        case 'precioDesc':
          return sql`${productos.precio} DESC`
        default:
          return sql`RANDOM()`
      }
    })()

    const offset = (filters.page - 1) * filters.limit

    const productList = await db
      .select({
        id: productos.id,
        nombre: productos.nombre,
        descripcion: productos.descripcion,
        precio: productos.precio,
        urlImagen: sql<string>`(select url from imagenes as i where i.producto_id = ${productos.id} limit 1)`,
        stock: productos.stock,
      })
      .from(productos)
      .where(and(...whereClause))
      .orderBy(orderClause, asc(productos.id))
      .limit(filters.limit)
      .offset(offset)
      .all()

    const total = await db.$count(productos, and(...whereClause))

    return {
      productos: productList,
      total,
    }
  }
}
