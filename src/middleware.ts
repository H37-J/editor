import { NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import { withAuth } from 'next-auth/middleware';

export async function middleware(req) {}

export const config = {
  matcher: ['/note/:path*'],
};
