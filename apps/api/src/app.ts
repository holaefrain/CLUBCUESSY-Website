import { Hono } from 'hono'
import { cors } from 'hono/cors'

const ALLOWED_ORIGINS = ['https://www.clubcuessy.com', 'http://localhost:5173']

export const app = new Hono()

app.use(
  '*',
  cors({
    origin: ALLOWED_ORIGINS,
    credentials: true,
  }),
)

app.get('/health', (c) => c.json({ status: 'ok' }))
