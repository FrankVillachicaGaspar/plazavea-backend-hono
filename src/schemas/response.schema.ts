import { z } from '@hono/zod-openapi'

// Esquema de error
export const errorResponseSchema = z.object({
  success: z.boolean().openapi({
    description: 'Indica si la operación fue exitosa',
    example: false,
  }),
  error: z.string().openapi({
    description: 'Mensaje de error',
    example: 'Credenciales inválidas',
  }),
  details: z
    .any()
    .optional()
    .openapi({ description: 'Detalles adicionales del error' }),
})

// Esquema de éxito
export const successResponseSchema = (dataSchema: z.ZodSchema) =>
  z.object({
    success: z.boolean().openapi({
      description: 'Indica si la operación fue exitosa',
      example: true,
    }),
    data: dataSchema,
    message: z.string().openapi({
      description: 'Mensaje de éxito',
      example: 'Operación exitosa',
    }),
  })
