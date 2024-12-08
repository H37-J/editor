import { createTRPCNext } from '@trpc/next';
import { type AppRouter } from '@/server/api/root';
import superjson from 'superjson';
import { httpBatchLink, loggerLink } from '@trpc/client';

const getBaseUrl = () => {
  if (typeof window !== 'undefined') return '';
  return `http://localhost:${process.env.PORT || 3000}`;
}

export const api = createTRPCNext<AppRouter>({
  config() {
    return {
      transformer: superjson,
      links: [
        loggerLink({
          enabled: (opts) =>
            process.env.NODE_ENV === "development" ||
            (opts.direction === "down" && opts.result instanceof Error),
        }),
        httpBatchLink({
          url: `${getBaseUrl()}/api/trpc`,
        }),
      ],
    };
  },
  ssr: false,
});