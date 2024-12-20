import 'jest';
import { Context, createMockContext, MockContext } from '../src/server/context';
import prisma from '../src/server/prisma';
import { prismaMock } from '../jest.setup';

let mockCtx: MockContext
let ctx: Context
describe('prisma test',  () => {
  beforeEach(() => {
    jest.clearAllMocks()
    mockCtx = createMockContext()
    ctx = mockCtx as unknown as Context
  });

  it("Empty string should return true", async () => {

  })
})