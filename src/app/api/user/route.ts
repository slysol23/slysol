import { NextResponse } from 'next/server';
import { db } from '../../../db';
import { userSchema } from '../../../db/schema';
import { eq, sql } from 'drizzle-orm';
import bcrypt from 'bcryptjs';

//GET — Fetch paginated users
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = parseInt(searchParams.get('limit') || '10', 10);
    const offset = (page - 1) * limit;

    const [{ count }] = await db
      .select({ count: sql<number>`count(*)` })
      .from(userSchema);

    const users = await db
      .select()
      .from(userSchema)
      .orderBy(userSchema.createdAt)
      .limit(limit)
      .offset(offset);

    return NextResponse.json(
      {
        message: 'Users fetched successfully',
        page,
        limit,
        total: count,
        totalPages: Math.ceil(count / limit),
        count: users.length,
        data: users,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error('Error fetching users:', error);
    return NextResponse.json(
      {
        error: 'Internal server error',
        success: false,
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 },
    );
  }
}

//POST — Create a new user

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, email, password, isAdmin } = body;

    if (!name || !email) {
      return NextResponse.json(
        { error: 'Name and email are required' },
        { status: 400 },
      );
    }

    // Check for existing user
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
    // // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const [newUser] = await db
      .insert(userSchema)
      .values({
        name,
        email,
        password: hashedPassword,
        isAdmin: isAdmin ?? false,
      })
      .returning({
        id: userSchema.id,
        name: userSchema.name,
        email: userSchema.email,
        Admin: userSchema.isAdmin,
        createdAt: userSchema.createdAt,
      });

    return NextResponse.json(
      {
        message: 'User registered successfully',
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
