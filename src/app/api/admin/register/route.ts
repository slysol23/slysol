import { NextResponse } from 'next/server';
import { db } from 'db';
import { userSchema } from 'db/schema';
import { eq } from 'drizzle-orm';
import bcrypt from 'bcryptjs';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, email, password, secretKey } = body;

    if (secretKey !== process.env.ADMIN_CREATION_SECRET) {
      return NextResponse.json(
        { error: 'Invalid secret key' },
        { status: 403 },
      );
    }

    // Validate fields
    if (!name || !email || !password) {
      return NextResponse.json(
        { error: 'Name, email, and password are required' },
        { status: 400 },
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 },
      );
    }

    // Validate password
    if (password.length < 6) {
      return NextResponse.json(
        { error: 'Password must be at least 6 characters long' },
        { status: 400 },
      );
    }

    // Check existing
    const [existingUser] = await db
      .select()
      .from(userSchema)
      .where(eq(userSchema.email, email))
      .limit(1);

    if (existingUser) {
      return NextResponse.json(
        { error: 'User with this email already exists' },
        { status: 409 },
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user (admin)
    const [newUser] = await db
      .insert(userSchema)
      .values({
        name,
        email,
        password: hashedPassword,
        isAdmin: true,
      })
      .returning({
        id: userSchema.id,
        name: userSchema.name,
        email: userSchema.email,
        createdAt: userSchema.createdAt,
        isAdmin: userSchema.isAdmin,
      });

    return NextResponse.json(
      {
        message: 'Admin created successfully',
        user: newUser,
      },
      { status: 201 },
    );
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 },
    );
  }
}
