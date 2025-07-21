import { createRoute, OpenAPIHono, z } from '@hono/zod-openapi'
import { BannerController } from '@/controllers/banners.controller'
import { bannerResponseSchema } from '@/schemas/banners.schema'
import {
  errorResponseSchema,
  successResponseSchema,
} from '@/schemas/response.schema'

const banner = new OpenAPIHono()
const bannerController = new BannerController()
const tag = ['Banners']

const routeHandler = (path: string, summary: string, description: string) => {
  return createRoute({
    method: 'get',
    path,
    tags: tag,
    summary,
    description,
    responses: {
      200: {
        description: 'Banners obtenidos exitosamente',
        content: {
          'application/json': {
            schema: successResponseSchema(z.array(bannerResponseSchema)),
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
}

const getPrincipalBanners = routeHandler(
  '/principal',
  'Obtener banners principales para el carrucel del home',
  'Obtiene los banners para el home',
)

const getOfferBanners = routeHandler(
  '/ofertas',
  'Obtener banners de ofertas',
  'Obtiene los banners de ofertas para el home',
)

const getDiscountBanners = routeHandler(
  '/descuentos',
  'Obtener banners de descuentos',
  'Obtiene los banners de descuentos para el home',
)

banner.openapi(getPrincipalBanners, bannerController.getPrincipalBanner)

banner.openapi(getOfferBanners, bannerController.getOfferBanner)

banner.openapi(getDiscountBanners, bannerController.getDiscountBanner)

export default banner
