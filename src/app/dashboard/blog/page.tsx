'use client';

import React, { useState } from 'react';
import { blog } from 'lib/blog';
import { BlogApiResponse, IBlog } from 'lib/type';
import { FaPen, FaTrash, FaPlus, FaEye } from 'react-icons/fa';
import Link from 'next/link';
import { useUser } from '../../../providers/UserProvider';
import Breadcrumb, { BreadcrumbItem } from '@/components/breadCrum';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import Image from 'next/image';
import axios from 'axios';

export default function BlogDashboardPage() {
  const queryClient = useQueryClient();
  const { user, isLoading: userLoading } = useUser();
  const [page, setPage] = useState(1);
  const limit = 10;

  // Fetch blogs
  const { data, isLoading, error } = useQuery<BlogApiResponse, Error>({
    queryKey: ['blogs', page],
    queryFn: () => blog.getAll(page, limit),
    staleTime: 1000 * 60,
    enabled: !!user,
  });

  const blogs: IBlog[] = data?.data ?? [];
  const totalPages: number = data?.totalPages ?? 1;

  // Delete mutation
  const deleteMutation = useMutation<void, Error, number>({
    mutationFn: (id) => axios.delete(`/api/blog/id/${id}`).then(() => {}),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['blogs'] }),
    onError: (err) => alert(err.message),
  });

  const handleDelete = (id: number) => {
    if (!confirm('Are you sure you want to delete this blog?')) return;
    deleteMutation.mutate(id);
  };

  // Helper function to display author name
  const getAuthorDisplay = (b: IBlog) => {
    if (Array.isArray(b.authors) && b.authors.length > 0) {
      return b.authors.map((a) => `${a.firstName} ${a.lastName}`).join(', ');
    }
    return 'No authors';
  };

  // Helper function to get createdBy display
  const getCreatedByDisplay = (b: IBlog) => {
    if (!b.createdBy) return '—';
    if (typeof b.createdBy === 'string') return b.createdBy;
    if (typeof b.createdBy === 'object' && b.createdBy.name)
      return b.createdBy.name;
    return '—';
  };

  // Helper function to get updatedBy display
  const getUpdatedByDisplay = (b: IBlog) => {
    if (!b.updatedBy) return '—';
    if (typeof b.updatedBy === 'string') return b.updatedBy;
    if (typeof b.updatedBy === 'object' && b.updatedBy.name)
      return b.updatedBy.name;
    return '—';
  };

  const breadCrumb: BreadcrumbItem[] = [
    { label: 'Blogs', href: '/dashboard/blog' },
  ];

  if (userLoading || isLoading) {
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
    return <p className="text-red-500">Error loading blogs: {error.message}</p>;
  }
  const normalizeImagePath = (
    imagePath: string | null | undefined,
  ): string | null => {
    if (!imagePath) return null;
    if (typeof imagePath !== 'string') return null;
    if (imagePath.startsWith('/')) return imagePath;
    if (!imagePath.startsWith('http')) {
      return `/uploads/${imagePath}`;
    }
    return imagePath;
  };

  return (
    <>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-black">
          Blogs
          <div className="mt-4">
            <Breadcrumb items={breadCrumb} />
          </div>
        </h1>
        <Link
          href="/dashboard/blog/add"
          className="bg-gray-200 px-4 py-2 rounded-lg hover:bg-gray-500 flex items-center gap-2"
        >
          <FaPlus /> Add Blog
        </Link>
      </div>

      {blogs.length === 0 ? (
        <p className="text-gray-400">No blogs found.</p>
      ) : (
        <>
          <div className="overflow-x-auto">
            <table className="w-full text-left border border-gray-700 rounded-lg">
              <thead className="bg-blue text-white">
                <tr>
                  <th className="p-3">Image</th>
                  <th className="p-3">Title</th>
                  <th className="p-3">Status</th>
                  <th className="p-3">Author</th>
                  <th className="p-3">Created At</th>
                  <th className="p-3">Updated At</th>
                  <th className="p-3">Created By</th>
                  <th className="p-3">Updated By</th>
                  <th className="p-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {blogs.map((b) => (
                  <tr
                    key={b.id}
                    className="border-t border-gray-700 hover:bg-gray-400 transition text-black"
                  >
                    <td className="p-3">
                      {b.image && typeof b.image === 'string' ? (
                        (() => {
                          const normalizedPath = normalizeImagePath(b.image);
                          return normalizedPath ? (
                            <div className="relative w-20 h-12 rounded-lg">
                              <Image
                                src={normalizedPath}
                                alt={b.title}
                                width={80}
                                height={48}
                                className="object-cover"
                              />
                            </div>
                          ) : (
                            <span className="text-gray-400 text-sm">
                              Invalid image
                            </span>
                          );
                        })()
                      ) : (
                        <span className="text-gray-400 text-sm">No image</span>
                      )}
                    </td>

                    <td
                      className="p-3 font-semibold max-w-xs truncate"
                      title={b.title}
                    >
                      {b.title}
                    </td>

                    <td className="p-3">
                      <span
                        className={`px-2 py-1 rounded text-xs font-medium ${
                          b.is_published
                            ? 'bg-green-100 text-green-800'
                            : 'bg-yellow-100 text-yellow-800'
                        }`}
                      >
                        {b.is_published ? 'Published' : 'Draft'}
                      </span>
                    </td>

                    <td className="p-3 text-sm">{getAuthorDisplay(b)}</td>

                    <td className="p-3 text-sm">
                      {new Date(b.createdAt).toLocaleDateString('en-GB', {
                        day: '2-digit',
                        month: 'short',
                        year: 'numeric',
                      })}
                    </td>

                    <td className="p-3 text-sm">
                      {new Date(b.updatedAt).toLocaleDateString('en-GB', {
                        day: '2-digit',
                        month: 'short',
                        year: 'numeric',
                      })}
                    </td>

                    <td className="p-3 text-sm">{getCreatedByDisplay(b)}</td>

                    <td className="p-3 text-sm">{getUpdatedByDisplay(b)}</td>

                    <td className="p-3">
                      <div className="flex gap-3">
                        <Link
                          href={`/dashboard/blog/edit/${b.id}`}
                          className="text-yellow-500 hover:text-yellow-300 transition"
                          title="Edit"
                        >
                          <FaPen />
                        </Link>
                        <button
                          onClick={() => handleDelete(b.id)}
                          disabled={deleteMutation.isPending}
                          className="text-red-500 hover:text-red-400 transition disabled:opacity-40"
                          title="Delete"
                        >
                          <FaTrash />
                        </button>
                        <Link
                          href={`/blog/${b.slug}`}
                          className="text-blue-500 hover:text-blue-400 transition"
                          title="View"
                        >
                          <FaEye />
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-4 mt-6">
              <button
                onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                disabled={page === 1}
                className="px-4 py-2 rounded-lg bg-gray-200 text-black hover:bg-gray-500 transition"
              >
                ←
              </button>
              <span className="text-gray-700 font-medium">
                Page {page} of {totalPages}
              </span>
              <button
                onClick={() =>
                  setPage((prev) => Math.min(prev + 1, totalPages))
                }
                disabled={page === totalPages}
                className="px-4 py-2 rounded-lg bg-gray-200 text-black disabled:opacity-40 hover:bg-gray-500 transition"
              >
                →
              </button>
            </div>
          )}
        </>
      )}
    </>
  );
}
