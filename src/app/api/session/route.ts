import { NextResponse } from 'next/server';
import { auth } from 'auth';

export async function GET() {
  try {
    const session = await auth();

    if (!session?.user) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
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
      { status: 200 },
    );
  } catch (error) {
    console.error('Session error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 },
    );
  }
}
