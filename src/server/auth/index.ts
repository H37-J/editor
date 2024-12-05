import type { IncomingMessage, ServerResponse } from 'http';

import { Prisma } from '.prisma/client';
import { PrismaAdapter } from '@next-auth/prisma-adapter';
import merge from 'lodash/merge';
import type { NextApiRequest, NextApiResponse } from 'next';
import { type GetServerSidePropsContext } from 'next';
import type { AuthOptions, Awaitable, NextAuthOptions } from 'next-auth';
import { getServerSession, type Session } from 'next-auth';
import type { Adapter, AdapterUser } from 'next-auth/adapters';

import prisma from '@/server/prisma';

import { authOptions as prodOptions } from './auth';
import { options as devOptions } from './local-auth';

const overridePrisma = <T>(fn: (user: T) => Awaitable<AdapterUser>) => {
  return async (user: T) => {
    const newUser = await fn(user);
    try {
    } catch (e) {
      console.error(e);
    }
    return newUser;
  };
};
const prismaAdapter = PrismaAdapter(prisma);
prismaAdapter.createUser = overridePrisma<Omit<AdapterUser, "id">>(prismaAdapter.createUser);

const commonOptions: Partial<AuthOptions> & { adapter: Adapter } = {
  adapter: prismaAdapter,
  callbacks: {
    async session({ session, user } ) {
      const data= await prisma.session.findFirstOrThrow({
        where: { userId: user?.id as unknown as number },
        orderBy: { expires: Prisma.SortOrder.desc },
      });
      session.accessToken = data.sessionToken;
      session.user.id = user.id;
      session.user.superAdmin = user.superAdmin;
      return session;
    },
  },
};

export const authOptions = (
  req: NextApiRequest | IncomingMessage,
  res: NextApiResponse | ServerResponse
): NextAuthOptions => {
  const options =
    process.env.NODE_ENV === 'development'
      ? devOptions(commonOptions.adapter, req, res)
      : prodOptions;

  return merge(commonOptions, options) as AuthOptions;
};

export const getServerAuthSession = (ctx: {
  req: GetServerSidePropsContext["req"];
  res: GetServerSidePropsContext["res"];
}) => {
  return getServerSession(ctx.req, ctx.res, authOptions(ctx.req, ctx.res));
};
