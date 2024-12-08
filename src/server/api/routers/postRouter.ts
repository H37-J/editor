import { z } from 'zod';
import { createTRPCRouter, protectedProcedure } from '@/server/api/trpc';

const createPostParser = z.object({
  title: z.string(),
  content: z.string(),
});

export const postRouter = createTRPCRouter({
  create: protectedProcedure
    .input(createPostParser)
    .mutation(async ({ input, ctx }) => {
    }),
});
