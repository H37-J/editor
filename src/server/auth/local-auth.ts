import { IncomingMessage, ServerResponse } from 'node:http';
import type { Adapter, AdapterUser } from 'next-auth/adapters';
import { NextApiRequest, NextApiResponse } from 'next';
import { AuthOptions } from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import { getCookie, setCookie } from "cookies-next";
import { v4 } from 'uuid';
import { z } from 'zod';

export const monthFromNow = () => {
  const now = new Date(Date.now());
  return new Date(now.setMonth(now.getMonth() + 1));
};

export function cookieToString(cookie: string | undefined | null | boolean) {
  switch (typeof cookie) {
    case "boolean":
      return cookie.toString();
    case "string":
      return cookie;
    default:
      return "";
  }
}

export const options = (
  adapter: Adapter,
  req: NextApiRequest | IncomingMessage,
  res: NextApiResponse | ServerResponse
): AuthOptions => {
  return {
    adapter,
    providers: [
      Credentials({
        name: 'user',
        credentials: {
          name: { label: 'Username', type: 'text' },
          superAdmin: { label: 'SuperAdmin', type: 'text' },
        },
        async authorize(credentials) {
          if (!credentials) return null;

          const creds = z
            .object({
              name: z.string().min(1),
              superAdmin: z
                .preprocess((str) => str === 'true', z.boolean())
                .default(false),
            })
            .parse(credentials);

          if(adapter && adapter.getUserByEmail && adapter.updateUser && adapter.createUser) {
            const user = await adapter.getUserByEmail(creds.name);
            return user
              ? adapter.updateUser({
                id: 'id' in user ? user.id : '',
                name: creds.name,
                superAdmin: creds.superAdmin,
              })
              : adapter.createUser({
                name: creds.name,
                email: creds.name,
                image: undefined,
                emailVerified: null,
                superAdmin: false,
              } as AdapterUser);
          }
        },
      }),
    ],
    pages: {
      signIn: "/signin"
    },
    callbacks: {
      redirect: (params: {url : string; baseUrl: string}) =>
        params.url.startsWith(params.baseUrl) ? params.url : params.baseUrl,

      async signIn({ user }) {
        if (user) {
          if (adapter.createSession) {
            const session = await adapter.createSession({
              sessionToken: v4(),
              userId: String(user.id),
              expires: monthFromNow(),
            });

            // eslint-disable-next-line @typescript-eslint/no-unsafe-call
            if ('sessionToken' in session) {
              setCookie('next-auth.session-token', session.sessionToken, {
                // expires: session.expires,
                req: req,
                res: res,
              });
            }
          }
        }

        return true;
      },
    },
    jwt: {
      encode: () => {
        const cookie = getCookie("next-auth.session-token", {
          req: req,
          res: res,
        });

        return cookieToString(cookie);
      },
      decode: () => {
        return null;
      },
    },
  };
};

