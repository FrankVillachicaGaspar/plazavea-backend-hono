import { eq, sql } from 'drizzle-orm'
import { db } from '@/config/database'
import {
  carrito,
  type PagoInsert,
  pagos,
  pagosDetalle,
  productos,
} from '@/db/schema'

export class PaymentService {
  async createPayment(payment: PagoInsert, userId: number) {
    const pago = await db
      .insert(pagos)
      .values({
        ...payment,
        usuarioId: userId,
        referencia: payment.referencia ?? 'ninguna',
        numeroTarjeta: payment.numeroTarjeta
          ? payment.numeroTarjeta.replace(/\s/g, '')
          : 'ninguna',
        fechaVencimiento: payment.fechaVencimiento?.replace('/', '-'),
        fecha: new Date().toString(),
        fechaActualizacion: new Date().toString(),
      })
      .returning()
      .get()

    const cartItems = await db
      .select()
      .from(carrito)
      .innerJoin(productos, eq(carrito.productoId, productos.id))
      .where(eq(carrito.usuarioId, userId))

    await db.insert(pagosDetalle).values(
      cartItems.map(item => ({
        cantidad: item.carrito.cantidad,
        productoId: item.productos.id,
        precioUnitario: item.productos.precio,
        pagoId: pago.id,
      })),
    )

    await db.delete(carrito).where(eq(carrito.usuarioId, userId))
  }

  async getPaymentsByUserId(userId: number) {
    const payments = await db
      .select()
      .from(pagos)
      .where(eq(pagos.usuarioId, userId))

    const paymentsWithDetails = await Promise.all(
      payments.map(async payment => {
        const detail = await db
          .select({
            pagoId: pagosDetalle.pagoId,
            productoId: pagosDetalle.productoId,
            producto: {
              id: productos.id,
              nombre: productos.nombre,
              descripcion: productos.descripcion,
              precio: productos.precio,
              stock: productos.stock,
              urlImagen: sql<string>`(select url from imagenes as i where i.producto_id = ${productos.id} limit 1)`,
            },
            cantidad: pagosDetalle.cantidad,
            precioUnitario: pagosDetalle.precioUnitario,
          })
          .from(pagosDetalle)
          .innerJoin(productos, eq(pagosDetalle.productoId, productos.id))
          .where(eq(pagosDetalle.pagoId, payment.id))
        return {
          ...payment,
          detail: detail.map(item => ({
            pagoId: item.pagoId,
            producto: item.producto,
            cantidad: item.cantidad,
            precioUnitario: item.precioUnitario,
          })),
        }
      }),
    )
    console.log(paymentsWithDetails)

    return paymentsWithDetails
  }
}
