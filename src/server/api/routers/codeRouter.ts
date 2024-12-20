import { z } from 'zod';
import { createTRPCRouter, protectedProcedure } from '@/server/api/trpc';
import prisma from '@/server/prisma';


const createCodeParser = z.object({
  title: z.string(),
  content: z.string(),
  lang: z.string(),
});

export type CreateCodeProps = z.infer<typeof createCodeParser>;

export const codeRouter = createTRPCRouter({
  create: protectedProcedure
    .input(createCodeParser)
    .mutation(async ({ input, ctx }) => {
      return prisma.code.create({
        data: {
          title: input.title,
          content: input.content,
          lang: input.lang,
          userId: ctx.session?.user?.id,
        }
      });
    }),
  getAll: protectedProcedure
    .input(z.string())
    .query(async ({ctx, input}) => {
      return prisma.code.findMany({
        where: {
          userId: ctx.session?.user.id,
          lang: input ?  input : undefined,
        },
        orderBy: { updateDate: 'desc' },
      })
    })
})