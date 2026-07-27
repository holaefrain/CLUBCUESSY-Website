import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { healthResponseSchema, type HealthResponse } from '@clubcuessy/shared'

const ALLOWED_ORIGINS = ['https://www.clubcuessy.com', 'http://localhost:5173']

export const app = new Hono()

app.use(
  '*',
  cors({
    origin: ALLOWED_ORIGINS,
    credentials: true,
  }),
)

app.get('/health', (c) => {
  const body: HealthResponse = healthResponseSchema.parse({ status: 'ok' })
  return c.json(body)
})
