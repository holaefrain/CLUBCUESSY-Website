import { createTRPCReact } from '@trpc/react-query'
import { httpBatchLink } from '@trpc/client'
import type { AppRouter } from '@clubcuessy/api'

export const trpc = createTRPCReact<AppRouter>()

const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:8787'

export const trpcClient = trpc.createClient({
  links: [
    httpBatchLink({
      url: `${API_URL}/trpc`,
      fetch(url, options) {
        return fetch(url, { ...options, credentials: 'include' })
      },
    }),
  ],
})
