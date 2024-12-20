import { CreateCodeProps } from '@/server/api/routers/codeRouter';
import type { Code as PrismaCode } from '../../node_modules/.prisma/client'
import api from '@/utils/api';
import useAuth from '@/hooks/useAuth';
export type CodeUtils = {
  createCode: (data: CreateCodeProps) => Promise<PrismaCode | undefined>;
}

export const useCode = (): CodeUtils => {
  const { status } = useAuth();
  const createMutation = api.code.create.useMutation({})

  const createCode = async (data: CreateCodeProps): Promise<PrismaCode | undefined> => {
    if (status === 'authenticated') {
      return await createMutation.mutateAsync(data);
    } else {
      return undefined;
    }
  }


  return {
    createCode,
  }
}