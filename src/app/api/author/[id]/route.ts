import { NextResponse } from 'next/server';
import { db } from '../../../../db';
import { authorSchema, blogAuthorsSchema } from '../../../../db/schema';
import { eq, and, ne } from 'drizzle-orm';

/**
 * 🟢 GET — Get author by ID
 */
export async function GET(
  req: Request,
  { params }: { params: { id: string } },
) {
  try {
    const authorId = Number(params.id);

    const author = await db
      .select()
      .from(authorSchema)
      .where(eq(authorSchema.id, authorId))
      .limit(1);

    if (!author.length) {
      return NextResponse.json(
        { message: 'Author not found' },
        { status: 404 },
      );
    }

    return NextResponse.json(
      { message: 'Author fetched successfully', data: author[0] },
      { status: 200 },
    );
  } catch (error) {
    console.error('Error fetching author:', error);
    return NextResponse.json(
      { message: 'Failed to fetch author', error: String(error) },
      { status: 500 },
    );
  }
}

/**
 * 🟠 PATCH — Update author
 */
export async function PATCH(
  req: Request,
  { params }: { params: { id: string } },
) {
  try {
    const authorId = Number(params.id);
    const body = await req.json();
    const { firstName, lastName, email } = body;

    const [existingUser] = await db
      .select()
      .from(authorSchema)
      .where(and(eq(authorSchema.email, email), ne(authorSchema.id, authorId)))
      .limit(1);

    if (existingUser) {
      return NextResponse.json(
        { error: 'Author with this email already exists' },
        { status: 409 },
      );
    }

    const [updatedAuthor] = await db
      .update(authorSchema)
      .set({ firstName, lastName, email })
      .where(eq(authorSchema.id, authorId))
      .returning();

    if (!updatedAuthor) {
      return NextResponse.json(
        { message: 'Author not found' },
        { status: 404 },
      );
    }

    return NextResponse.json(
      { message: 'Author updated successfully', data: updatedAuthor },
      { status: 200 },
    );
  } catch (error) {
    console.error('Error updating author:', error);
    return NextResponse.json(
      { message: 'Failed to update author', error: String(error) },
      { status: 500 },
    );
  }
}

/**
 * 🔴 DELETE author
 */
export async function DELETE(
  req: Request,
  { params }: { params: { id: string } },
) {
  try {
    const authorId = Number(params.id);

    if (isNaN(authorId)) {
      return NextResponse.json(
        { message: 'Invalid author ID' },
        { status: 400 },
      );
    }

    const [existingAuthor] = await db
      .select()
      .from(authorSchema)
      .where(eq(authorSchema.id, authorId));

    if (!existingAuthor) {
      return NextResponse.json(
        { message: 'Author not found' },
        { status: 404 },
      );
    }

    const associatedBlogs = await db
      .select()
      .from(blogAuthorsSchema)
      .where(eq(blogAuthorsSchema.authorId, authorId));

    if (associatedBlogs.length > 0) {
      return NextResponse.json(
        {
          message: `Cannot delete author. This author is associated with ${associatedBlogs.length} blog(s).`,
          error: 'Author is in use',
          blogsCount: associatedBlogs.length,
        },
        { status: 409 }, // 409 Conflict
      );
    }

    const deleted = await db
      .delete(authorSchema)
      .where(eq(authorSchema.id, authorId))
      .returning();

    return NextResponse.json(
      { message: 'Author deleted successfully', data: deleted[0] },
      { status: 200 },
    );
  } catch (error) {
    console.error('Error deleting author:', error);
    return NextResponse.json(
      { message: 'Failed to delete author', error: String(error) },
      { status: 500 },
    );
  }
}
