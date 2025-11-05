import { NextResponse } from 'next/server';
import { db } from '../../../../db/index';
import { blogSchema, authorSchema } from '../../../../db/schema';
import { eq } from 'drizzle-orm';

export async function GET(
  _req: Request,
  { params }: { params: { id: string } },
) {
  try {
    const blogId = Number(params.id);

    if (isNaN(blogId)) {
      return NextResponse.json(
        { error: 'Invalid blog ID. It must be a number.' },
        { status: 400 },
      );
    }

    // Fetch blog and join with author
    const [result] = await db
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
      .where(eq(blogSchema.id, blogId))
      .limit(1);

    if (!result) {
      return NextResponse.json(
        { error: 'Blog not found', success: false },
        { status: 404 },
      );
    }

    return NextResponse.json(
      {
        message: 'Blog fetched successfully',
        success: true,
        data: result,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error('Error fetching blog by ID:', error);
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

// 🟡 PUT - Update blog by ID
export async function PUT(
  req: Request,
  { params }: { params: { id: string } },
) {
  try {
    const blogId = Number(params.id);
    const body = await req.json();
    const { title, description, content, image } = body;

    if (isNaN(blogId)) {
      return NextResponse.json(
        { error: 'Invalid blog ID. It must be a number.' },
        { status: 400 },
      );
    }

    const updateData: any = {};
    if (title) updateData.title = title;
    if (description) updateData.description = description;
    if (content) updateData.content = content;
    if (image) updateData.image = image;

    if (Object.keys(updateData).length === 0) {
      return NextResponse.json(
        { error: 'No valid fields provided for update.' },
        { status: 400 },
      );
    }

    const [updatedBlog] = await db
      .update(blogSchema)
      .set(updateData)
      .where(eq(blogSchema.id, blogId))
      .returning();

    if (!updatedBlog) {
      return NextResponse.json(
        { error: 'Blog not found or update failed.' },
        { status: 404 },
      );
    }

    return NextResponse.json(
      {
        message: 'Blog updated successfully',
        success: true,
        data: updatedBlog,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error('Error updating blog:', error);
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

// 🔴 DELETE - Remove blog by ID
export async function DELETE(
  _req: Request,
  { params }: { params: { id: string } },
) {
  try {
    const blogId = Number(params.id);

    if (isNaN(blogId)) {
      return NextResponse.json(
        { error: 'Invalid blog ID. It must be a number.' },
        { status: 400 },
      );
    }

    const [deletedBlog] = await db
      .delete(blogSchema)
      .where(eq(blogSchema.id, blogId))
      .returning();

    if (!deletedBlog) {
      return NextResponse.json(
        { error: 'Blog not found or already deleted.' },
        { status: 404 },
      );
    }

    return NextResponse.json(
      { message: 'Blog deleted successfully', success: true },
      { status: 200 },
    );
  } catch (error) {
    console.error('Error deleting blog:', error);
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
