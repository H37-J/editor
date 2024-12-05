import type { DefaultSession } from "next-auth";

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
  }
}

declare module "next-auth" {
  interface Session {
    accessToken?: string;
    user: {
    } & DefaultSession["user"] &
      User;
  }

  interface User {
    id: string;
    image?: string;
    superAdmin: boolean;
  }
}