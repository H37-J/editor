// import { mockDeep, mockReset, DeepMockProxy } from 'jest-mock-extended'
// import { PrismaClient } from '.prisma/client';
//
// import prisma from './src/server/prisma'
//
// jest.mock('./src/server/prisma', () => ({
//   __esModule: true,
//   default: mockDeep<PrismaClient>(),
// }))
//
// beforeEach(() => {
//   mockReset(prismaMock)
// })
//
// export const prismaMock = prisma as unknown as DeepMockProxy<PrismaClient>
