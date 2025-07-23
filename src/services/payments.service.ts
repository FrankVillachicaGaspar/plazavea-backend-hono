import { eq } from 'drizzle-orm'
import { db } from '@/config/database'
import {
  type PagoDetalleInsert,
  type PagoInsert,
  pagos,
  pagosDetalle,
} from '@/db/schema'

export class PaymentService {
  async createPayment(
    payment: PagoInsert,
    detail: PagoDetalleInsert[],
    userId: number,
  ) {
    const pago = await db
      .insert(pagos)
      .values({ ...payment, usuarioId: userId })
      .returning()
      .get()
    await db.insert(pagosDetalle).values(
      detail.map(item => ({
        ...item,
        pagoId: pago.id,
      })),
    )
  }

  async getPaymentsByUserId(userId: number) {
    return await db
      .select()
      .from(pagos)
      .innerJoin(pagosDetalle, eq(pagos.id, pagosDetalle.pagoId))
      .where(eq(pagos.usuarioId, userId))
  }
}
