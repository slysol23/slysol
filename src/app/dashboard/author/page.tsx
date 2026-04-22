'use client';

import React, { useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { author } from 'lib/author';
import { IAuthor } from 'lib/blog/type';
import { FaPen, FaTrash } from 'react-icons/fa';
import DashboardListTable from '@/components/dashboard/DashboardListTable';
import { BreadcrumbItem } from '@/components/breadCrum';
import axios from 'axios';
import { useSearchParams, useRouter } from 'next/navigation';
import { DashboardTableColumn } from 'types/dashboard';
import DashboardButton from '@/components/Button/DashboardButton';
import Link from 'next/link';
import {
  confirmDashboardAction,
  showDashboardError,
  showDashboardSuccess,
} from '@/utils/dashboard-alert';

export default function AuthorDashboardPage() {
  const queryClient = useQueryClient();
  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    const created = searchParams?.get('created');
    const updated = searchParams?.get('updated');
    const deleted = searchParams?.get('deleted');

    if (created === 'true') {
      void showDashboardSuccess('Author created successfully!');
      router.replace('/dashboard/author', { scroll: false });
    }

    if (updated === 'true') {
      void showDashboardSuccess('Author updated successfully!');
      router.replace('/dashboard/author', { scroll: false });
    }

    if (deleted === 'true') {
      void showDashboardSuccess('Author deleted successfully!');
      router.replace('/dashboard/author', { scroll: false });
    }
  }, [searchParams, router]);

  const {
    data: authors = [],
    isLoading,
    error,
  } = useQuery<IAuthor[], Error>({
    queryKey: ['authors'],
    queryFn: async () => {
      const res = await author.getAll();
      return res?.data || [];
    },
  });

  const deleteAuthor = useMutation({
    mutationFn: async (id: number) => {
      const res = await axios.delete(`/api/author/${id}`);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['authors'] });
      router.push('/dashboard/author?deleted=true');
    },
    onError: (mutationError: any) => {
      if (mutationError.response?.status === 409) {
        const data = mutationError.response.data;
        void showDashboardError(
          `Cannot delete author. This author is associated with total ${data.blogsCount} blog. Please remove the author from these blogs first.`,
        );
      } else {
        void showDashboardError(
          'Failed to delete author: ' +
            (mutationError.response?.data?.message || mutationError.message),
        );
      }
    },
  });

  const handleDelete = async (id: number) => {
    const confirmed = await confirmDashboardAction({
      title: 'Delete author?',
      text: 'Are you sure you want to delete this author?',
      confirmButtonText: 'Delete',
    });

    if (!confirmed) return;
    deleteAuthor.mutate(id);
  };

  const breadCrumb: BreadcrumbItem[] = [
    { label: 'Authors', href: '/dashboard/author' },
  ];

  const columns: DashboardTableColumn<IAuthor>[] = [
    {
      key: 'index',
      header: '#',
      skeletonType: 'text',
      cell: (_, index) => index + 1,
    },
    {
      key: 'name',
      header: 'Name',
      skeletonType: 'text',
      cell: (authorItem) => (
        <span className="font-semibold">
          {authorItem.firstName} {authorItem.lastName}
        </span>
      ),
    },
    {
      key: 'email',
      header: 'Email',
      skeletonType: 'text',
      cell: (authorItem) => authorItem.email,
    },
    {
      key: 'created',
      header: 'Created',
      skeletonType: 'text',
      cell: (authorItem) =>
        authorItem.createdAt
          ? new Date(authorItem.createdAt).toLocaleDateString('en-GB', {
              day: '2-digit',
              month: 'numeric',
              year: 'numeric',
            })
          : '-',
    },
    {
      key: 'actions',
      header: 'Actions',
      headerClassName: 'text-center',
      className: 'text-center',
      skeletonType: 'actions',
      cell: (authorItem) => (
        <div className="flex items-center justify-center gap-3">
          <Link
            href={`/dashboard/author/edit/${authorItem.id}`}
            className="text-yellow-500 hover:text-yellow-300"
          >
            <FaPen />
          </Link>
          <button
            onClick={() => void handleDelete(authorItem.id)}
            className="text-red-500 hover:text-red-400"
          >
            <FaTrash />
          </button>
        </div>
      ),
    },
  ];

  return (
    <DashboardListTable
      title="Authors"
      breadcrumbs={breadCrumb}
      headerActions={
        <DashboardButton href="/dashboard/author/add">Author</DashboardButton>
      }
      data={authors}
      columns={columns}
      rowKey={(authorItem) => authorItem.id}
      loading={isLoading}
      error={error?.message || null}
      emptyMessage="No authors found."
    />
  );
}
