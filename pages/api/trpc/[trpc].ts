// pages/api/trpc/[trpc].ts
import * as trpcNext from '@trpc/server/adapters/next';
import { appRouter, createContext } from '@/lib/trpc-server';

export default trpcNext.createNextApiHandler({
  router: appRouter,
  createContext,
});
