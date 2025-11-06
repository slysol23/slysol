import { NextResponse } from 'next/server';
import { db } from '../../../db/index';
import { blogSchema, authorSchema } from '../../../db/schema';
import { eq, sql } from 'drizzle-orm';

/**
 * 🟢 GET - Fetch paginated blogs with author info
 * Example: /api/blogs?page=1&limit=6
 */
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = parseInt(searchParams.get('limit') || '6', 10);
    const offset = (page - 1) * limit;

    // Fetch total blog count for pagination
    const [{ count }] = await db
      .select({ count: sql<number>`count(*)` })
      .from(blogSchema);

    // Fetch paginated blogs with author info
    const blogs = await db
      .select({
        id: blogSchema.id,
        title: blogSchema.title,
        author: {
          id: authorSchema.id,
          firstName: authorSchema.firstName,
          lastName: authorSchema.lastName,
          email: authorSchema.email,
          createdAt: authorSchema.createdAt,
          updatedAt: authorSchema.updatedAt,
        },
        description: blogSchema.description,
        content: blogSchema.content,
        image: blogSchema.image,
        createdAt: blogSchema.createdAt,
        updatedAt: blogSchema.updatedAt,
      })
      .from(blogSchema)
      .leftJoin(authorSchema, eq(blogSchema.authorId, authorSchema.id))
      .orderBy(blogSchema.createdAt)
      .limit(limit)
      .offset(offset);

    return NextResponse.json(
      {
        message: 'Blogs fetched successfully',
        page,
        limit,
        total: count,
        totalPages: Math.ceil(count / limit),
        count: blogs.length,
        data: blogs,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error('Error fetching blogs:', error);
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

// 🟡 POST - Create a new blog

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { title, description, content, image, authorId } = body;

    if (!title || !content || !authorId) {
      return NextResponse.json(
        { error: 'Title, content, and authorId are required' },
        { status: 400 },
      );
    }

    const [newBlog] = await db
      .insert(blogSchema)
      .values({
        title,
        description: description || '',
        content,
        image: image || '',
        authorId,
      })
      .returning();

    return NextResponse.json(
      { message: 'Blog created successfully', data: newBlog },
      { status: 201 },
    );
  } catch (error) {
    console.error('Error creating blog:', error);
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
