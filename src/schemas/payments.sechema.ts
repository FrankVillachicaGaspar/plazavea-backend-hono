import { z } from '@hono/zod-openapi'

export const CreatePaymentSchema = z.object({
  total: z.number().openapi({ example: 0, description: 'Total del pago' }),
  metodo: z
    .string()
    .openapi({ example: 'Visa', description: 'Metodo de pago' }),
  ultima4: z
    .string()
    .optional()
    .openapi({ example: '4242', description: 'Ultimos 4 digitos' }),
})

export const CreatePaymentDetailSchema = z.object({
  pagoId: z.number().openapi({ example: 1, description: 'Id del pago' }),
  productoId: z
    .number()
    .openapi({ example: 1, description: 'Id del producto' }),
  cantidad: z
    .number()
    .openapi({ example: 1, description: 'Cantidad de productos' }),
  precioUnitario: z
    .number()
    .openapi({ example: 100, description: 'Precio unitario del producto' }),
})

export const PaymentBodySchema = z.object({
  payment: CreatePaymentSchema,
  detail: z.array(CreatePaymentDetailSchema),
})

export const ResponsePaymentDetailSchema = z.object({
  pagoId: z
    .number()
    .int()
    .positive()
    .openapi({ example: 1, description: 'Id del pago' }),
  productoId: z
    .number()
    .int()
    .positive()
    .openapi({ example: 1, description: 'Id del producto' }),
  cantidad: z
    .number()
    .int()
    .positive()
    .openapi({ example: 1, description: 'Cantidad de productos' }),
  precioUnitario: z
    .number()
    .positive()
    .openapi({ example: 100, description: 'Precio unitario del producto' }),
})

export const ResponsePayment = z.object({
  id: z
    .number()
    .int()
    .positive()
    .openapi({ example: 1, description: 'Id del pago' }),
  usuarioId: z
    .number()
    .int()
    .positive()
    .openapi({ example: 1, description: 'Id del usuario' }),
  total: z
    .number()
    .positive()
    .openapi({ example: 0, description: 'Total del pago' }),
  fecha: z
    .string()
    .openapi({ example: '2023-01-01', description: 'Fecha del pago' }),
  metodo: z
    .string()
    .min(1)
    .openapi({ example: 'Visa', description: 'Metodo de pago' }),
  ultima4: z
    .string()
    .length(4)
    .nullable()
    .openapi({ example: '4242', description: 'Ultimos 4 digitos' }),
  estado: z
    .string()
    .openapi({ example: 'Pendiente', description: 'Estado del pago' }),
  referencia: z
    .string()
    .nullable()
    .openapi({ example: '123456', description: 'Referencia del pago' }),
})
