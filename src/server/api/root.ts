import { createTRPCRouter } from '@/server/api/trpc';
import { postRouter } from '@/server/api/routers/postRouter';
import { galleryRouter } from '@/server/api/routers/galleryRouter';
import { codeRouter } from '@/server/api/routers/codeRouter';


export const appRouter= createTRPCRouter({
  post: postRouter,
  gallery: galleryRouter,
  code: codeRouter,
});

export type AppRouter = typeof appRouter;