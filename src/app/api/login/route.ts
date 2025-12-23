import { NextResponse } from 'next/server';
import { signIn } from 'auth';
import { AuthError } from 'next-auth';
import path from 'path';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, password } = body;

    // Validate input
    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 },
      );
    }

    // Attempt to sign in
    const result = await signIn('credentials', {
      email,
      password,
      redirect: false,
    });

    return NextResponse.json(
      {
        message: 'Login successful',
        success: true,
        path: '/api/dashboard/blog',
      },
      { status: 200 },
    );
  } catch (error) {
    console.error('Login error:', error);

    if (error instanceof AuthError) {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 },
      );
    }

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 },
    );
  }
}
