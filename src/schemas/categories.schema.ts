import { z } from '@hono/zod-openapi'

export const categoriaDto = z
  .object({
    id: z.number().openapi({ example: 1, description: 'Category ID' }),
    nombre: z.string().openapi({
      example: 'Electrónicos',
      description: 'Nombre de la categoría',
    }),
    imagenUrl: z.string().url().nullable().openapi({
      example: 'https://ejemplo.com/imagen.jpg',
      description: 'URL de la imagen de la categoría',
    }),
  })
  .openapi('Categoría')

export type CategoryDto = z.infer<typeof categoriaDto>

export const getCategoriesParams = z.object({
  quantity: z
    .string()
    .default('10')
    .transform(Number)
    .refine(val => val > 0, {
      message: 'La contidad debe ser mayor a 0',
    }),
})
