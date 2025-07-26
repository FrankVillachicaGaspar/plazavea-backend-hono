import { createRoute, OpenAPIHono, z } from '@hono/zod-openapi'
import { CreatePaymentSchema } from '@/schemas/payments.sechema'
import {
  errorResponseSchema,
  successMessageResponseSchema,
} from '@/schemas/response.schema'
import { PaymentController } from '@/controllers/payments.controller'
import { authenticateJWT } from '@/middleware/auth'

const payment = new OpenAPIHono()
const paymentController = new PaymentController()
const tags = ['Pagos']

export const createPayment = createRoute({
  method: 'post',
  path: '/',
  tags,
  summary: 'Crear pago',
  description: 'Crear pago',
  middleware: [authenticateJWT] as const,
  security: [{ Bearer: [] }],
  request: {
    body: {
      content: {
        'application/json': {
          schema: CreatePaymentSchema,
        },
      },
    },
  },
  responses: {
    201: {
      description: 'Pago creado',
      content: {
        'application/json': {
          schema: successMessageResponseSchema,
        },
      },
    },
    400: {
      description: 'Pago no creado',
      content: {
        'application/json': {
          schema: errorResponseSchema,
        },
      },
    },
    500: {
      description: 'Internal server error',
      content: {
        'application/json': {
          schema: errorResponseSchema,
        },
      },
    },
  },
})

export const getPaymentsByUserId = createRoute({
  method: 'get',
  path: '/',
  tags,
  summary: 'Obtener pagos por usuario',
  description: 'Obtener pagos por usuario',
  middleware: [authenticateJWT] as const,
  security: [{ Bearer: [] }],
  responses: {
    200: {
      description: 'Pagos encontrados',
      content: {
        'application/json': {
          schema: successMessageResponseSchema,
        },
      },
    },
    400: {
      description: 'Bad request',
      content: {
        'application/json': {
          schema: errorResponseSchema,
        },
      },
    },
    404: {
      description: 'Pagos no encontrados',
      content: {
        'application/json': {
          schema: errorResponseSchema,
        },
      },
    },
    500: {
      description: 'Internal server error',
      content: {
        'application/json': {
          schema: errorResponseSchema,
        },
      },
    },
  },
})

payment.openapi(createPayment, paymentController.createPayment)
payment.openapi(getPaymentsByUserId, paymentController.getPaymentByUserId)

export default payment
