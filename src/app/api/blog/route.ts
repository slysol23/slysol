import { NextRequest, NextResponse } from 'next/server';
import { db } from '../../../db';
import {
  blogSchema,
  authorSchema,
  blogAuthorsSchema,
} from '../../../db/schema';
import { eq, inArray, sql, and } from 'drizzle-orm';
import { auth } from 'auth';

function slugify(title: string) {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

/**
 * Convert File to Base64 string
 */
async function fileToBase64(file: File): Promise<string> {
  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  const base64 = buffer.toString('base64');
  return `data:${file.type};base64,${base64}`;
}

/**
 * 🟢 GET — Get all blogs with pagination and multiple authors, or single blog by slug
 */
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const slug = searchParams.get('slug');

    if (slug) {
      // Handle single blog by slug
      const publishedFilter = searchParams.get('published');
      const shouldFilterPublished = publishedFilter === 'true';

      const blogs = await db
        .select()
        .from(blogSchema)
        .where(
          shouldFilterPublished
            ? and(eq(blogSchema.slug, slug), eq(blogSchema.is_published, true))
            : eq(blogSchema.slug, slug),
        )
        .limit(1);

      if (blogs.length === 0) {
        return NextResponse.json(
          { message: 'Blog not found' },
          { status: 404 },
        );
      }

      const blog = blogs[0];
      const blogIds = [blog.id];

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

      const blogWithAuthors = {
        ...blog,
        authors: relations
          .filter((r) => r.blogId === blog.id)
          .map((r) => authorMap.get(r.authorId))
          .filter(Boolean),
      };

      return NextResponse.json({
        message: 'Blog fetched',
        data: blogWithAuthors,
      });
    }

    // Existing pagination logic
    const page = parseInt(searchParams.get('page') ?? '1');
    const limit = parseInt(searchParams.get('limit') ?? '10');
    const offset = (page - 1) * limit;

    // ✅ Add published filter parameter (optional)
    const publishedFilter = searchParams.get('published');
    const shouldFilterPublished = publishedFilter === 'true';

    // ✅ Count with optional filter
    const countQuery = shouldFilterPublished
      ? db
          .select({ count: sql<number>`count(*)::int` })
          .from(blogSchema)
          .where(eq(blogSchema.is_published, true))
      : db.select({ count: sql<number>`count(*)::int` }).from(blogSchema);

    const [{ count }] = await countQuery;
    const totalCount = Number(count);
    const totalPages = Math.ceil(totalCount / limit);

    // ✅ Fetch with optional filter
    const blogsQuery = shouldFilterPublished
      ? db
          .select()
          .from(blogSchema)
          .where(eq(blogSchema.is_published, true))
          .orderBy(sql`${blogSchema.createdAt} DESC`)
          .limit(limit)
          .offset(offset)
      : db
          .select()
          .from(blogSchema)
          .orderBy(sql`${blogSchema.createdAt} DESC`)
          .limit(limit)
          .offset(offset);

    const blogs = await blogsQuery;

    const blogIds = blogs.map((b) => b.id);

    if (blogIds.length === 0) {
      return NextResponse.json({
        message: 'Blogs fetched',
        page,
        limit,
        total: totalCount,
        totalPages,
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
      total: totalCount,
      totalPages,
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
 * 🟡 POST — Create a new blog with Base64 image
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
    let imageBase64 = '';
    const imageFile = formData.get('image') as File | null;
    if (imageFile && imageFile.size > 0) {
      const maxSize = 5 * 1024 * 1024; // 5MB
      if (imageFile.size > maxSize) {
        return NextResponse.json(
          { error: 'Image size must be less than 5MB' },
          { status: 400 },
        );
      }

      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png'];
      if (!allowedTypes.includes(imageFile.type)) {
        return NextResponse.json(
          { error: 'Invalid image type. Allowed: JPEG, PNG, WebP, GIF' },
          { status: 400 },
        );
      }

      imageBase64 = await fileToBase64(imageFile);
    }

    //tags
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

    // meta
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
        image: imageBase64,
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
