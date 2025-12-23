import { NextRequest, NextResponse } from 'next/server';
import { db } from 'db';
import { commentSchema } from '../../../../db/schema';
import { sql, inArray, isNull, and } from 'drizzle-orm';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const blogIdsParam = req.nextUrl.searchParams.get('blogIds');

    let commentCounts;

    if (blogIdsParam) {
      const blogIds = blogIdsParam
        .split(',')
        .map((id) => parseInt(id.trim()))
        .filter((id) => !isNaN(id));

      if (blogIds.length === 0) {
        return NextResponse.json([]);
      }

      commentCounts = await db
        .select({
          blogId: commentSchema.blogId,
          count: sql<number>`CAST(COUNT(*) AS INTEGER)`,
        })
        .from(commentSchema)
        .where(
          and(
            inArray(commentSchema.blogId, blogIds),
            isNull(commentSchema.parentId),
          ),
        )
        .groupBy(commentSchema.blogId);
    } else {
      commentCounts = await db
        .select({
          blogId: commentSchema.blogId,
          count: sql<number>`CAST(COUNT(*) AS INTEGER)`,
        })
        .from(commentSchema)
        .where(isNull(commentSchema.parentId))
        .groupBy(commentSchema.blogId);
    }

    return NextResponse.json(commentCounts);
  } catch (err) {
    console.error('GET /api/comments/count error:', err);
    return NextResponse.json(
      { error: 'Internal Server Error', details: (err as Error).message },
      { status: 500 },
    );
  }
}
