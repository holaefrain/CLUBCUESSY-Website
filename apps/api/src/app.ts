import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { trpcServer } from '@hono/trpc-server'
import { healthResponseSchema, type HealthResponse } from '@clubcuessy/shared'
import { appRouter } from './trpc/router'

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

app.use(
  '/trpc/*',
  trpcServer({
    router: appRouter,
  }),
)
