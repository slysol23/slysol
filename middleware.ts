import { auth } from 'auth';
import { NextRequest, NextResponse } from 'next/server';

export async function middleware(req: NextRequest) {
  const session = await auth();
  const { pathname } = req.nextUrl;

  const isDashboard = pathname.startsWith('/dashboard');
  const isAdminPage = pathname.startsWith('/dashboard/user');

  if (isDashboard && !session) {
    const loginUrl = new URL('/login', req.url);
    loginUrl.searchParams.set('callbackUrl', pathname);
    return NextResponse.redirect(loginUrl);
  }

  if (isAdminPage && !session?.user?.isAdmin) {
    return NextResponse.redirect(new URL('/dashboard/blog', req.url)); // send user to normal dashboard
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*'],
};
