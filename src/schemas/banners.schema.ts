import { z } from '@hono/zod-openapi'

export const bannerResponseSchema = z.object({
  id: z.number().openapi({ description: 'ID del banner', example: 1 }),
  url: z.string().url().openapi({
    description: 'URL del banner',
    example: 'https://example.com/banner.jpg',
  }),
  altText: z.string().openapi({
    description: 'Texto alternativo del banner',
    example: 'Banner principal',
  }),
  order: z.number().openapi({ description: 'Orden del banner', example: 1 }),
})

export type BannerResponseDto = z.infer<typeof bannerResponseSchema>
