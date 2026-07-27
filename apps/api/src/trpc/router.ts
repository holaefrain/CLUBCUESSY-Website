import { healthResponseSchema } from '@clubcuessy/shared'
import { publicProcedure, router } from './init'

export const appRouter = router({
  health: router({
    check: publicProcedure.output(healthResponseSchema).query(() => ({ status: 'ok' as const })),
  }),
})

export type AppRouter = typeof appRouter
