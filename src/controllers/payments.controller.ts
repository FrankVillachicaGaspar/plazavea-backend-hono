import type { RouteHandler } from '@hono/zod-openapi'
import type { createPayment, getPaymentsByUserId } from '@/routes/payments'
import { PaymentService } from '@/services/payments.service'
import { createResponse } from '@/utils/response'

export class PaymentController {
  private paymentService = new PaymentService()

  createPayment: RouteHandler<typeof createPayment> = async c => {
    try {
      const payment = c.req.valid('json')
      const user = c.get('user') as { userId: number }
      await this.paymentService.createPayment(payment, user.userId)
      return c.json(createResponse.successMessage('Pago creado'), 201)
    } catch (error) {
      if (error instanceof Error)
        return c.json(createResponse.error(error.message), 400)
      return c.json(
        createResponse.error('Error inesperado al crear el pago'),
        500,
      )
    }
  }

  getPaymentByUserId: RouteHandler<typeof getPaymentsByUserId> = async c => {
    try {
      const user = c.get('user') as { userId: number }
      const payments = await this.paymentService.getPaymentsByUserId(
        user.userId,
      )
      if (payments.length === 0)
        return c.json(createResponse.error('Pago no encontrado'), 404)
      return c.json(createResponse.success(payments), 200)
    } catch (error) {
      if (error instanceof Error)
        return c.json(createResponse.error(error.message), 400)
      return c.json(
        createResponse.error('Error inesperado al crear el pago'),
        500,
      )
    }
  }
}
