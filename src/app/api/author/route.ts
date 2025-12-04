import { NextResponse } from 'next/server';
import { db } from '../../../db';
import { authorSchema } from '../../../db/schema';
import { eq } from 'drizzle-orm';

/**
 * 🟢 GET — Get all authors
 */
export async function GET() {
  try {
    const authors = await db.select().from(authorSchema);

    return NextResponse.json(
      {
        message: 'Authors fetched successfully',
        data: authors,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error('Error fetching authors:', error);
    return NextResponse.json(
      {
        message: 'Failed to fetch authors',
        error: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    );
  }
}

/**
 * 🟡 POST — Create a new author
 */
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { firstName, lastName, email } = body;

    if (!firstName || !lastName || !email) {
      return NextResponse.json(
        { message: 'firstName, lastName, and email are required' },
        { status: 400 },
      );
    }

    const [existingUser] = await db
      .select()
      .from(authorSchema)
      .where(eq(authorSchema.email, email))
      .limit(1);

    if (existingUser) {
      return NextResponse.json(
        { error: 'Author with this email already exists' },
        { status: 409 },
      );
    }

    const [author] = await db
      .insert(authorSchema)
      .values({
        firstName,
        lastName,
        email,
      })
      .returning();

    return NextResponse.json(
      {
        message: 'Author created successfully',
        data: author,
      },
      { status: 201 },
    );
  } catch (error) {
    console.error('Error creating author:', error);
    return NextResponse.json(
      {
        message: 'Failed to create author',
        error: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    );
  }
}
