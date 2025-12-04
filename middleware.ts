import { auth } from 'auth';
import { NextResponse } from 'next/server';

export async function middleware(req: Request) {
  const session = await auth();
  const url = new URL(req.url);
  const pathname = url.pathname;

  const isDashboard = pathname.startsWith('/dashboard');
  const isAdminPage = pathname.startsWith('/dashboard/user'); // admin-only

  // Protect all dashboard routes
  if (isDashboard && !session?.user) {
    return NextResponse.redirect(new URL('/login', req.url));
  }

  // Protect admin routes
  if (isAdminPage && !session?.user?.isAdmin) {
    return NextResponse.redirect(new URL('/dashboard/blog', req.url)); // send user to normal dashboard
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*'],
};
