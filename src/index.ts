import { serve } from '@hono/node-server'
import app from './app'

const port = process.env.PORT || 3000

console.log(`🚀 Servidor corriendo en http://localhost:${port}`)

serve({
  fetch: app.fetch,
  port: Number(port),
})
