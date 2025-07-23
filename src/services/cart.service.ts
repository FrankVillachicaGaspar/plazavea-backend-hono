import { and, eq } from 'drizzle-orm'
import { db } from '@/config/database'
import { carrito } from '@/db/schema'

export class CartService {
  async getCartByUser(id: number) {
    const cartItemList = await db.query.carrito.findMany({
      where: (table, { eq }) => eq(table.usuarioId, id),
    })
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
}
