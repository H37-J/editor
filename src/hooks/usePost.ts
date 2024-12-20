import type { Post as PrismaPost } from '../../generated/.prisma/client';
import useAuth from '@/hooks/useAuth';
import api from '@/utils/api';
import {
  CreatePostProps,
  UpdateContentProps, UpdateImageProps,
  UpdateTitleProps,
  UpsertPostProps,
} from '@/server/api/routers/postRouter';

export type PostUtils = {
  createPost: (data: CreatePostProps) => Promise<PrismaPost | undefined>;
  upsertPost: (data: UpsertPostProps) => Promise<PrismaPost | undefined>;
  updateTitle: (data: UpdateTitleProps) => Promise<PrismaPost | undefined>;
  updateContent: (data: UpdateContentProps) => Promise<PrismaPost | undefined>;
  updateImage: (data: UpdateImageProps) => Promise<PrismaPost | undefined>;
  deleteByUUid: (data: string) => Promise<PrismaPost | undefined>;
}

export const usePost = (): PostUtils => {
  const { status } = useAuth();
  const ctx = api.useUtils();

  const createMutation= api.post.create.useMutation({
    onSuccess: (data: PrismaPost) => {
      ctx.post.getAll.setData(void 0, (oldData) => [data, ...(oldData ?? [])]);
      return data;
    },
  });

  const upsertMutation = api.post.upsertPost.useMutation({})

  const updateTitleMutation = api.post.updateTitle.useMutation({
    onSuccess: (data: PrismaPost) => {
      ctx.post.getAll.setData(void 0, (oldData) => {
        return oldData
          ?.map(post => post.id === data.id ? data : post)
          .sort((a, b) => new Date(b.updateDate).getTime() - new Date(a.updateDate).getTime()) ?? [];
      });
    }
  })

  const updateContentMutation = api.post.updateContent.useMutation({})

  const deleteMutation = api.post.deleteByUUid.useMutation({
    onSuccess: (data: PrismaPost) => {
      ctx.post.getAll.setData(void 0, (oldData) => {
        return oldData
          ?.filter(post => post.uuid !== data.uuid)
          .sort((a, b) => new Date(b.updateDate).getTime() - new Date(a.updateDate).getTime()) ?? [];
      });
    }
  })

  const updateImageMutation = api.post.updateImage.useMutation({})

  const createPost = async (data: CreatePostProps): Promise<PrismaPost | undefined> => {
    if (status === 'authenticated') {
      return await createMutation.mutateAsync(data);
    } else {
      return undefined;
    }
  }

  const upsertPost = async (data: UpsertPostProps): Promise<PrismaPost | undefined> => {
    if (status === 'authenticated') {
      await upsertMutation.mutateAsync(data);
    } else {
      return undefined;
    }
  }

  const updateTitle = async (data: UpdateTitleProps): Promise<PrismaPost | undefined> => {
    if (status === 'authenticated') {
      await updateTitleMutation.mutateAsync(data);
    } else {
      return undefined;
    }
  }

  const updateContent = async (data: UpdateContentProps): Promise<PrismaPost | undefined> => {
    if (status === 'authenticated') {
      await updateContentMutation.mutateAsync(data);
    } else {
      return undefined;
    }
  }

  const updateImage = async (data: UpdateImageProps): Promise<PrismaPost | undefined> => {
    if (status === 'authenticated') {
      await updateImageMutation.mutateAsync(data);
    } else {
      return undefined;
    }
  }

  const deleteByUUid = async (data: string): Promise<PrismaPost | undefined> => {
    if (status === 'authenticated') {
      await deleteMutation.mutateAsync(data);
    } else {
      return undefined;
    }
  }

  return {
    createPost,
    upsertPost,
    updateTitle,
    updateContent,
    updateImage,
    deleteByUUid
  }

}