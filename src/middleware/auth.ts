import { createMiddleware } from 'hono/factory'
import { verify } from 'hono/jwt'
import { env } from '@/config/env'

export const authenticateJWT = createMiddleware(async (c, next) => {
  const token = c.req.header('Authorization')?.replace('Bearer ', '')

  if (!token) {
    return c.json({ error: 'Token requerido' }, 401)
  }

  try {
    const payload = await verify(token, env.JWT_SECRET)
    c.set('user', payload)
    await next()
  } catch {
    return c.json({ error: 'Token inválido' }, 401)
  }
})
