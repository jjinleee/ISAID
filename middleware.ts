import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';

export async function middleware(req: NextRequest) {
  const session = await auth();

  const protectedPaths = ['/mypage'];
  const isProtected = protectedPaths.some(path => req.nextUrl.pathname.startsWith(path));

  if (isProtected && !session) {
    return NextResponse.redirect(new URL('/login', req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/mypage'],
};