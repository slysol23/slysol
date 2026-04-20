import { NextResponse } from 'next/server';
import { db } from '../../../../../db/index';
import {
  blogSchema,
  authorSchema,
  blogAuthorsSchema,
} from '../../../../../db/schema';
import { and, eq, inArray, ne } from 'drizzle-orm';
import { auth } from 'auth';

// Slugify helper
function slugify(title: string) {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

/**
 * Convert File to Base64 string
 */

// 🔹 GET blog by ID
export async function GET(
  _req: Request,
  { params }: { params: { id: string } },
) {
  try {
    const blogId = Number(params.id);
    if (isNaN(blogId))
      return NextResponse.json({ error: 'Invalid blog ID' }, { status: 400 });

    const [blogResult] = await db
      .select()
      .from(blogSchema)
      .where(eq(blogSchema.id, blogId));
    if (!blogResult)
      return NextResponse.json({ error: 'Blog not found' }, { status: 404 });

    const relations = await db
      .select()
      .from(blogAuthorsSchema)
      .where(eq(blogAuthorsSchema.blogId, blogId));
    const authorIds = relations.map((r) => r.authorId);

    const authors = authorIds.length
      ? await db
          .select()
          .from(authorSchema)
          .where(inArray(authorSchema.id, authorIds))
      : [];

    return NextResponse.json({
      message: 'Blog fetched successfully',
      data: {
        ...blogResult,
        authors,
        tags: blogResult.tags || [],
        meta: blogResult.meta || [],
        image: blogResult.image || null,
      },
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

// 🔹 PUT blog (update)
export async function PUT(
  req: Request,
  { params }: { params: { id: string } },
) {
  try {
    const session = await auth();

    if (!session?.user) {
      return NextResponse.json(
        { error: 'Unauthorized - Please log in' },
        { status: 401 },
      );
    }

    const blogId = Number(params.id);
    if (isNaN(blogId))
      return NextResponse.json({ error: 'Invalid blog ID' }, { status: 400 });

    const formData = await req.formData();
    const title = formData.get('title')?.toString();
    const description = formData.get('description')?.toString();
    const content = formData.get('content')?.toString();

    // Parse tags
    let tags: any[] | undefined;
    const tagsRaw = formData.get('tags');
    if (tagsRaw) {
      try {
        const parsed =
          typeof tagsRaw === 'string' ? JSON.parse(tagsRaw) : tagsRaw;
        if (Array.isArray(parsed)) {
          tags = parsed;
        }
      } catch (e) {
        console.error('Error parsing tags:', e);
      }
    }

    // Parse meta
    let meta: any;
    const metaRaw = formData.get('meta');
    if (metaRaw) {
      try {
        meta = typeof metaRaw === 'string' ? JSON.parse(metaRaw) : metaRaw;
      } catch (e) {
        console.error('Error parsing meta:', e);
      }
    }

    // Authors
    const authorIds = formData
      .getAll('authorId')
      .map((id) => Number(id))
      .filter((id) => !isNaN(id));

    const updateData: any = {};
    if (title) updateData.title = title;
    if (description) updateData.description = description;
    if (content) updateData.content = content;
    if (tags) updateData.tags = tags;
    if (meta) updateData.meta = meta;

    const imageField = formData.get('image');
    const existingImage = formData.get('existingImage');
    const removeImage = formData.get('removeImage')?.toString();

    // If user wants to remove the image
    if (removeImage === 'true') {
      updateData.image = null;
    }
    // If a new image URL was submitted, store it directly
    else if (typeof imageField === 'string') {
      const imageUrl = imageField.trim();
      if (imageUrl) {
        updateData.image = imageUrl;
      } else if (typeof existingImage === 'string' && existingImage.trim()) {
        updateData.image = existingImage.trim();
      } else {
        updateData.image = null;
      }
    }
    // If a file was uploaded, reject it
    else if (imageField instanceof File && imageField.size > 0) {
      return NextResponse.json(
        { error: 'Please provide an image URL instead of uploading a file' },
        { status: 400 },
      );
    }
    // If no new image but existing image provided, keep it
    else if (typeof existingImage === 'string' && existingImage.trim()) {
      updateData.image = existingImage.trim();
    }

    updateData.updatedBy = session.user.name;
    updateData.updatedAt = new Date();

    if (title) {
      let baseSlug = slugify(title);
      const existing = await db
        .select({ slug: blogSchema.slug })
        .from(blogSchema)
        .where(and(eq(blogSchema.slug, baseSlug), ne(blogSchema.id, blogId)));
      if (existing.length) baseSlug += `-${Date.now()}`;
      updateData.slug = baseSlug;
    }

    if (!Object.keys(updateData).length && !authorIds.length)
      return NextResponse.json(
        { error: 'No valid fields to update' },
        { status: 400 },
      );

    const [updatedBlog] = await db
      .update(blogSchema)
      .set(updateData)
      .where(eq(blogSchema.id, blogId))
      .returning();
    if (!updatedBlog)
      return NextResponse.json({ error: 'Blog not found' }, { status: 404 });

    // Update authors
    if (authorIds.length > 0) {
      await db
        .delete(blogAuthorsSchema)
        .where(eq(blogAuthorsSchema.blogId, blogId));
      await db
        .insert(blogAuthorsSchema)
        .values(authorIds.map((id) => ({ blogId, authorId: id })));
    }

    // Fetch updated authors
    const authors = authorIds.length
      ? await db
          .select()
          .from(authorSchema)
          .where(inArray(authorSchema.id, authorIds))
      : [];

    return NextResponse.json({
      message: 'Blog updated successfully',
      data: {
        ...updatedBlog,
        authors,
        updatedBy: session.user.name,
        updatedAt: updateData.updatedAt,
        tags: updatedBlog.tags || [],
        meta: updatedBlog.meta || [],
      },
    });
  } catch (error) {
    console.error('Error updating blog:', error);
    return NextResponse.json(
      {
        error: 'Internal server error',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 },
    );
  }
}

// 🔹 PATCH blog (publish/unpublish)
export async function PATCH(
  req: Request,
  { params }: { params: { id: string } },
) {
  try {
    const blogId = Number(params.id);
    if (isNaN(blogId))
      return NextResponse.json({ error: 'Invalid blog ID' }, { status: 400 });

    const body = await req.json();
    const { isPublished } = body;

    const [updatedBlog] = await db
      .update(blogSchema)
      .set({ is_published: isPublished })
      .where(eq(blogSchema.id, blogId))
      .returning();
    if (!updatedBlog)
      return NextResponse.json({ error: 'Blog not found' }, { status: 404 });

    const relations = await db
      .select()
      .from(blogAuthorsSchema)
      .where(eq(blogAuthorsSchema.blogId, blogId));
    const authorIds = relations.map((r) => r.authorId);
    const authors = authorIds.length
      ? await db
          .select()
          .from(authorSchema)
          .where(inArray(authorSchema.id, authorIds))
      : [];

    return NextResponse.json({
      message: `Blog ${isPublished ? 'published' : 'unpublished'} successfully`,
      data: {
        ...updatedBlog,
        authors,
        status: updatedBlog.is_published ? 'Published' : 'Draft',
      },
    });
  } catch (error) {
    console.error('Error publishing blog:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 },
    );
  }
}

// 🔹 DELETE blog
export async function DELETE(
  _req: Request,
  { params }: { params: { id: string } },
) {
  try {
    const blogId = Number(params.id);
    if (isNaN(blogId))
      return NextResponse.json({ error: 'Invalid blog ID' }, { status: 400 });

    const [deletedBlog] = await db
      .delete(blogSchema)
      .where(eq(blogSchema.id, blogId))
      .returning();
    if (!deletedBlog)
      return NextResponse.json({ error: 'Blog not found' }, { status: 404 });

    return NextResponse.json({ message: 'Blog deleted successfully' });
  } catch (error) {
    console.error('Error deleting blog:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 },
    );
  }
}
