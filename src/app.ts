import { swaggerUI } from '@hono/swagger-ui'
import { OpenAPIHono } from '@hono/zod-openapi'
import { cors } from 'hono/cors'
import { logger } from 'hono/logger'
import { prettyJSON } from 'hono/pretty-json'

// Routes
import authRoutes from '@/routes/auth'
import bannerRoutes from '@/routes/banners'
import cartRoutes from '@/routes/cart'
import categoryRoutes from '@/routes/categories'
import productRoutes from '@/routes/products'

const app = new OpenAPIHono()

// Middleware global
app.use('*', logger())
app.use('*', prettyJSON())
app.use(
  '*',
  cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:4321',
    credentials: true,
  }),
)

// OpenAPI
app.doc('/doc', {
  openapi: '3.0.0',
  info: {
    version: '1.0.0',
    title: 'Plazavea API',
    description: 'Documentación de la API de Plazavea',
  },
  servers: [
    {
      url: 'http://localhost:3000',
      description: 'Development server',
    },
  ],
})

app.openAPIRegistry.registerComponent('securitySchemes', 'Bearer', {
  type: 'http',
  scheme: 'bearer',
  bearerFormat: 'JWT',
})

// Swagger UI
app.get('/ui', swaggerUI({ url: '/doc' }))

// Routes
app.route('/api/auth', authRoutes)
app.route('/api/banners', bannerRoutes)
app.route('/api/products', productRoutes)
app.route('/api/categories', categoryRoutes)
app.route('/api/cart', cartRoutes)
//app.route('/api/users', userRoutes)
//app.route('/api/payments', paymentRoutes)

// Health check
app.get('/health', c =>
  c.json({ status: 'ok', timestamp: new Date().toISOString() }),
)

export default app
