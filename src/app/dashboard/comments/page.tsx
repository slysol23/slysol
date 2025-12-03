'use client';

import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { FaTrash, FaPen, FaEye, FaEyeSlash } from 'react-icons/fa';
import { useUser } from '../../../providers/UserProvider';
import Breadcrumb, { BreadcrumbItem } from '@/components/breadCrum';
import { IComment } from '../../../lib/comments/type';
import Link from 'next/link';

export default function BlogFeedbackPage() {
  const queryClient = useQueryClient();
  const { user, isLoading: userLoading } = useUser();
  const [page, setPage] = useState(1);
  const limit = 1000; // Increased limit to get all comments

  const { data, isLoading, error } = useQuery({
    queryKey: ['comments', page],
    queryFn: async () => {
      // Fetch all comments without any filters
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

  const sortedComments = [...comments].sort((a, b) => {
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });

  const flatComments = flattenComments(sortedComments);

  const deleteComment = useMutation<void, Error, number>({
    mutationFn: (id) => axios.delete(`/api/comments/${id}`).then(() => {}),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['comments'] }),
    onError: (err) => alert(err.message),
  });

  const togglePublish = useMutation<
    void,
    Error,
    { id: number; isPublished: boolean }
  >({
    mutationFn: ({ id, isPublished }) =>
      axios
        .patch(`/api/comments/${id}`, { is_published: !isPublished })
        .then(() => {}),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['comments'] }),
    onError: (err) => alert(err.message),
  });

  const handleDelete = (id: number) => {
    if (!confirm('Are you sure you want to delete this comment?')) return;
    deleteComment.mutate(id);
  };

  const handleTogglePublish = (id: number, currentStatus: boolean) => {
    const action = currentStatus ? 'unpublish' : 'publish';
    if (!confirm(`Are you sure you want to ${action} this comment?`)) return;
    togglePublish.mutate({ id, isPublished: currentStatus });
  };

  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    const day = String(date.getUTCDate()).padStart(2, '0');
    const month = String(date.getUTCMonth() + 1).padStart(2, '0');
    const year = String(date.getUTCFullYear()).slice(-2);
    const hours = String(date.getUTCHours()).padStart(2, '0');
    const minutes = String(date.getUTCMinutes()).padStart(2, '0');

    return `${day}/${month}/${year} ${hours}:${minutes}`;
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
        <p className="text-black">No comments found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left border border-gray-700 rounded-lg">
            <thead className="bg-blue text-white">
              <tr>
                <th className="p-3">ID</th>
                <th className="p-3">Name</th>
                <th className="p-3">Blog</th>
                <th className="p-3">Comment</th>
                <th className="p-3">Status</th>
                <th className="p-3">Parent</th>
                <th className="p-3">Created At</th>
                <th className="p-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {flatComments.map((c, idx) => (
                <tr
                  key={c.id}
                  className={`hover:bg-gray-400 border-t border-gray-700 ${
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
                    <div className="max-w-xs truncate" title={c.comment}>
                      {c.comment}
                    </div>
                  </td>
                  <td className="p-3">
                    {c.is_published ? (
                      <span className="bg-green-100 text-black px-2 py-1 rounded text-xs">
                        Published
                      </span>
                    ) : (
                      <span className="bg-yellow-100 text-black px-2 py-1 rounded text-xs">
                        Draft
                      </span>
                    )}
                  </td>

                  <td className="p-3">
                    {c.parentId ? (
                      <span className="text-center py-1 rounded">
                        {c.parentId}
                      </span>
                    ) : (
                      <span className="text-gray-400">—</span>
                    )}
                  </td>
                  <td className="p-3 whitespace-nowrap">
                    {formatDateTime(c.createdAt)}
                  </td>
                  <td className="p-3">
                    <div className="flex gap-3">
                      <button
                        onClick={() =>
                          handleTogglePublish(c.id, c.is_published)
                        }
                        className={`${
                          c.is_published
                            ? 'text-orange-500 hover:text-orange-700'
                            : 'text-green-500 hover:text-green-700'
                        } transition-colors`}
                        title={c.is_published ? 'Unpublish' : 'Publish'}
                      >
                        {c.is_published ? <FaEyeSlash /> : <FaEye />}
                      </button>
                      <Link
                        href={`/dashboard/comments/edit/${c.id}`}
                        className="text-yellow-500 hover:text-yellow-300 transition"
                        title="Edit"
                      >
                        <FaPen />
                      </Link>
                      <button
                        onClick={() => handleDelete(c.id)}
                        className="text-red-500 hover:text-red-700 transition-colors"
                        title="Delete comment"
                      >
                        <FaTrash />
                      </button>
                    </div>
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
