import { and, eq } from 'drizzle-orm'
import { db } from '@/config/database'
import { banners } from '@/db/schema'
import type { BannerResponseDto } from '@/schemas/banners.schema'

export class BannerService {
  private readonly principalBanner = 1
  private readonly offerBanner = 2
  private readonly discountBanner = 3
  private readonly activeBanner = 1

  private async getBannerByType(
    bannerType: number,
  ): Promise<BannerResponseDto[]> {
    const bannerList = await db
      .select()
      .from(banners)
      .where(
        and(
          eq(banners.bannerType, bannerType),
          eq(banners.active, this.activeBanner),
        ),
      )
      .all()

    const bannerListDto: BannerResponseDto[] = bannerList.map(banner => ({
      id: banner.id,
      url: banner.url,
      altText: banner.altText,
      order: banner.order,
    }))

    return bannerListDto
  }

  async getPrincipalBanner(): Promise<BannerResponseDto[]> {
    return await this.getBannerByType(this.principalBanner)
  }

  async getOfferBanner(): Promise<BannerResponseDto[]> {
    return await this.getBannerByType(this.offerBanner)
  }

  async getDiscountBanner(): Promise<BannerResponseDto[]> {
    return await this.getBannerByType(this.discountBanner)
  }
}
