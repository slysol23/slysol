import { NextRequest, NextResponse } from 'next/server';
import { db } from 'db';
import { commentSchema } from '../../../db/schema';
import { eq, and } from 'drizzle-orm';

type Comment = typeof commentSchema.$inferSelect;

type commentReplies = Comment & {
  replies: commentReplies[];
};

function buildNestedComments(comments: Comment[]): commentReplies[] {
  // Create a map of all comments first
  const map: Record<number, commentReplies> = {};
  const roots: commentReplies[] = [];

  // First pass: create the map with all comments
  comments.forEach((comment) => {
    map[comment.id] = {
      ...comment,
      replies: [],
    };
  });

  // Second pass: build the tree structure
  comments.forEach((comment) => {
    const currentComment = map[comment.id];

    if (comment.parentId && map[comment.parentId]) {
      // This is a reply, add it to its parent's replies array
      map[comment.parentId].replies.push(currentComment);
    } else if (!comment.parentId) {
      // This is a root comment (no parent)
      roots.push(currentComment);
    }
    // If parentId exists but parent not in map, it's an orphan (skip it)
  });

  return roots;
}

// GET
export async function GET(request: NextRequest) {
  const params = request.nextUrl.searchParams;
  const page = parseInt(params.get('page') || '1');
  const limit = parseInt(params.get('limit') || '1000');
  const publishedOnly = params.get('published') === 'true';
  const blogId = params.get('blogId');

  let comments: Comment[];

  try {
    // When fetching comments for a specific blog, get ALL comments
    // Don't apply pagination when building nested structure
    // because we need all comments to properly nest replies

    if (blogId) {
      // Fetch ALL comments for this blog to ensure proper nesting
      if (publishedOnly) {
        comments = await db
          .select()
          .from(commentSchema)
          .where(
            and(
              eq(commentSchema.blogId, parseInt(blogId)),
              eq(commentSchema.is_published, true),
            ),
          );
      } else {
        comments = await db
          .select()
          .from(commentSchema)
          .where(eq(commentSchema.blogId, parseInt(blogId)));
      }
    } else {
      // When not filtering by blogId, apply pagination
      let query = db.select().from(commentSchema);

      if (publishedOnly) {
        comments = await query
          .where(eq(commentSchema.is_published, true))
          .limit(limit)
          .offset((page - 1) * limit);
      } else {
        comments = await query.limit(limit).offset((page - 1) * limit);
      }
    }

    const nestedComments = buildNestedComments(comments);

    return NextResponse.json({
      data: nestedComments,
      total: comments.length,
      page: page,
      limit: limit,
    });
  } catch (error) {
    console.error('Error fetching comments:', error);
    return NextResponse.json(
      { error: 'Failed to fetch comments' },
      { status: 500 },
    );
  }
}

// POST
export async function POST(request: NextRequest) {
  let body: {
    blogId?: string | number;
    parentId?: string | number | null;
    name?: string;
    email?: string | null;
    comment?: string;
  } = {};

  const contentType = request.headers.get('content-type') || '';

  try {
    if (contentType.includes('application/json')) {
      body = await request.json();
    } else if (
      contentType.includes('application/x-www-form-urlencoded') ||
      contentType.includes('multipart/form-data')
    ) {
      const formData = await request.formData();
      body.blogId = formData.get('blogId') as string;
      body.parentId = formData.get('parentId') as string | null;
      body.name = formData.get('name') as string;
      body.email = formData.get('email') as string | null;
      body.comment = formData.get('comment') as string;
    } else {
      return NextResponse.json(
        { error: 'Unsupported content type' },
        { status: 415 },
      );
    }

    const { blogId, parentId, name, email, comment } = body;

    if (!blogId || !name || !comment) {
      return NextResponse.json(
        {
          error:
            'Missing required fields: blogId, name, and comment are required',
        },
        { status: 400 },
      );
    }

    const newComment = await db
      .insert(commentSchema)
      .values({
        blogId: parseInt(blogId.toString()),
        parentId: parentId ? parseInt(parentId.toString()) : null,
        name: name.toString(),
        email: email ? email.toString() : null,
        comment: comment.toString(),
        is_published: false,
      })
      .returning();

    const commentReply: commentReplies = {
      ...newComment[0],
      replies: [],
    };

    return NextResponse.json({ data: commentReply }, { status: 201 });
  } catch (error) {
    console.error('Error creating comment:', error);
    return NextResponse.json(
      { error: 'Failed to create comment' },
      { status: 500 },
    );
  }
}
