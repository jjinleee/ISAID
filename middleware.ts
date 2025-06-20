import { NextRequest, NextResponse } from 'next/server';

export async function middleware(req: NextRequest) {
  const token =
    req.cookies.get('next-auth.session-token')?.value ||
    req.cookies.get('__Secure-next-auth.session-token')?.value;

  const protectedPaths = ['/mypage', '/isa', '/etf', '/main'];

  const isProtected = protectedPaths.some((path) =>
    req.nextUrl.pathname.startsWith(path)
  );

  if (isProtected && !token) {
    return NextResponse.redirect(new URL('/', req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/mypage/:path*', '/isa/:path*', '/etf/:path*', '/main/:path*'],
};
