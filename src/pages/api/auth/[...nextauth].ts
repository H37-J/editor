import type { NextApiRequest, NextApiResponse } from "next";
import NextAuth from "next-auth";
import { authOptions } from '@/server/auth/auth';


const auth = (req: NextApiRequest, res: NextApiResponse) => {
  return NextAuth(req, res, authOptions);
};

export default auth;
