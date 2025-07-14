import { sign, verify } from 'hono/jwt'
import { env } from '../config/env'

export interface JWTPayload {
  userId: number
  email: string
  iat?: number
  exp?: number
}

export const generateToken = async (
  payload: Omit<JWTPayload, 'iat' | 'exp'>,
): Promise<string> => {
  const now = Math.floor(Date.now() / 1000)
  const expiresIn = 7 * 24 * 60 * 60 // 7 días en segundos

  return await sign(
    {
      ...payload,
      iat: now,
      exp: now + expiresIn,
    },
    env.JWT_SECRET,
  )
}

export const verifyToken = async (token: string): Promise<JWTPayload> => {
  return (await verify(token, env.JWT_SECRET)) as unknown as JWTPayload
}
