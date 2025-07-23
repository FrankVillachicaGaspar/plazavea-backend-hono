import type { RouteHandler } from '@hono/zod-openapi'
import type {
  addCartItem,
  getCartByUserId,
  removeCartItem,
} from '@/routes/cart'
import { CartService } from '@/services/cart.service'
import { createResponse } from '@/utils/response'

export class CartController {
  private cartService = new CartService()

  getCartByUserId: RouteHandler<typeof getCartByUserId> = async c => {
    try {
      const user = c.get('user') as { userId: number }
      const cartItems = await this.cartService.getCartByUser(user.userId)

      return c.json(createResponse.success(cartItems), 200)
    } catch (error) {
      if (error instanceof Error) {
        return c.json(createResponse.error(error.message), 400)
      }
      return c.json(createResponse.error('Something went wrong'), 400)
    }
  }

  addCartItem: RouteHandler<typeof addCartItem> = async c => {
    try {
      const user = c.get('user') as { userId: number }
      const { idProducto } = c.req.valid('param')

      await this.cartService.addCartItem(user.userId, idProducto)
      return c.json(
        createResponse.successMessage('Producto agregado al carrito'),
        200,
      )
    } catch (error) {
      if (error instanceof Error) {
        return c.json(createResponse.error(error.message), 400)
      }
      return c.json(createResponse.error('Something went wrong'), 400)
    }
  }

  decreaseCartItem: RouteHandler<typeof addCartItem> = async c => {
    try {
      const user = c.get('user') as { userId: number }
      const { idProducto } = c.req.valid('param')

      await this.cartService.decreaseCartItem(user.userId, idProducto)
      return c.json(
        createResponse.successMessage('Producto disminuido del carrito'),
        200,
      )
    } catch (error) {
      if (error instanceof Error) {
        return c.json(createResponse.error(error.message), 400)
      }
      return c.json(createResponse.error('Something went wrong'), 400)
    }
  }

  removeCartItem: RouteHandler<typeof removeCartItem> = async c => {
    try {
      const user = c.get('user') as { userId: number }
      const { idProducto } = c.req.valid('param')

      await this.cartService.removeCartItem(user.userId, idProducto)
      return c.json(
        createResponse.successMessage('Producto eliminado del carrito'),
        200,
      )
    } catch (error) {
      if (error instanceof Error) {
        return c.json(createResponse.error(error.message), 400)
      }
      return c.json(createResponse.error('Something went wrong'), 400)
    }
  }
}
