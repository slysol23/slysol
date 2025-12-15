export const dynamic = 'force-dynamic';
export const revalidate = 0;

import { NextResponse } from 'next/server';
import { auth } from 'auth';
import { cookies } from 'next/headers';

export async function GET() {
  try {
    const cookieStore = cookies();
    const allCookies = cookieStore.getAll();
    const sessionCookie = allCookies.find(
      (c) => c.name.includes('next-auth') || c.name.includes('session-token'),
    );

    const session = await auth();

    if (!session?.user) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        {
          status: 401,
          headers: {
            'Cache-Control': 'no-store, no-cache, must-revalidate, private',
            Pragma: 'no-cache',
            Expires: '0',
          },
        },
      );
    }

    return NextResponse.json(
      {
        data: {
          id: session.user.id,
          name: session.user.name,
          email: session.user.email,
          isAdmin: (session.user as any).isAdmin,
        },
        message: 'Session retrieved successfully',
      },
      {
        status: 200,
        headers: {
          'Cache-Control': 'no-store, no-cache, must-revalidate, private',
          Pragma: 'no-cache',
          Expires: '0',
        },
      },
    );
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      {
        status: 500,
        headers: {
          'Cache-Control': 'no-store',
        },
      },
    );
  }
}
