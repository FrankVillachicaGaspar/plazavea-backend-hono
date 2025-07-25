import { z } from '@hono/zod-openapi'
import { responseProductSchema } from './products.schema'

export const CartItem = z.object({
  producto: responseProductSchema,
  usuarioId: z
    .number()
    .nullable()
    .openapi({ example: 1, description: 'Id del usuario' }),
  cantidad: z
    .number()
    .openapi({ example: 1, description: 'Cantidad del producto' }),
})

export type CartItem = z.infer<typeof CartItem>

export const addCartItemParam = z.object({
  idProducto: z
    .string()
    .min(1, 'ID es requerido')
    .regex(/^\d+$/, 'ID debe ser un número válido')
    .transform(Number)
    .refine(val => val > 0, 'ID debe ser mayor a 0'),
})
