import { NextRequest } from 'next/server';
import { db } from '../../../db';
import {
  blogSchema,
  authorSchema,
  blogAuthorsSchema,
} from '../../../db/schema';
import { eq, inArray, sql } from 'drizzle-orm';
import fs from 'fs/promises';
import path from 'path';
import { auth } from 'auth';
import { NextResponse } from 'next/server';

function slugify(title: string) {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

/**
 * 🟢 GET — Get all blogs with pagination and multiple authors
 */
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get('page') ?? '1');
    const limit = parseInt(searchParams.get('limit') ?? '10');
    const offset = (page - 1) * limit;

    const blogs = await db
      .select()
      .from(blogSchema)
      .orderBy(sql`${blogSchema.createdAt} DESC`)
      .limit(limit)
      .offset(offset);

    const blogIds = blogs.map((b) => b.id);

    if (blogIds.length === 0) {
      return NextResponse.json({
        message: 'Blogs fetched',
        page,
        limit,
        total: 0,
        totalPages: 0,
        data: [],
      });
    }

    const relations = await db
      .select()
      .from(blogAuthorsSchema)
      .where(inArray(blogAuthorsSchema.blogId, blogIds));

    const authorIds = relations.map((r) => r.authorId);

    const authors = await db
      .select()
      .from(authorSchema)
      .where(inArray(authorSchema.id, authorIds));

    const authorMap = new Map(authors.map((a) => [a.id, a]));

    const blogsWithAuthors = blogs.map((blog) => {
      const ids = relations
        .filter((r) => r.blogId === blog.id)
        .map((r) => r.authorId);

      return {
        ...blog,
        authorIds: ids,
        authors: ids.map((id) => authorMap.get(id)).filter(Boolean),
      };
    });

    return NextResponse.json({
      message: 'Blogs fetched successfully',
      page,
      limit,
      data: blogsWithAuthors,
    });
  } catch (err) {
    console.error('GET /api/blog error:', err);
    return NextResponse.json(
      { error: 'Internal Server Error', details: (err as Error).message },
      { status: 500 },
    );
  }
}

/**
 * 🟡 POST — Create a new blog
 */
export async function POST(req: NextRequest) {
  try {
    const session = await auth().catch(() => null);

    if (!session?.user) {
      return NextResponse.json(
        { error: 'Unauthorized - Please log in' },
        { status: 401 },
      );
    }

    const formData = await req.formData();
    const title = formData.get('title')?.toString() || '';
    const description = formData.get('description')?.toString() || '';
    const content = formData.get('content')?.toString() || '';

    const authorIds = formData
      .getAll('authorId')
      .map((id) => Number(id))
      .filter((id) => !isNaN(id));

    if (authorIds.length === 0) {
      return NextResponse.json(
        { error: 'At least 1 author required' },
        { status: 400 },
      );
    }

    if (!title || !description || !content) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 },
      );
    }

    // Image upload
    let imageUrl = '';
    const imageFile = formData.get('image') as File | null;
    if (imageFile && imageFile.size > 0) {
      const uploadDir = path.join(process.cwd(), 'public', 'uploads');
      await fs.mkdir(uploadDir, { recursive: true });

      const timestamp = Date.now();
      const sanitizedName = imageFile.name.replace(/[^a-zA-Z0-9.-]/g, '_');
      const uniqueFileName = `${timestamp}-${sanitizedName}`;
      const filePath = path.join(uploadDir, uniqueFileName);

      const arrayBuffer = await imageFile.arrayBuffer();
      await fs.writeFile(filePath, Buffer.from(arrayBuffer));
      imageUrl = `/uploads/${uniqueFileName}`;
    }

    // 👇 Parse tags - handle both string and already-parsed
    let tags: any[] = [];
    const tagsRaw = formData.get('tags');
    if (tagsRaw) {
      try {
        tags =
          typeof tagsRaw === 'string'
            ? JSON.parse(tagsRaw.toString())
            : tagsRaw;
        if (!Array.isArray(tags)) tags = [];
      } catch (e) {
        console.error('Error parsing tags:', e);
        tags = [];
      }
    }

    // 👇 Parse meta - handle both string and already-parsed
    let meta: any = [];
    const metaRaw = formData.get('meta');
    if (metaRaw) {
      try {
        meta =
          typeof metaRaw === 'string'
            ? JSON.parse(metaRaw.toString())
            : metaRaw;
      } catch (e) {
        console.error('Error parsing meta:', e);
        meta = [];
      }
    }

    const baseSlug = slugify(title);
    let slug = baseSlug;
    let counter = 1;

    while (true) {
      const existing = await db
        .select({ slug: blogSchema.slug })
        .from(blogSchema)
        .where(eq(blogSchema.slug, slug));
      if (existing.length === 0) break;
      slug = `${baseSlug}-${counter++}`;
    }

    const [newBlog] = await db
      .insert(blogSchema)
      .values({
        title,
        slug,
        description,
        content,
        authorId: authorIds[0],
        image: imageUrl,
        tags,
        meta,
        createdBy: session.user.name,
        updatedBy: session.user.name,
        is_published: false,
      })
      .returning();

    const relations = authorIds.map((id) => ({
      blogId: newBlog.id,
      authorId: id,
    }));

    if (relations.length) {
      await db.insert(blogAuthorsSchema).values(relations);
    }

    const authors = await db
      .select()
      .from(authorSchema)
      .where(inArray(authorSchema.id, authorIds));

    return NextResponse.json({
      message: 'Blog created successfully',
      data: { ...newBlog, authorIds, authors },
    });
  } catch (err) {
    console.error('POST /api/blog error:', err);
    return NextResponse.json(
      { error: 'Internal Server Error', details: (err as Error).message },
      { status: 500 },
    );
  }
}
