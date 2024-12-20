import { z } from 'zod';
import { createTRPCRouter, protectedProcedure } from '@/server/api/trpc';
import prisma from '@/server/prisma';

const createPostParser = z.object({
  title: z.string(),
  content: z.string(),
  uuid: z.string(),
});

export type CreatePostProps = z.infer<typeof createPostParser>;

const upsertPostParser = z.object({
  title: z.string(),
  content: z.string(),
  uuid: z.string()
});

export type UpsertPostProps = z.infer<typeof upsertPostParser>;

const updateTitleParser = z.object({
  title: z.string(),
  uuid: z.string()
});

export type UpdateTitleProps = z.infer<typeof updateTitleParser>;

const updateContentParser = z.object({
  content: z.string(),
  uuid: z.string()
});

export type UpdateContentProps = z.infer<typeof updateContentParser>;

const updateImageParser = z.object({
  image: z.string(),
  uuid: z.string()
})

export type UpdateImageProps = z.infer<typeof updateImageParser>;
export const postRouter = createTRPCRouter({
  create: protectedProcedure
    .input(createPostParser)
    .mutation(async ({ input, ctx }) => {
      return prisma.post.create({
        data: {
          title: input.title,
          content: input.content,
          uuid: input.uuid,
          userId: ctx.session?.user?.id,
        },
      });
    }),
  getAll: protectedProcedure.query(async ({ ctx }) => {
    return prisma.post.findMany({
      where: {
        userId: ctx.session?.user.id,
      },
      orderBy: { updateDate: 'desc' },
    });
  }),
  getTakeAll: protectedProcedure
    .input(z.number())
    .query(async ({ input, ctx }) => {
      return prisma.post.findMany({
        where: {
          userId: ctx.session?.user.id,
        },
        orderBy: { updateDate: 'desc' },
        take: input,
      });
    }),
  findById: protectedProcedure
    .input(z.number())
    .query(async ({ input, ctx }) => {
      return prisma.post.findFirstOrThrow({
        where: { id: input, userId: ctx.session?.user.id },
      });
    }),
  findByUUId: protectedProcedure
    .input(z.string())
    .query(async ({ input, ctx }) => {
      return prisma.post.findFirstOrThrow({
        where: { uuid: input, userId: ctx.session?.user.id },
      });
    }),
  deleteByUUid: protectedProcedure
    .input(z.string())
    .mutation(async ({ input, ctx }) => {
      return prisma.post.delete({
        where: { uuid: input, userId: ctx.session?.user.id },
      });
    }),
  upsertPost: protectedProcedure
    .input(upsertPostParser)
    .mutation(async ({ input, ctx }) => {
      await prisma.post.upsert({
        where: { uuid: input.uuid, userId: ctx.session?.user.id },
        update: { title: input.title, content: input.content },
        create: {
          title: input.title,
          content: input.content,
          uuid: input.uuid,
          userId: ctx.session?.user.id,
        },
      });
    }),
  updateTitle: protectedProcedure
    .input(updateTitleParser)
    .mutation(async ({ input, ctx }) => {
      return prisma.post.update({
        where: { uuid: input.uuid, userId: ctx.session?.user.id },
        data: { title: input.title },
      });
    }),
  updateContent: protectedProcedure
    .input(updateContentParser)
    .mutation(async ({ input, ctx }) => {
      return prisma.post.update({
        where: { uuid: input.uuid, userId: ctx.session?.user.id },
        data: { content: input.content },
      });
    }),
  updateImage: protectedProcedure
    .input(updateImageParser)
    .mutation(async ({ input, ctx }) => {
      return prisma.post.update({
        where: {uuid: input.uuid, userId: ctx.session?.user.id },
        data: {image: input.image },
      })
    })
});
