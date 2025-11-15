import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { db } from '../../../../db/index';
import { blogSchema, authorSchema } from '../../../../db/schema';
import { eq } from 'drizzle-orm';
import { auth } from 'auth';

// save the uploaded image in the uploads folder
async function saveFile(file: File) {
  const uploadsDir = path.join(process.cwd(), 'public', 'uploads');
  if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir);

  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  const fileName = `${Date.now()}-${file.name}`;
  const filePath = path.join(uploadsDir, fileName);
  await fs.promises.writeFile(filePath, buffer);

  return fileName;
}

// 🔹 GET blog by ID
export async function GET(
  _req: Request,
  { params }: { params: { id: string } },
) {
  try {
    const blogId = Number(params.id);
    if (isNaN(blogId)) {
      return NextResponse.json({ error: 'Invalid blog ID' }, { status: 400 });
    }

    const [result] = await db
      .select({
        id: blogSchema.id,
        title: blogSchema.title,
        description: blogSchema.description,
        content: blogSchema.content,
        image: blogSchema.image,
        author: {
          id: authorSchema.id,
          firstName: authorSchema.firstName,
          lastName: authorSchema.lastName,
          email: authorSchema.email,
          createdAt: authorSchema.createdAt,
          updatedAt: authorSchema.updatedAt,
        },
        createdAt: blogSchema.createdAt,
        updatedAt: blogSchema.updatedAt,
      })
      .from(blogSchema)
      .leftJoin(authorSchema, eq(blogSchema.authorId, authorSchema.id))
      .where(eq(blogSchema.id, blogId))
      .limit(1);

    if (!result)
      return NextResponse.json({ error: 'Blog not found' }, { status: 404 });

    return NextResponse.json({
      message: 'Blog fetched successfully',
      data: result,
    });
  } catch (error) {
    console.error('Error fetching blog by ID:', error);
    return NextResponse.json(
      {
        error: 'Internal server error',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 },
    );
  }
}

// 🔹 PATCH: Update blog by ID
export async function PATCH(
  req: Request,
  { params }: { params: { id: string } },
) {
  try {
    const blogId = Number(params.id);
    if (isNaN(blogId)) {
      return NextResponse.json({ error: 'Invalid blog ID' }, { status: 400 });
    }

    const formData = await req.formData();
    const title = formData.get('title')?.toString();
    const description = formData.get('description')?.toString();
    const content = formData.get('content')?.toString();
    const imageFile = formData.get('image') as File | null;

    const updateData: any = {};
    if (title) updateData.title = title;
    if (description) updateData.description = description;
    if (content) updateData.content = content;

    if (imageFile && imageFile.size > 0) {
      const fileName = await saveFile(imageFile);
      updateData.image = fileName;
    }

    if (Object.keys(updateData).length === 0) {
      return NextResponse.json(
        { error: 'No valid fields to update' },
        { status: 400 },
      );
    }

    const [updatedBlog] = await db
      .update(blogSchema)
      .set(updateData)
      .where(eq(blogSchema.id, blogId))
      .returning();

    if (!updatedBlog) {
      return NextResponse.json({ error: 'Blog not found' }, { status: 404 });
    }

    return NextResponse.json({
      message: 'Blog updated successfully',
      data: updatedBlog,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      {
        error: 'Internal server error',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 },
    );
  }
}

// 🔹 DELETE blog by ID
export async function DELETE(
  _req: Request,
  { params }: { params: { id: string } },
) {
  try {
    const session = await auth();
    if (!session?.user || !(session.user as any).isAdmin) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const blogId = Number(params.id);
    if (isNaN(blogId))
      return NextResponse.json({ error: 'Invalid blog ID' }, { status: 400 });

    const [deletedBlog] = await db
      .delete(blogSchema)
      .where(eq(blogSchema.id, blogId))
      .returning();

    if (!deletedBlog)
      return NextResponse.json(
        { error: 'Blog not found or already deleted.' },
        { status: 404 },
      );

    return NextResponse.json({ message: 'Blog deleted successfully' });
  } catch (error) {
    console.error('Error deleting blog:', error);
    return NextResponse.json(
      {
        error: 'Internal server error',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 },
    );
  }
}
