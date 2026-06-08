'use client';

import React, { useState, useEffect } from 'react';
import { blog } from 'lib/blog';
import { comments } from 'lib/comments';
import { BlogApiResponse, IBlog } from 'lib/type';
import { FaPen, FaTrash, FaEye, FaCommentDots } from 'react-icons/fa';
import { MdPublicOff, MdPublish } from 'react-icons/md';
import Link from 'next/link';
import { useUser } from '../../../providers/UserProvider';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { useSearchParams, useRouter } from 'next/navigation';
import { BreadcrumbItem } from '@/components/breadCrum';
import DashboardListTable from '@/components/dashboard/DashboardListTable';
import { getBlogImageSrc } from 'lib/blog/image';
import { DashboardTableColumn } from 'types/dashboard';
import DashboardButton from '@/components/Button/DashboardButton';
import Image from 'next/image';
import {
  confirmDashboardAction,
  showDashboardError,
  showDashboardSuccess,
} from '@/utils/dashboard-alert';

export default function BlogDashboardPage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    const updated = searchParams?.get('updated');
    const published = searchParams?.get('published');
    const deleted = searchParams?.get('deleted');
    const created = searchParams?.get('created');

    if (created === 'true') {
      void showDashboardSuccess('Blog created successfully!');
      router.replace('/dashboard/blog', { scroll: false });
    }
    if (updated === 'true') {
      void showDashboardSuccess('Blog updated successfully!');
      router.replace('/dashboard/blog', { scroll: false });
    }
    if (published === 'true') {
      void showDashboardSuccess('Blog published successfully!');
      router.replace('/dashboard/blog', { scroll: false });
    }
    if (published === 'false') {
      void showDashboardSuccess('Blog unpublished successfully!');
      router.replace('/dashboard/blog', { scroll: false });
    }
    if (deleted === 'true') {
      void showDashboardSuccess('Blog deleted successfully!');
      router.replace('/dashboard/blog', { scroll: false });
    }
  }, [searchParams, router]);

  const queryClient = useQueryClient();
  const { user } = useUser();
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
  const { data: commentsData, isLoading: commentsLoading } = useQuery<
    { blogId: number; count: number }[],
    Error
  >({
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
      void showDashboardError(
        `Failed to delete blog: ${mutationError.message}`,
      );
    },
  });

  const publishMutation = useMutation<
    void,
    Error,
    { id: number; nextPublished: boolean }
  >({
    mutationFn: ({ id, nextPublished }) =>
      blog.publish(id, nextPublished).then(() => {}),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['blogs'] });
      router.push(`/dashboard/blog?published=${variables.nextPublished}`);
    },
    onError: (mutationError) => {
      void showDashboardError(
        `Failed to update publish status: ${mutationError.message}`,
      );
    },
  });

  const handleDelete = async (id: number) => {
    const confirmed = await confirmDashboardAction({
      title: 'Delete blog?',
      text: 'Are you sure you want to delete this blog?',
    });

    if (!confirmed) return;
    deleteMutation.mutate(id);
  };

  const handleTogglePublish = async (id: number, currentStatus: boolean) => {
    const action = currentStatus ? 'unpublish' : 'publish';
    const confirmed = await confirmDashboardAction({
      title: `${action.charAt(0).toUpperCase() + action.slice(1)} blog?`,
      text: `Are you sure you want to ${action} this blog?`,
      confirmButtonText: action === 'publish' ? 'Publish' : 'Unpublish',
    });

    if (!confirmed) return;

    publishMutation.mutate({
      id,
      nextPublished: !currentStatus,
    });
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
      cell: (blogItem) => {
        const imageSrc = getBlogImageSrc(blogItem.image);
        return imageSrc ? (
          <Image
            height={200}
            width={200}
            unoptimized
            src={imageSrc}
            alt={blogItem.title}
            className="w-20 h-12 object-cover rounded-lg"
            loading="lazy"
            decoding="async"
          />
        ) : (
          <span className="text-gray-400 text-sm">No image</span>
        );
      },
    },
    {
      key: 'title',
      header: 'Title',
      className: 'min-w-[180px] max-w-[180px] text-xs sm:text-sm font-semibold',
      skeletonType: 'text',
      cell: (blogItem) => (
        <div className="truncate" title={blogItem.title}>
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
      className: 'text-xs sm:text-sm whitespace-nowrap',
      skeletonType: 'text',
      cell: (blogItem) => getAuthorDisplay(blogItem),
    },
    {
      key: 'updatedAt',
      header: 'Updated At',
      className: 'text-xs sm:text-sm whitespace-nowrap',
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
      className: 'text-xs sm:text-sm whitespace-nowrap',
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
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold px-1.5 py-0.5 rounded-full min-w-4.5 text-center leading-none">
                  {commentCount > 99 ? '99+' : commentCount}
                </span>
              )}
              {commentsLoading && (
                <span className="absolute -top-2 -right-2 bg-gray-400 text-white text-xs px-1.5 py-0.5 rounded-full">
                  ...
                </span>
              )}
            </Link>
            <button
              onClick={() =>
                void handleTogglePublish(blogItem.id, blogItem.is_published)
              }
              disabled={publishMutation.isPending}
              className={`transition-colors disabled:opacity-40 ${
                blogItem.is_published
                  ? 'text-orange-500 hover:text-orange-700'
                  : 'text-green-500 hover:text-green-700'
              }`}
              title={blogItem.is_published ? 'Unpublish' : 'Publish'}
            >
              {blogItem.is_published ? (
                <MdPublicOff size={16} />
              ) : (
                <MdPublish size={16} />
              )}
            </button>
            <Link
              href={`/dashboard/blog/edit/${blogItem.id}`}
              className="text-yellow-500 hover:text-yellow-300 transition"
              title="Edit"
            >
              <FaPen size={15} />
            </Link>
            <button
              onClick={() => void handleDelete(blogItem.id)}
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
        <DashboardButton href="/dashboard/blog/add">Blog</DashboardButton>
      }
      data={blogs}
      columns={columns}
      rowKey={(blog) => blog.id}
      loading={isLoading}
      error={error?.message || null}
      emptyMessage="No blogs found."
      pagination={{
        page,
        totalPages,
        onPrevious: () => setPage((prev) => Math.max(prev - 1, 1)),
        onNext: () => setPage((prev) => Math.min(prev + 1, totalPages)),
      }}
    />
  );
}
