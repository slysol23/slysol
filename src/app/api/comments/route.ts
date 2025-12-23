import { NextRequest, NextResponse } from 'next/server';
import { db } from 'db';
import { commentSchema, blogSchema } from '../../../db/schema';
import { eq, and } from 'drizzle-orm';

type Comment = typeof commentSchema.$inferSelect;

type commentReplies = Comment & {
  blogSlug: string;
  replies: commentReplies[];
};

function buildNestedComments(
  comments: (Comment & { blogSlug: string })[],
): commentReplies[] {
  const map: Record<number, commentReplies> = {};
  const roots: commentReplies[] = [];

  comments.forEach((comment) => {
    map[comment.id] = {
      ...comment,
      replies: [],
      blogSlug: comment.blogSlug,
    };
  });

  comments.forEach((comment) => {
    const currentComment = map[comment.id];
    if (comment.parentId && map[comment.parentId]) {
      map[comment.parentId].replies.push(currentComment);
    } else if (!comment.parentId) {
      roots.push(currentComment);
    }
  });

  return roots;
}

export async function GET(request: NextRequest) {
  const params = request.nextUrl.searchParams;
  const page = parseInt(params.get('page') || '1');
  const limit = parseInt(params.get('limit') || '1000');
  const publishedOnly = params.get('published') === 'true';
  const blogId = params.get('blogId');

  try {
    let comments: (Comment & { blogSlug: string })[];
    const baseQuery = db
      .select({
        id: commentSchema.id,
        blogId: commentSchema.blogId,
        parentId: commentSchema.parentId,
        name: commentSchema.name,
        email: commentSchema.email,
        comment: commentSchema.comment,
        is_published: commentSchema.is_published,
        createdAt: commentSchema.createdAt,
        updatedAt: commentSchema.updatedAt,
        blogSlug: blogSchema.slug,
      })
      .from(commentSchema)
      .innerJoin(blogSchema, eq(commentSchema.blogId, blogSchema.id));

    if (blogId) {
      comments = publishedOnly
        ? await baseQuery.where(
            and(
              eq(commentSchema.blogId, parseInt(blogId)),
              eq(commentSchema.is_published, true),
            ),
          )
        : await baseQuery.where(eq(commentSchema.blogId, parseInt(blogId)));
    } else {
      const queryWithPublish = publishedOnly
        ? baseQuery.where(eq(commentSchema.is_published, true))
        : baseQuery;

      comments = await queryWithPublish.limit(limit).offset((page - 1) * limit);
    }

    const nestedComments = buildNestedComments(comments);

    return NextResponse.json({
      data: nestedComments,
      total: comments.length,
      page,
      limit,
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

    const blog = await db
      .select({ slug: blogSchema.slug })
      .from(blogSchema)
      .where(eq(blogSchema.id, parseInt(blogId.toString())))
      .limit(1);

    const commentReply: commentReplies = {
      ...newComment[0],
      blogSlug: blog[0]?.slug || '',
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
