import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export const revalidate = 0;
export const dynamic = 'force-dynamic';
export async function POST() {
  try {
    const cookieStore = cookies();
    const allCookies = cookieStore.getAll();

    const response = NextResponse.json(
      { message: 'Logout successful', cleared: true },
      { status: 200 },
    );
    allCookies.forEach((cookie) => {
      response.cookies.delete({
        name: cookie.name,
        value: '',
        path: '/',
      });
      response.cookies.delete({
        name: cookie.name,
        value: '',
        path: '/api/auth',
      });
      response.cookies.delete({
        name: cookie.name,
        value: '',
        path: '',
      });

      response.cookies.set({
        name: cookie.name,
        value: '',
        expires: new Date(0),
        path: '/',
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
      });
    });

    // Add aggressive cache control headers
    response.headers.set(
      'Cache-Control',
      'no-store, no-cache, must-revalidate, private, max-age=0, s-maxage=0',
    );
    response.headers.set('Pragma', 'no-cache');
    response.headers.set('Expires', '0');
    response.headers.set('Clear-Site-Data', '"cache", "cookies", "storage"');

    return response;
  } catch (error) {
    const response = NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 },
    );

    response.headers.set('Cache-Control', 'no-store');
    return response;
  }
}
