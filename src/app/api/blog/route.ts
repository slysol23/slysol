import { NextResponse } from 'next/server';
import { db } from '../../../db/index';
import { blogSchema, authorSchema } from '../../../db/schema';
import { eq } from 'drizzle-orm';

/**
 * 🟢 GET - Fetch all blogs with author info inline
 */
export async function GET() {
  try {
    const blogs = await db
      .select({
        id: blogSchema.id,
        title: blogSchema.title,
        description: blogSchema.description,
        content: blogSchema.content,
        image: blogSchema.image,
        createdAt: blogSchema.createdAt,
        updatedAt: blogSchema.updatedAt,
        author: {
          id: authorSchema.id,
          firstName: authorSchema.firstName,
          lastName: authorSchema.lastName,
          email: authorSchema.email,
          createdAt: authorSchema.createdAt,
          updatedAt: authorSchema.updatedAt,
        },
      })
      .from(blogSchema)
      .leftJoin(authorSchema, eq(blogSchema.authorId, authorSchema.id))
      .orderBy(blogSchema.createdAt);

    return NextResponse.json(
      {
        message: 'Blogs fetched successfully',
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
      { message: 'Blog created successfully', success: true, blog: newBlog },
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
