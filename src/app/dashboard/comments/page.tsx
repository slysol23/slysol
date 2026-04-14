'use client';

import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { FaTrash, FaPen } from 'react-icons/fa';
import { MdPublicOff, MdPublish } from 'react-icons/md';
import { useUser } from '../../../providers/UserProvider';
import { IComment } from '../../../lib/comments/type';
import Link from 'next/link';
import { toast } from 'react-toastify';
import DashboardListTable from '@/components/dashboard/DashboardListTable';
import { BreadcrumbItem } from '@/components/breadCrum';
import { DashboardTableColumn } from 'types/dashboard';

type FlatComment = IComment & { depth: number };

export default function CommentPage() {
  const queryClient = useQueryClient();
  const { user, isLoading: userLoading } = useUser();
  const page = 1;
  const limit = 1000;

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

  const flattenComments = (commentsList: IComment[], depth: number = 0) => {
    const result: FlatComment[] = [];
    commentsList.forEach((comment) => {
      result.push({ ...comment, depth });
      if (comment.replies && comment.replies.length > 0) {
        result.push(...flattenComments(comment.replies, depth + 1));
      }
    });
    return result;
  };

  const sortedComments = [...comments].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  );

  const flatComments = flattenComments(sortedComments);

  const deleteComment = useMutation<void, Error, number>({
    mutationFn: (id) => axios.delete(`/api/comments/${id}`).then(() => {}),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['comments'] });
      toast.success('Comment deleted successfully!', {
        autoClose: 3000,
        position: 'bottom-right',
      });
    },
    onError: (mutationError: any) => {
      toast.error('Failed to delete comment: ' + mutationError.message, {
        autoClose: 3000,
        position: 'bottom-right',
      });
    },
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
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['comments'] });
      toast.success(
        variables.isPublished ? 'Comment unpublished!' : 'Comment published!',
        { autoClose: 3000, position: 'bottom-right' },
      );
    },
    onError: (mutationError: any) => {
      toast.error('Failed to update comment: ' + mutationError.message, {
        autoClose: 3000,
        position: 'bottom-right',
      });
    },
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

  const commentDate = (dateString: string) => {
    const date = new Date(dateString);
    date.setHours(date.getHours() + 8);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = String(date.getFullYear()).slice(-2);
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${day}/${month}/${year} ${hours}:${minutes}`;
  };

  const breadCrumb: BreadcrumbItem[] = [
    { label: 'Comments', href: '/dashboard/comments' },
  ];

  const columns: DashboardTableColumn<FlatComment>[] = [
    {
      key: 'id',
      header: 'ID',
      skeletonType: 'text',
      cell: (comment) => comment.id,
    },
    {
      key: 'name',
      header: 'Name',
      skeletonType: 'text',
      cell: (comment) => comment.name,
    },
    {
      key: 'blog',
      header: 'Blog',
      skeletonType: 'text',
      cell: (comment) => (
        <Link href={`/blog/${comment.blogSlug}`} className="hover:text-sky-700">
          {comment.blogId}
        </Link>
      ),
    },
    {
      key: 'comment',
      header: 'Comment',
      skeletonType: 'text',
      cell: (comment) => (
        <div className="max-w-3xs truncate" title={comment.comment}>
          {comment.comment}
        </div>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      skeletonType: 'badge',
      cell: (comment) =>
        comment.is_published ? (
          <span className="bg-green-100 text-black px-2 py-1 rounded text-xs">
            Published
          </span>
        ) : (
          <span className="bg-yellow-100 text-black px-2 py-1 rounded text-xs">
            Draft
          </span>
        ),
    },
    {
      key: 'parent',
      header: 'Parent',
      skeletonType: 'text',
      cell: (comment) =>
        comment.parentId || <span className="text-gray-400">-</span>,
    },
    {
      key: 'createdAt',
      header: 'Created At',
      className: 'whitespace-nowrap',
      skeletonType: 'text',
      cell: (comment) => commentDate(comment.createdAt),
    },
    {
      key: 'actions',
      header: 'Actions',
      skeletonType: 'actions',
      cell: (comment) => (
        <div className="flex gap-3">
          <button
            onClick={() =>
              handleTogglePublish(comment.id, comment.is_published)
            }
            className={`transition-colors ${
              comment.is_published
                ? 'text-orange-500 hover:text-orange-700'
                : 'text-green-500 hover:text-green-700'
            }`}
            title={comment.is_published ? 'Unpublish' : 'Publish'}
          >
            {comment.is_published ? <MdPublicOff /> : <MdPublish />}
          </button>
          <Link
            href={`/dashboard/comments/edit/${comment.id}`}
            className="text-yellow-500 hover:text-yellow-300 transition"
            title="Edit"
          >
            <FaPen />
          </Link>
          <button
            onClick={() => handleDelete(comment.id)}
            className="text-red-500 hover:text-red-700 transition-colors"
            title="Delete comment"
          >
            <FaTrash />
          </button>
        </div>
      ),
    },
  ];

  return (
    <DashboardListTable
      title="Comments"
      breadcrumbs={breadCrumb}
      data={flatComments}
      columns={columns}
      rowKey={(comment) => comment.id}
      loading={isLoading || userLoading}
      error={(error as Error | undefined)?.message || null}
      emptyMessage="No comments found."
      skeletonRows={6}
      rowClassName={(comment) => (comment.depth > 0 ? 'bg-gray-50' : undefined)}
    />
  );
}
