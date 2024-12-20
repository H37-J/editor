import { PrismaClient } from '../../generated/.prisma/client';
import { DeepMockProxy, mockDeep } from 'jest-mock-extended';

export type Context = {
  prisma: PrismaClient
}

export type MockContext = {
  prisma: DeepMockProxy<PrismaClient>
}

export const createMockContext = (): MockContext => {
  return {
    prisma: mockDeep<PrismaClient>(),
  }
}

import { getSession } from 'next-auth/react';

export const createContext = async ({ req, res }) => {
  const session = await getSession({ req });
  return { session };
};