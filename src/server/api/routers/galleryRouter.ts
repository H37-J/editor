import { z } from 'zod';
import { createTRPCRouter, protectedProcedure } from '@/server/api/trpc';
import prisma from '@/server/prisma';

export const createImageParser = z.object({
  image: z.string(),
  postUUid: z.string(),
})

export type CreateImageProps = z.infer<typeof createImageParser>;

export const galleryRouter = createTRPCRouter({
  create: protectedProcedure
    .input(createImageParser)
    .mutation(async ({ input, ctx}) => {
      return prisma.gallery.create({
        data: {
          image: input.image,
          postUUid: input.postUUid,
          userId: ctx.session?.user.id,
        }
      })
    }),
  getAll: protectedProcedure
    .query(async ({ ctx }) => {
      return prisma.gallery.findMany({
        where: {
          userId: ctx.session?.user.id,
        },
        orderBy: { createDate: 'desc' }
      })
    }),
  getTakeAll: protectedProcedure
    .input(z.number())
    .query(async ({ input, ctx }) => {
      return prisma.gallery.findMany({
        where: {
          userId: ctx.session?.user.id,
        },
        orderBy: { updateDate: 'desc' },
        take: input,
      });
    }),
})