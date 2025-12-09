'use client';

import Breadcrumb, { BreadcrumbItem } from '@/components/breadCrum';
import { useEffect, useState } from 'react';
import { FaChevronDown, FaChevronRight } from 'react-icons/fa';

const sortReplies = (comment: any): any => {
  if (!comment.replies || comment.replies.length === 0) {
    return comment;
  }

  const sortedReplies = [...comment.replies]
    .sort(
      (a: any, b: any) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    )
    .map(sortReplies);

  return {
    ...comment,
    replies: sortedReplies,
  };
};

export default function BlogComments({ params }: { params: { id: string } }) {
  const [comments, setComments] = useState<any[]>([]);
  const [blog, setBlog] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [openReplies, setOpenReplies] = useState<Set<number>>(new Set());

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      setComments([]);
      setOpenReplies(new Set());

      try {
        const [blogRes, commentsRes] = await Promise.all([
          fetch(`/api/blog/id/${params.id}`),
          fetch(`/api/comments?blogId=${params.id}&published=false`),
        ]);

        const blogData = await blogRes.json();
        const commentsData = await commentsRes.json();

        setBlog(blogData.data || blogData);

        const sortedComments = (commentsData.data || [])
          .map(sortReplies)
          .sort(
            (a: any, b: any) =>
              new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
          );

        setComments(sortedComments);
      } catch (err) {
        console.error('Failed to load data:', err);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [params.id]);

  const updatedReplies = (
    comments: any[],
    targetId: number,
    newPublishStatus: boolean,
  ): any[] => {
    return comments.map((comment) => {
      if (comment.id === targetId) {
        return { ...comment, is_published: newPublishStatus };
      }

      if (comment.replies && comment.replies.length > 0) {
        return {
          ...comment,
          replies: updatedReplies(comment.replies, targetId, newPublishStatus),
        };
      }

      return comment;
    });
  };

  const togglePublish = async (id: number, current: boolean) => {
    try {
      const res = await fetch(`/api/comments/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          is_published: !current,
        }),
      });

      if (!res.ok) {
        throw new Error('Failed to update publish status');
      }

      setComments((prev) => updatedReplies(prev, id, !current));
    } catch (err) {
      console.error('Toggle publish failed:', err);
    }
  };

  const toggleReplies = (commentId: number) => {
    setOpenReplies((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(commentId)) {
        newSet.delete(commentId);
      } else {
        newSet.add(commentId);
      }
      return newSet;
    });
  };

  const commentDate = (dateString: string) => {
    const date = new Date(dateString);
    date.setHours(date.getHours() + 8);
    const day = String(date.getDate()).padStart(2, '0');
    const monthNames = [
      'Jan',
      'Feb',
      'Mar',
      'Apr',
      'May',
      'Jun',
      'Jul',
      'Aug',
      'Sep',
      'Oct',
      'Nov',
      'Dec',
    ];
    const month = monthNames[date.getMonth()];
    const year = date.getFullYear();
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');

    return `${day} ${month} ${year} ${hours}:${minutes}`;
  };

  const RenderComment = ({
    comment,
    depth = 0,
  }: {
    comment: any;
    depth?: number;
  }) => {
    const isOpen = openReplies.has(comment.id);
    const hasReplies = comment.replies && comment.replies.length > 0;

    return (
      <div
        key={comment.id}
        className={`${
          depth > 0 ? 'ml-4 mt-3 border-l-2 border-gray-300 pl-3' : ''
        }`}
      >
        <div
          className={`p-${depth > 0 ? '2' : '4'} border rounded-lg shadow-sm ${
            depth > 0 ? 'bg-gray-50' : 'bg-white'
          }`}
        >
          <div>
            <div className="flex justify-between items-center">
              <span
                className={`${depth > 0 ? 'text-xs' : 'text-sm'} text-gray-600`}
              >
                {commentDate(comment.createdAt)}
              </span>
              <span
                onClick={() => togglePublish(comment.id, comment.is_published)}
                className={`ml-2 px-2 py-[2px] rounded text-xs cursor-pointer hover:opacity-80 ${
                  comment.is_published
                    ? 'bg-green-100 text-green-700'
                    : 'bg-yellow-100 text-yellow-700'
                }`}
              >
                {comment.is_published ? 'Published' : 'Draft'}
              </span>
            </div>

            <p
              className={`mt-2 ${
                depth > 0 ? 'text-gray-700' : 'text-gray-800'
              }`}
            >
              {comment.comment}
            </p>

            {hasReplies && (
              <button
                className="flex items-center gap-1 text-gray-700 hover:text-gray-900 mt-3"
                onClick={() => toggleReplies(comment.id)}
              >
                {isOpen ? <FaChevronDown /> : <FaChevronRight />}
                <span className="text-xs">
                  {comment.replies.length}{' '}
                  {comment.replies.length === 1 ? 'Reply' : 'Replies'}
                </span>
              </button>
            )}
          </div>

          {isOpen && hasReplies && (
            <div className="space-y-3 mt-3">
              {comment.replies.map((reply: any) => (
                <RenderComment
                  key={reply.id}
                  comment={reply}
                  depth={depth + 1}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    );
  };

  const breadCrumb: BreadcrumbItem[] = [
    { label: 'Blogs', href: '/dashboard/blog' },
    {
      label: blog?.title || 'Comments',
      href: `/dashboard/blog`,
    },
    {
      label: 'Comments',
      href: `/dashboard/comments`,
    },
  ];

  return (
    <div>
      {/* Title + Comment Count */}
      <div className="flex items-center gap-5 mb-6">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            {loading ? 'Loading...' : blog?.title || 'Blog Comments'}
            <span className="text-gray-500 text-sm font-medium  ">
              {comments.length} {comments.length === 1 ? 'comment' : 'comments'}
            </span>
          </h2>
        </div>
      </div>

      <div>
        <Breadcrumb items={breadCrumb} />
      </div>

      {loading ? (
        <p>Loading comments...</p>
      ) : comments.length === 0 ? (
        <p className="text-gray-500">No comments yet.</p>
      ) : (
        <div className="space-y-4">
          {comments.map((c: any) => (
            <RenderComment key={c.id} comment={c} />
          ))}
        </div>
      )}
    </div>
  );
}
