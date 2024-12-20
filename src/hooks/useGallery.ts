import { CreateImageProps } from '@/server/api/routers/galleryRouter';
import type { Gallery as PrismaGallery } from '../../node_modules/.prisma/client'
import useAuth from '@/hooks/useAuth';
import api from '@/utils/api';

export type GalleryUtils = {
  createGallery: (data: CreateImageProps) => Promise<PrismaGallery | undefined>;
}

export const useGallery = (): GalleryUtils => {
  const { status } = useAuth();
  const ctx = api.useUtils();

  const createMutation = api.gallery.create.useMutation({})

  const createGallery = async (data: CreateImageProps): Promise<PrismaGallery | undefined> => {
    if (status === 'authenticated') {
      return await createMutation.mutateAsync(data);
    } else {
      return undefined;
    }
  }

  return {
    createGallery
  }
};