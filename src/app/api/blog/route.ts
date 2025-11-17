import { NextResponse } from 'next/server';
import { db } from '../../../db';
import { blogSchema, authorSchema } from '../../../db/schema';
import { eq, sql } from 'drizzle-orm';
import fs from 'fs/promises';
import path from 'path';

/**
 * 🟢 GET — Get all blogs with pagination and author info
 */
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = parseInt(searchParams.get('limit') || '6', 10);
    const offset = (page - 1) * limit;

    // ✅ Total blog count
    const [{ count }] = await db
      .select({ count: sql<number>`count(*)` })
      .from(blogSchema);

    // ✅ Fetch paginated blogs with author info
    const blogs = await db
      .select({
        id: blogSchema.id,
        title: blogSchema.title,
        description: blogSchema.description,
        content: blogSchema.content,
        image: blogSchema.image,
        tags: blogSchema.tags,
        meta: blogSchema.meta,
        createdAt: blogSchema.createdAt,
        updatedAt: blogSchema.updatedAt,
        author: {
          id: authorSchema.id,
          firstName: authorSchema.firstName,
          lastName: authorSchema.lastName,
          email: authorSchema.email,
        },
      })
      .from(blogSchema)
      .leftJoin(authorSchema, eq(blogSchema.authorId, authorSchema.id))
      .orderBy(sql`${blogSchema.createdAt} DESC`)
      .limit(limit)
      .offset(offset);

    return NextResponse.json({
      message: 'Blogs fetched successfully',
      page,
      limit,
      total: count,
      totalPages: Math.ceil(count / limit),
      data: blogs,
    });
  } catch (error) {
    console.error('❌ Error fetching blogs:', error);
    return NextResponse.json(
      {
        error: 'Failed to fetch blogs',
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    );
  }
}

/**
 * 🟡 POST — Create a new blog (with optional image upload)
 */
export async function POST(req: Request) {
  try {
    const formData = await req.formData();

    const title = formData.get('title')?.toString();
    const description = formData.get('description')?.toString();
    const content = formData.get('content')?.toString();
    const authorIdRaw = formData.get('authorId')?.toString();
    const authorId = authorIdRaw ? parseInt(authorIdRaw, 10) : undefined;

    // ✅ Validate required fields
    if (!title || !description || !content || !authorId) {
      return NextResponse.json(
        { error: 'Title, description, content and authorId are required' },
        { status: 400 },
      );
    }

    // ✅ Handle image upload
    let imageUrl = '';
    const imageFile = formData.get('image') as File | null;

    if (imageFile && imageFile.size > 0) {
      try {
        const uploadDir = path.join(process.cwd(), 'public', 'uploads');
        await fs.mkdir(uploadDir, { recursive: true });

        const timestamp = Date.now();
        const sanitizedName = imageFile.name.replace(/[^a-zA-Z0-9.-]/g, '_');
        const uniqueFileName = `${timestamp}-${sanitizedName}`;
        const filePath = path.join(uploadDir, uniqueFileName);

        const arrayBuffer = await imageFile.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        await fs.writeFile(filePath, buffer);

        imageUrl = `/uploads/${uniqueFileName}`;
      } catch (uploadError) {
        console.error('❌ Image upload failed:', uploadError);
        imageUrl = '';
      }
    }

    // ✅ Handle tags and meta as JSON
    let tags: any = null;
    try {
      const tagsRaw = formData.get('tags');
      if (tagsRaw) tags = JSON.parse(tagsRaw.toString());
    } catch (err) {
      console.warn('Invalid tags JSON', err);
    }

    let meta: any = null;
    try {
      const metaRaw = formData.get('meta');
      if (metaRaw) meta = JSON.parse(metaRaw.toString());
    } catch (err) {
      console.warn('Invalid meta JSON', err);
    }

    // ✅ Insert blog into database
    const [newBlog] = await db
      .insert(blogSchema)
      .values({
        title,
        description,
        content,
        authorId,
        image: imageUrl,
        tags,
        meta,
      })
      .returning();

    return NextResponse.json(
      { message: 'Blog created successfully', data: newBlog },
      { status: 201 },
    );
  } catch (error) {
    console.error('❌ Blog creation error:', error);
    return NextResponse.json(
      {
        error: 'Internal Server Error',
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    );
  }
}
