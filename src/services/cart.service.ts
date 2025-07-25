import { and, eq, sql } from 'drizzle-orm'
import { db } from '@/config/database'
import { carrito, productos } from '@/db/schema'

export class CartService {
  async getCartByUser(id: number) {
    const cartItemList = await db
      .select({
        producto: {
          id: productos.id,
          nombre: productos.nombre,
          descripcion: productos.descripcion ?? '',
          precio: productos.precio,
          stock: productos.stock,
          urlImagen: sql<string>`(select url from imagenes as i where i.producto_id = ${productos.id} limit 1)`,
        },
        usuarioId: carrito.usuarioId,
        cantidad: carrito.cantidad,
      })
      .from(carrito)
      .innerJoin(productos, eq(carrito.productoId, productos.id))
      .where(eq(carrito.usuarioId, id))
    return cartItemList
  }

  async addCartItem(id: number, productId: number) {
    const cart = await db.query.carrito.findFirst({
      where: (table, { eq, and }) =>
        and(eq(table.usuarioId, id), eq(table.productoId, productId)),
    })

    if (cart) {
      await db
        .update(carrito)
        .set({
          cantidad: cart.cantidad + 1,
        })
        .where(
          and(eq(carrito.usuarioId, id), eq(carrito.productoId, productId)),
        )
      return
    }

    await db.insert(carrito).values({
      usuarioId: id,
      productoId: productId,
      cantidad: 1,
    })
  }

  async decreaseCartItem(id: number, productId: number) {
    const cart = await db.query.carrito.findFirst({
      where: (table, { eq, and }) =>
        and(eq(table.usuarioId, id), eq(table.productoId, productId)),
    })

    if (!cart) {
      throw new Error('Producto no encontrado en el carrito')
    }

    if (cart.cantidad === 1) {
      await db
        .delete(carrito)
        .where(
          and(eq(carrito.usuarioId, id), eq(carrito.productoId, productId)),
        )
      return
    }

    await db
      .update(carrito)
      .set({
        cantidad: cart.cantidad - 1,
      })
      .where(and(eq(carrito.usuarioId, id), eq(carrito.productoId, productId)))
  }

  async removeCartItem(id: number, productId: number) {
    await db
      .delete(carrito)
      .where(and(eq(carrito.usuarioId, id), eq(carrito.productoId, productId)))
  }

  async count(idUsuario: number) {
    return await db.$count(carrito, eq(carrito.usuarioId, idUsuario))
  }
}
