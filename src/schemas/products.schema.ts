import { z } from '@hono/zod-openapi'

export const productFilterSchema = z
  .object({
    categoryId: z
      .string()
      .transform(val => parseInt(val, 10))
      .refine(val => !Number.isNaN(val) && val >= 1, {
        message: 'Must be a valid number >= 1',
      })
      .optional()
      .openapi({
        description: 'ID de la categoría del producto',
        example: '1',
      }),
    maxPrice: z
      .string()
      .transform(val => parseFloat(val))
      .refine(val => !Number.isNaN(val) && val >= 0, {
        message: 'Must be a valid number >= 0',
      })
      .optional()
      .openapi({
        description: 'Precio máximo del producto',
        example: '100',
      }),
    orderBy: z
      .string()
      .optional()
      .openapi({
        description: 'Criterio de ordenamiento',
        examples: ['precioAsc', 'precioDesc', 'random'],
      }),
    searchText: z.string().optional().openapi({
      description: 'Texto de búsqueda',
      example: 'Camiseta',
    }),
    limit: z
      .string()
      .transform(val => parseInt(val, 10))
      .refine(val => !Number.isNaN(val) && val >= 1, {
        message: 'Must be a valid number >= 1',
      })
      .default('10')
      .openapi({
        description: 'Cantidad de productos a mostrar',
        example: '10',
      }),
    page: z
      .string()
      .transform(val => parseInt(val, 10))
      .refine(val => !Number.isNaN(val) && val >= 1, {
        message: 'Must be a valid number >= 1',
      })
      .default('1')
      .openapi({
        description: 'Número de página',
        example: '1',
      }),
  })
  .openapi('ProductFilter')

export type ProductFilterDto = z.infer<typeof productFilterSchema>

export const responseProductSchema = z
  .object({
    id: z.number().openapi({ description: 'ID del producto', example: 1 }),
    nombre: z
      .string()
      .openapi({ description: 'Nombre del producto', example: 'Producto 1' }),
    descripcion: z.string().openapi({
      description: 'Descripción del producto',
      example: 'Descripción del producto 1',
    }),
    precio: z
      .number()
      .openapi({ description: 'Precio del producto', example: 9.99 }),
    urlImagen: z.string().url().openapi({
      description: 'URL de la imagen del producto',
      example: 'https://example.com/product.jpg',
    }),
    stock: z
      .number()
      .openapi({ description: 'Stock del producto', example: 10 }),
  })
  .openapi('Product')

export const responseImageSchema = z
  .object({
    id: z.number().openapi({ description: 'Id de la imagen', example: 1 }),
    productoId: z
      .number()
      .nullable()
      .openapi({ description: 'Id del producto', example: 1 }),
    url: z.string().url().openapi({
      description: 'Url del producto',
      example: 'http://example.com',
    }),
    main: z
      .boolean()
      .nullable()
      .openapi({ description: 'Es imagen principal', example: true }),
  })
  .openapi('Image')

export const responseProductByIdSchema = z
  .object({
    id: z.number().openapi({ description: 'Id del producto', example: 1 }),
    nombre: z
      .string()
      .openapi({ description: 'Nombre del producto', example: 'Producto 1' }),
    descripcion: z.string().nullable().openapi({
      description: 'Descripción del producto',
      example: 'Descripción del producto 1',
    }),
    precio: z
      .number()
      .openapi({ description: 'Precio del producto', example: 9.99 }),
    imagenes: z.array(responseImageSchema),
    stock: z
      .number()
      .openapi({ description: 'Stock del producto', example: 10 }),
  })
  .openapi('ProductById')

export type ProductByIdResponse = z.infer<typeof responseProductByIdSchema>

export const responseProductsWithFiltersSchema = z
  .object({
    productos: z.array(responseProductSchema),
    total: z.number().openapi({
      description: 'Total de productos',
      example: 100,
    }),
  })
  .openapi('ProductWithFilters')

export const productByIdParam = z.object({
  id: z
    .string()
    .min(1, 'ID es requerido')
    .regex(/^\d+$/, 'ID debe ser un número válido')
    .transform(Number)
    .refine(val => val > 0, 'ID debe ser mayor a 0'),
})
