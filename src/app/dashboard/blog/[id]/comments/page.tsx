'use client';

import Breadcrumb, { BreadcrumbItem } from '@/components/breadCrum';
import { useEffect, useState } from 'react';
import { FaChevronDown, FaChevronRight } from 'react-icons/fa';

export default function BlogCommentsPage({
  params,
}: {
  params: { id: string };
}) {
  const [comments, setComments] = useState<any[]>([]);
  const [blog, setBlog] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [openReply, setOpenReply] = useState<number | null>(null);

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      setComments([]);
      setOpenReply(null);

      try {
        const [blogRes, commentsRes] = await Promise.all([
          fetch(`/api/blog/id/${params.id}`),
          fetch(`/api/comments?blogId=${params.id}&published=false`),
        ]);

        const blogData = await blogRes.json();
        const commentsData = await commentsRes.json();

        console.log('📦 Blog Data:', blogData);
        console.log('💬 Comments Data:', commentsData);

        setBlog(blogData.data || blogData);
        setComments(commentsData.data || []);
      } catch (err) {
        console.error('Failed to load data:', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [params.id]);

  const breadCrumb: BreadcrumbItem[] = [
    { label: 'Blogs', href: '/dashboard/blog' },
    {
      label: blog?.title || 'Comments',
      href: `/dashboard/blog/${params.id}/comments`,
    },
  ];

  return (
    <div className="p-6">
      <div className="mb-6">
        <Breadcrumb items={breadCrumb} />
      </div>

      {/* ✅ Display blog title */}
      <div className="flex items-center gap-5 mb-6">
        <div>
          <h2 className="text-2xl font-bold inline-flex gap-2">
            Blog Name:
            <span>
              {loading ? 'Loading...' : blog?.title || 'Blog Comments'}
            </span>
          </h2>
          <p className="text-black text-sm mt-1 ">
            {comments.length} {comments.length === 1 ? 'comment' : 'comments'}
          </p>
        </div>
      </div>

      {loading ? (
        <p>Loading comments...</p>
      ) : comments.length === 0 ? (
        <p className="text-gray-500">No comments yet.</p>
      ) : (
        <div className="space-y-4">
          {comments.map((c) => (
            <div
              key={c.id}
              className="p-4 border rounded-lg shadow-sm bg-white"
            >
              <div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">
                    {new Date(c.createdAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                      timeZone: 'UTC',
                    })}
                  </span>
                  <span
                    className={`ml-2 px-2 py-[2px] rounded text-xs ${
                      c.is_published
                        ? 'bg-green-100 text-green-700'
                        : 'bg-yellow-100 text-yellow-700'
                    }`}
                  >
                    {c.is_published ? 'Published' : 'Draft'}
                  </span>
                </div>

                <p className="mt-2 text-gray-800">{c.comment}</p>

                {c.replies?.length > 0 && (
                  <button
                    className="flex items-center gap-1 text-gray-700 hover:text-gray-900 mt-3"
                    onClick={() =>
                      setOpenReply(openReply === c.id ? null : c.id)
                    }
                  >
                    {openReply === c.id ? (
                      <FaChevronDown />
                    ) : (
                      <FaChevronRight />
                    )}
                    <span className="text-xs">
                      {c.replies.length}{' '}
                      {c.replies.length === 1 ? 'Reply' : 'Replies'}
                    </span>
                  </button>
                )}
              </div>

              {openReply === c.id && c.replies?.length > 0 && (
                <div className="ml-4 mt-3 border-l-2 border-gray-300 pl-3 space-y-3">
                  {c.replies.map((r: any) => (
                    <div key={r.id} className="p-2 bg-gray-50 rounded border">
                      <div className="flex justify-between text-xs text-gray-500 mb-1">
                        <span>
                          {new Date(r.createdAt).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                            timeZone: 'UTC',
                          })}
                        </span>
                        <span
                          className={`px-2 py-[2px] rounded text-xs ${
                            r.is_published
                              ? 'bg-green-100 text-green-700'
                              : 'bg-yellow-100 text-yellow-700'
                          }`}
                        >
                          {r.is_published ? 'Published' : 'Draft'}
                        </span>
                      </div>
                      <p className="text-gray-700">{r.comment}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
