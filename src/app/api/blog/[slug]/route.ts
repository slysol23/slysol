import { NextResponse } from 'next/server';
import { db } from '../../../../db/index';
import {
  blogSchema,
  blogAuthorsSchema,
  authorSchema,
} from '../../../../db/schema';
import { eq, inArray } from 'drizzle-orm';

// GET blog by slug with all authors
export async function GET(
  _req: Request,
  { params }: { params: { slug: string } },
) {
  try {
    const { slug } = params;

    // 1️⃣ Fetch blog by slug
    const [blogResult] = await db
      .select()
      .from(blogSchema)
      .where(eq(blogSchema.slug, slug));

    if (!blogResult) {
      return NextResponse.json({ error: 'Blog not found' }, { status: 404 });
    }

    // 2️⃣ Fetch all author relations for this blog
    const relations = await db
      .select()
      .from(blogAuthorsSchema)
      .where(eq(blogAuthorsSchema.blogId, blogResult.id));

    const authorIds = relations.map((r) => r.authorId);

    // 3️⃣ Fetch all authors
    const authors = authorIds.length
      ? await db
          .select()
          .from(authorSchema)
          .where(inArray(authorSchema.id, authorIds))
      : [];

    // 4️⃣ Prepare blog object
    const blog = {
      ...blogResult,
      authors, // array of authors
      tags: Array.isArray(blogResult.tags) ? blogResult.tags : [],
      meta: blogResult.meta ?? { title: '', description: '', keywords: [] },
    };

    return NextResponse.json({
      message: 'Blog fetched successfully',
      data: blog,
    });
  } catch (error) {
    console.error('Error fetching blog by slug:', error);
    return NextResponse.json(
      {
        error: 'Failed to fetch blog',
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    );
  }
}
