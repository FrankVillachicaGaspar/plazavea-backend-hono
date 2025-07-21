import { z } from '@hono/zod-openapi'

export const cartItem = z.object({
  productoId: z
    .number()
    .openapi({ example: 1, description: 'Id del producto' }),
  usuarioId: z.number().openapi({ example: 1, description: 'Id del usuario' }),
  cantidad: z
    .number()
    .openapi({ example: 1, description: 'Cantidad del producto' }),
})

export type cartItem = z.infer<typeof cartItem>

export const addCartItemParam = z.object({
  idProducto: z
    .string()
    .min(1, 'ID es requerido')
    .regex(/^\d+$/, 'ID debe ser un número válido')
    .transform(Number)
    .refine(val => val > 0, 'ID debe ser mayor a 0'),
})
