import { NextRequest, NextResponse } from 'next/server';
import { db } from 'db';
import { commentSchema } from '../../../../db/schema';
import { eq } from 'drizzle-orm';

type Comment = typeof commentSchema.$inferSelect;

type commentReplies = Comment & {
  replies: commentReplies[];
};

async function getCommentWithReplies(
  commentId: number,
): Promise<commentReplies | null> {
  const mainComment = await db
    .select()
    .from(commentSchema)
    .where(eq(commentSchema.id, commentId))
    .limit(1);

  if (mainComment.length === 0) {
    return null;
  }

  const comment = mainComment[0];
  const replies = await db
    .select()
    .from(commentSchema)
    .where(eq(commentSchema.parentId, commentId));
  const processedReplies: commentReplies[] = await Promise.all(
    replies.map(async (replies): Promise<commentReplies> => {
      const nestedReplies: commentReplies | null = await getCommentWithReplies(
        replies.id,
      );
      return {
        ...replies,
        replies: nestedReplies ? [nestedReplies] : [],
      };
    }),
  );

  return {
    ...comment,
    replies: processedReplies.length > 0 ? processedReplies : [],
  };
}
// GET
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  const commentId = parseInt(params.id);

  if (isNaN(commentId)) {
    return NextResponse.json({ error: 'Invalid comment ID' }, { status: 400 });
  }

  const comment = await getCommentWithReplies(commentId);

  if (!comment) {
    return NextResponse.json({ error: 'Comment not found' }, { status: 404 });
  }

  return NextResponse.json({ data: comment });
}

// PUT
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  const commentId = parseInt(params.id);
  const body = await request.json();

  if (isNaN(commentId)) {
    return NextResponse.json({ error: 'Invalid comment ID' }, { status: 400 });
  }

  const updatedComment = await db
    .update(commentSchema)
    .set({
      ...body,
      updatedAt: new Date(),
    })
    .where(eq(commentSchema.id, commentId))
    .returning();

  if (updatedComment.length === 0) {
    return NextResponse.json({ error: 'Comment not found' }, { status: 404 });
  }

  const comment = await getCommentWithReplies(commentId);

  return NextResponse.json({ data: comment });
}

// DELETE
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  const commentId = parseInt(params.id);

  if (isNaN(commentId)) {
    return NextResponse.json({ error: 'Invalid comment ID' }, { status: 400 });
  }

  const deletedComment = await db
    .delete(commentSchema)
    .where(eq(commentSchema.id, commentId))
    .returning();

  if (deletedComment.length === 0) {
    return NextResponse.json({ error: 'Comment not found' }, { status: 404 });
  }

  return NextResponse.json({
    message: 'Comment deleted successfully',
    data: deletedComment[0],
  });
}
