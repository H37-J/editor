import { PrismaAdapter } from '@next-auth/prisma-adapter';
import type { NextAuthOptions } from "next-auth"
import NextAuth from 'next-auth';
import GithubProvider from 'next-auth/providers/github';
import GoogleProvider from 'next-auth/providers/google';

import prisma from '@/server/prisma';
import { NextApiRequest, type NextApiResponse } from 'next';
import { getCookie } from 'cookies-next';

export const authOptions: NextAuthOptions = {
    adapter: PrismaAdapter(prisma),
    providers: [
      GoogleProvider({
        clientId: process.env.GOOGLE_CLIENT_ID ?? "",
        clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? "",

      }),
      GithubProvider({
        clientId: process.env.GITHUB_CLIENT_ID ?? "",
        clientSecret: process.env.GITHUB_CLIENT_SECRET ?? "",
      }),
    ],
    pages: {
    },
    callbacks: {
      async redirect({url, baseUrl}) {
        return url.startsWith(baseUrl)? url : baseUrl
      }
    },
}

