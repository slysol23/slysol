'use client';

import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { FaTrash, FaReply } from 'react-icons/fa';
import { useUser } from '../../../providers/UserProvider';
import Breadcrumb, { BreadcrumbItem } from '@/components/breadCrum';
import { IComment } from '../../../lib/comments/type';

export default function BlogFeedbackPage() {
  const queryClient = useQueryClient();
  const { user, isLoading: userLoading } = useUser();
  const [page, setPage] = useState(1);
  const limit = 10;

  const { data, isLoading, error } = useQuery({
    queryKey: ['comments', page],
    queryFn: async () => {
      const res = await axios.get(`/api/comments?page=${page}&limit=${limit}`);
      return res.data;
    },
    enabled: !!user,
  });

  const comments: IComment[] = Array.isArray(data?.data)
    ? data.data
    : data?.data
    ? [data.data]
    : [];

  const flattenComments = (
    commentsList: IComment[],
    depth: number = 0,
  ): Array<IComment & { depth: number }> => {
    const result: Array<IComment & { depth: number }> = [];

    commentsList.forEach((comment) => {
      result.push({ ...comment, depth });

      if (comment.replies && comment.replies.length > 0) {
        result.push(...flattenComments(comment.replies, depth + 1));
      }
    });

    return result;
  };

  const flatComments = flattenComments(comments);

  // Delete mutation
  const deleteComment = useMutation<void, Error, number>({
    mutationFn: (id) => axios.delete(`/api/comments/${id}`).then(() => {}),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['comments'] }),
    onError: (err) => alert(err.message),
  });

  const handleDelete = (id: number) => {
    if (!confirm('Are you sure you want to delete this comment?')) return;
    deleteComment.mutate(id);
  };

  const breadCrumb: BreadcrumbItem[] = [
    { label: 'Comments', href: '/dashboard/feedBack' },
  ];

  if (isLoading || userLoading) {
    return (
      <div className="min-h-screen text-black flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
          <p className="text-xl">Loading...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return <p className="text-red-500">Error: {error.message}</p>;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-black">
          Comments
          <div className="mt-4">
            <Breadcrumb items={breadCrumb} />
          </div>
        </h1>
      </div>

      {flatComments.length === 0 ? (
        <p className="text-gray-400">No comments found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left border border-gray-700 rounded-lg">
            <thead className="bg-blue text-white">
              <tr>
                <th className="p-3">C.ID</th>
                <th className="p-3">Name</th>
                <th className="p-3">B.ID</th>
                <th className="p-3">Comment</th>
                <th className="p-3">Published</th>
                <th className="p-3">P.ID</th>
                <th className="p-3">Created At</th>
                <th className="p-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {flatComments.map((c, idx) => (
                <tr
                  key={c.id}
                  className={`border-t border-gray-700 ${
                    c.depth > 0 ? 'bg-gray-50' : ''
                  }`}
                >
                  <td className="p-3">{c.id}</td>
                  <td className="p-3">
                    <div className="flex items-center gap-2">
                      <span>{c.name}</span>
                    </div>
                  </td>
                  <td className="p-3">{c.blogId}</td>
                  <td className="p-3">
                    <div style={{ marginLeft: `${c.depth * 20}px` }}>
                      {c.comment}
                    </div>
                  </td>
                  <td className="p-3">
                    {c.is_published ? (
                      <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs">
                        Publishd
                      </span>
                    ) : (
                      <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded text-xs">
                        Draft
                      </span>
                    )}
                  </td>

                  <td className="p-3">
                    {c.parentId ? (
                      <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">
                        {c.parentId}
                      </span>
                    ) : (
                      <span className="text-gray-400">—</span>
                    )}
                  </td>
                  <td className="p-3">
                    {new Date(c.createdAt).toLocaleString()}
                  </td>
                  <td className="p-3">
                    <button
                      onClick={() => handleDelete(c.id)}
                      className="text-red-500 hover:text-red-700 transition-colors"
                      title="Delete comment"
                    >
                      <FaTrash />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
