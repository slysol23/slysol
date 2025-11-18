'use client';

import React, { useState } from 'react';
import { blog } from 'lib/blog';
import { BlogApiResponse, IBlog } from 'lib/type';
import { FaPen, FaTrash, FaPlus, FaEye } from 'react-icons/fa';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import Breadcrumb, { BreadcrumbItem } from '@/components/breadCrum';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

export default function BlogDashboardPage() {
  const queryClient = useQueryClient();
  const { data: session } = useSession();
  const isAdmin = Boolean((session?.user as any)?.isAdmin);

  const [page, setPage] = useState(1);
  const limit = 10;

  // Fetch blogs with proper types
  const { data, isLoading, error } = useQuery<BlogApiResponse, Error>({
    queryKey: ['blogs', page],
    queryFn: () => blog.getAll(page, limit),
    staleTime: 1000 * 60,
  });

  const blogs: IBlog[] = data?.data ?? [];
  const totalPages: number = data?.totalPages ?? 1;

  // Delete mutation
  const deleteMutation = useMutation<void, Error, number>({
    mutationFn: (id) => blog.delete(id).then(() => {}),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['blogs'] }),
  });

  const handleDelete = (id: number) => {
    if (!confirm('Are you sure you want to delete this blog?')) return;
    deleteMutation.mutate(id);
  };

  const breadCrumb: BreadcrumbItem[] = [
    { label: 'Blogs', href: '/dashboard/blog' },
  ];

  if (isLoading) return <p className="text-gray-400">Loading blogs...</p>;
  if (error) return <p className="text-red-500">Error loading blogs.</p>;

  return (
    <>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-black">
          Blogs
          <Breadcrumb items={breadCrumb} />
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
              <thead className="bg-black text-white">
                <tr>
                  <th className="p-3">Image</th>
                  <th className="p-3">Title</th>
                  <th className="p-3">Author</th>
                  <th className="p-3">Created At</th>
                  <th className="p-3">Updated At</th>
                  {/* <th className="p-3">Status</th> */}
                  <th className="p-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {blogs.map((b: IBlog) => (
                  <tr
                    key={b.id}
                    className="border-t border-gray-700 hover:bg-gray-400 transition text-black"
                  >
                    <td className="p-3">
                      {b.image ? (
                        <img
                          src={b.image}
                          alt={b.title}
                          className="w-20 h-12 object-cover rounded-lg"
                        />
                      ) : (
                        <span className="text-gray-400">No image</span>
                      )}
                    </td>

                    <td className="p-3 font-semibold">{b.title}</td>
                    <td className="p-3">
                      {b.author
                        ? `${b.author.firstName} ${b.author.lastName}`
                        : `Author #${b.authorId}`}
                    </td>
                    <td className="p-3">
                      {new Date(b.createdAt).toLocaleDateString('en-GB')}
                    </td>
                    <td className="p-3">
                      {new Date(b.updatedAt).toLocaleDateString('en-GB')}
                    </td>
                    {/* <td className="p-3 capitalize">{b.status}</td> */}
                    <td className="p-3 flex gap-3">
                      {/* Edit */}
                      <Link
                        href={`/dashboard/blog/edit/${b.id}`}
                        className="text-yellow-500 hover:text-yellow-300"
                      >
                        <FaPen />
                      </Link>

                      {/* Delete */}
                      {isAdmin && (
                        <button
                          onClick={() => handleDelete(b.id)}
                          disabled={!isAdmin || deleteMutation.isPending}
                          className="text-red-500 hover:text-red-400"
                        >
                          <FaTrash />
                        </button>
                      )}

                      {/* View */}
                      <Link
                        href={`/blog/${b.slug}`} // dynamic route using slug
                        className="text-blue-500 hover:text-blue-400"
                      >
                        <FaEye />
                      </Link>
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
                className="px-4 py-2 rounded-lg bg-gray-700 text-white disabled:opacity-40 hover:bg-gray-600"
              >
                ←
              </button>

              <span className="text-gray-700">
                Page {page} of {totalPages}
              </span>

              <button
                onClick={() =>
                  setPage((prev) => Math.min(prev + 1, totalPages))
                }
                disabled={page === totalPages}
                className="px-4 py-2 rounded-lg bg-gray-700 text-white disabled:opacity-40 hover:bg-gray-600"
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
