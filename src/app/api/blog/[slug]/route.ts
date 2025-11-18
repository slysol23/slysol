import { NextResponse } from 'next/server';
import { db } from '../../../../db/index';
import { blogSchema, authorSchema } from '../../../../db/schema';
import { eq } from 'drizzle-orm';

// 🔹 GET blog by SLUG (for public viewing and editing)
export async function GET(
  _req: Request,
  { params }: { params: { slug: string } },
) {
  try {
    const { slug } = params;
    const [result] = await db
      .select({
        id: blogSchema.id,
        title: blogSchema.title,
        slug: blogSchema.slug,
        description: blogSchema.description,
        content: blogSchema.content,
        image: blogSchema.image,
        tags: blogSchema.tags,
        meta: blogSchema.meta,
        authorId: blogSchema.authorId,
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
      .where(eq(blogSchema.slug, slug))
      .limit(1);

    const blog = {
      ...result,
      tags: Array.isArray(result.tags) ? result.tags : [],
      meta: result.meta ?? { title: '', description: '', keywords: [] },
    };

    return NextResponse.json({
      message: 'Blog fetched successfully',
      data: blog,
    });
  } catch (error) {
    return null;
  }
}
