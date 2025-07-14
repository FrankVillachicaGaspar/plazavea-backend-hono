import type { Context } from 'hono'
import type { BannerResponseDto } from '@/schemas/banners.schema'
import { BannerService } from '@/services/banners.service'
import { createResponse } from '@/utils/response'

export class BannerController {
  private bannerService = new BannerService()

  private responseHandler = async (
    c: Context,
    bannerList: BannerResponseDto[],
  ) => {
    try {
      return c.json(
        createResponse.success(bannerList, 'Banners obtenidos exitosamente'),
        200,
      )
    } catch (error) {
      if (error instanceof Error) {
        return c.json(createResponse.error(error.message), 400)
      }

      return c.json(createResponse.error('Error interno del servidor'), 500)
    }
  }

  getPrincipalBanner = async (c: Context) => {
    const banners = await this.bannerService.getPrincipalBanner()
    return await this.responseHandler(c, banners)
  }

  getOfferBanner = async (c: Context) => {
    const banners = await this.bannerService.getOfferBanner()
    return await this.responseHandler(c, banners)
  }

  getDiscountBanner = async (c: Context) => {
    const banners = await this.bannerService.getDiscountBanner()
    return await this.responseHandler(c, banners)
  }
}
