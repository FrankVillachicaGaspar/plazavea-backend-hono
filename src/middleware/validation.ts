import { createMiddleware } from 'hono/factory'
import { z } from 'zod'

export const validateBody = (schema: z.ZodSchema) =>
  createMiddleware(async (c, next) => {
    try {
      const body = await c.req.json()
      const validatedData = schema.parse(body)
      c.set('validatedData', validatedData)
      await next()
    } catch (error) {
      if (error instanceof z.ZodError) {
        return c.json(
          {
            error: 'Datos inválidos',
            details: error.message,
          },
          400,
        )
      }
      return c.json({ error: 'Error interno del servidor' }, 500)
    }
  })

export const validateParams = (schema: z.ZodSchema) =>
  createMiddleware(async (c, next) => {
    try {
      const params = c.req.param()
      const validatedParams = schema.parse(params)
      c.set('validatedParams', validatedParams)
      await next()
    } catch (error) {
      if (error instanceof z.ZodError) {
        return c.json(
          {
            error: 'Parámetros inválidos',
            details: error.message,
          },
          400,
        )
      }
      return c.json({ error: 'Error interno del servidor' }, 500)
    }
  })
