'use client';

import React, { useEffect, useState } from 'react';
import { blog } from 'lib/blog';
import { comments } from 'lib/comments';
import { BlogApiResponse, IBlog } from 'lib/type';
import { FaPen, FaTrash, FaPlus, FaEye, FaCommentDots } from 'react-icons/fa';
import Link from 'next/link';
import { useUser } from '../../../providers/UserProvider';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import Image from 'next/image';
import { toast } from 'react-toastify';
import { useSearchParams, useRouter } from 'next/navigation';
import DashboardListTable from '@/components/dashboard/DashboardListTable';
import { BreadcrumbItem } from '@/components/breadCrum';
import { DashboardTableColumn } from 'types/dashboard';

export default function BlogDashboardPage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    const updated = searchParams.get('updated');
    const published = searchParams.get('published');
    const deleted = searchParams.get('deleted');
    const created = searchParams.get('created');

    if (created === 'true') {
      toast.success('Blog created successfully!', {
        autoClose: 3000,
        position: 'bottom-right',
      });
      router.replace('/dashboard/blog', { scroll: false });
    }
    if (updated === 'true') {
      toast.success('Blog updated successfully!', {
        autoClose: 3000,
        position: 'bottom-right',
      });
      router.replace('/dashboard/blog', { scroll: false });
    }
    if (published === 'true') {
      toast.success('Blog published successfully!', {
        autoClose: 3000,
        position: 'bottom-right',
      });
      router.replace('/dashboard/blog', { scroll: false });
    }
    if (published === 'false') {
      toast.success('Blog unpublished successfully!', {
        autoClose: 3000,
        position: 'bottom-right',
      });
      router.replace('/dashboard/blog', { scroll: false });
    }
    if (deleted === 'true') {
      toast.success('Blog deleted successfully!', {
        autoClose: 3000,
        position: 'bottom-right',
      });
      router.replace('/dashboard/blog', { scroll: false });
    }
  }, [searchParams, router]);

  const queryClient = useQueryClient();
  const { user, isLoading: userLoading } = useUser();
  const [page, setPage] = useState(1);
  const limit = 10;

  const { data, isLoading, error } = useQuery<BlogApiResponse, Error>({
    queryKey: ['blogs', page],
    queryFn: () => blog.getAll(page, limit, false),
    staleTime: 1000 * 60,
    enabled: !!user,
  });

  const blogs: IBlog[] = data?.data ?? [];
  const totalPages: number = data?.totalPages ?? 1;

  const blogIds = blogs.map((item) => item.id);
  const {
    data: commentsData,
    isLoading: commentsLoading,
    error: commentsError,
  } = useQuery<{ blogId: number; count: number }[], Error>({
    queryKey: ['commentsCount', blogIds],
    queryFn: () => comments.getCounts(blogIds),
    staleTime: 1000 * 60,
    enabled: blogs.length > 0,
  });

  const commentsCountMap: Record<number, number> = {};
  (commentsData || []).forEach((item) => {
    commentsCountMap[item.blogId] = item.count;
  });

  const deleteMutation = useMutation<void, Error, number>({
    mutationFn: (id) => axios.delete(`/api/blog/id/${id}`).then(() => {}),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['blogs'] });
      queryClient.invalidateQueries({ queryKey: ['commentsCount'] });
      router.push('/dashboard/blog?deleted=true');
    },
    onError: (mutationError) => {
      toast.error(`Failed to delete blog: ${mutationError.message}`, {
        autoClose: 3000,
        position: 'bottom-right',
      });
    },
  });

  const handleDelete = (id: number) => {
    if (!confirm('Are you sure you want to delete this blog?')) return;
    deleteMutation.mutate(id);
  };

  const getAuthorDisplay = (blogItem: IBlog) => {
    if (Array.isArray(blogItem.authors) && blogItem.authors.length > 0) {
      return blogItem.authors
        .map((authorItem) => `${authorItem.firstName} ${authorItem.lastName}`)
        .join(', ');
    }

    return 'No authors';
  };

  const getUpdatedByDisplay = (blogItem: IBlog) => {
    if (!blogItem.updatedBy) return '-';
    if (typeof blogItem.updatedBy === 'string') return blogItem.updatedBy;
    if (typeof blogItem.updatedBy === 'object' && blogItem.updatedBy.name) {
      return blogItem.updatedBy.name;
    }

    return '-';
  };

  const breadCrumb: BreadcrumbItem[] = [
    { label: 'Blogs', href: '/dashboard/blog' },
  ];

  const columns: DashboardTableColumn<IBlog>[] = [
    {
      key: 'cover',
      header: 'Cover',
      skeletonType: 'image',
      cell: (blogItem) =>
        blogItem.image ? (
          <Image
            width={100}
            height={100}
            unoptimized
            src={
              blogItem.image.startsWith('data:')
                ? blogItem.image
                : `data:image/jpeg;base64,${blogItem.image}`
            }
            alt={blogItem.title}
            className="w-20 h-12 object-cover rounded-lg"
          />
        ) : (
          <span className="text-gray-400 text-sm">No image</span>
        ),
    },
    {
      key: 'title',
      header: 'Title',
      className: 'font-semibold',
      skeletonType: 'text',
      cell: (blogItem) => (
        <div className="max-w-xs truncate" title={blogItem.title}>
          {blogItem.title}
        </div>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      skeletonType: 'badge',
      cell: (blogItem) => (
        <span
          className={`px-2 py-1 rounded text-xs font-medium ${
            blogItem.is_published
              ? 'bg-green-100 text-green-800'
              : 'bg-yellow-100 text-yellow-800'
          }`}
        >
          {blogItem.is_published ? 'Published' : 'Draft'}
        </span>
      ),
    },
    {
      key: 'author',
      header: 'Author',
      className: 'text-sm',
      skeletonType: 'text',
      cell: (blogItem) => getAuthorDisplay(blogItem),
    },
    {
      key: 'updatedAt',
      header: 'Updated At',
      className: 'text-sm',
      skeletonType: 'text',
      cell: (blogItem) =>
        new Date(blogItem.updatedAt).toLocaleDateString('en-GB', {
          day: '2-digit',
          month: 'numeric',
          year: 'numeric',
        }),
    },
    {
      key: 'updatedBy',
      header: 'Updated By',
      className: 'text-sm',
      skeletonType: 'text',
      cell: (blogItem) => getUpdatedByDisplay(blogItem),
    },
    {
      key: 'actions',
      header: 'Actions',
      skeletonType: 'actions',
      cell: (blogItem) => {
        const commentCount = commentsCountMap[blogItem.id] || 0;

        return (
          <div className="flex items-center gap-1.5">
            <Link
              href={`/blog/${blogItem.slug}`}
              className="text-black hover:text-gray-600 transition"
              title="View"
            >
              <FaEye size={15} />
            </Link>
            <Link
              href={`/dashboard/blog/${blogItem.id}/comments`}
              className="relative text-blue-500 hover:text-blue-400 transition inline-block"
              title={`View Comments (${commentCount})`}
            >
              <FaCommentDots size={17} />
              {commentCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold px-1.5 py-0.5 rounded-full min-w-[18px] text-center leading-none">
                  {commentCount > 99 ? '99+' : commentCount}
                </span>
              )}
              {commentsLoading && (
                <span className="absolute -top-2 -right-2 bg-gray-400 text-white text-xs px-1.5 py-0.5 rounded-full">
                  ...
                </span>
              )}
            </Link>
            <Link
              href={`/dashboard/blog/edit/${blogItem.id}`}
              className="text-yellow-500 hover:text-yellow-300 transition"
              title="Edit"
            >
              <FaPen size={15} />
            </Link>
            <button
              onClick={() => handleDelete(blogItem.id)}
              disabled={deleteMutation.isPending}
              className="text-red-500 hover:text-red-400 transition disabled:opacity-40"
              title="Delete"
            >
              <FaTrash size={15} />
            </button>
          </div>
        );
      },
    },
  ];

  return (
    <DashboardListTable
      title="Blogs"
      breadcrumbs={breadCrumb}
      headerActions={
        <Link
          href="/dashboard/blog/add"
          className="bg-gray-200 px-4 py-2 rounded-lg hover:bg-gray-500 flex items-center gap-2"
        >
          <FaPlus /> Add Blog
        </Link>
      }
      topContent={
        commentsError ? (
          <div className="mb-4 p-3 bg-yellow-100 border border-yellow-400 text-yellow-800 rounded">
            Warning: Could not load comment counts. {commentsError.message}
          </div>
        ) : null
      }
      data={blogs}
      columns={columns}
      rowKey={(blogItem) => blogItem.id}
      loading={isLoading || userLoading}
      error={error?.message || null}
      emptyMessage="No blogs found."
      pagination={{
        page,
        totalPages,
        onPrevious: () => setPage((prev) => Math.max(prev - 1, 1)),
        onNext: () => setPage((prev) => Math.min(prev + 1, totalPages)),
        previousLabel: '\u2190',
        nextLabel: '\u2192',
      }}
    />
  );
}
