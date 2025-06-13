//빌드오류로 쿠키 존재여부로 로그인 여부 판단
import { NextRequest, NextResponse } from 'next/server';

export async function middleware(req: NextRequest) {
  const token =
    req.cookies.get('next-auth.session-token')?.value || // for dev
    req.cookies.get('__Secure-next-auth.session-token')?.value; // for production

  const protectedPaths = ['/mypage'];
  const isProtected = protectedPaths.some((path) =>
    req.nextUrl.pathname.startsWith(path)
  );

  if (isProtected && !token) {
    return NextResponse.redirect(new URL('/login', req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/mypage'],
};
