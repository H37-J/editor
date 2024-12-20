import { createNextApiHandler } from "@trpc/server/adapters/next";
import { createTRPCContext } from '@/server/api/trpc';
import { appRouter } from '@/server/api/root';
export default createNextApiHandler({
  router: appRouter,
  createContext: createTRPCContext,
  onError:
    process.env.NODE_ENV === "development"
      ? ({ path, error }) => {
        console.error(`❌ tRPC failed on ${path ?? "<no-path>"}: ${error.message}`);
      }
      : undefined,
});

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '10mb'
    },
    responseLimit: '10mb'
  },
}