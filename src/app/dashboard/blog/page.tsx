'use client';

import React, { useEffect, useState } from 'react';
import { blog, BlogApiResponse } from 'lib/blog';
import { IBlog } from 'lib/type';
import { FaPen, FaTrash, FaPlus } from 'react-icons/fa';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import Breadcrumb from '@/components/breadCrum';
import { BreadcrumbItem } from '@/components/breadCrum';

export default function BlogDashboardPage() {
  const [blogs, setBlogs] = useState<IBlog[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 10; // show 10 blogs per page

  const fetchBlogs = async (pageNumber: number) => {
    try {
      setLoading(true);
      const res: BlogApiResponse = await blog.getAll(pageNumber, limit);
      setBlogs(res.data || []);
      setTotalPages(res.totalPages || 1);
    } catch (error) {
      console.error('Error fetching blogs:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlogs(page);
  }, [page]);

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this blog?')) return;
    try {
      await blog.delete(id);
      fetchBlogs(page);
    } catch (error) {
      console.error('Error deleting blog:', error);
    }
  };
  const { data: session } = useSession();
  const isAdmin = Boolean((session?.user as any)?.isAdmin);
  const breadCrumb: BreadcrumbItem[] = [
    { label: 'Blogs', href: '/dashboard/blog' },
  ];
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

      {loading ? (
        <p className="text-gray-400">Loading blogs...</p>
      ) : blogs.length === 0 ? (
        <p className="text-gray-400">No blogs found.</p>
      ) : (
        <>
          <div className="overflow-x-auto">
            <table className="w-full text-left border border-gray-700 rounded-lg">
              <thead className="bg-black text-white">
                <tr>
                  <th className="p-3">#</th>
                  <th className="p-3">Title</th>
                  <th className="p-3">Author</th>
                  <th className="p-3">Created</th>
                  <th className="p-3 text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {blogs.map((b, index) => (
                  <tr
                    key={b.id}
                    className="border-t border-gray-700 hover:bg-gray-400 transition text-black"
                  >
                    <td className="p-3">{(page - 1) * limit + index + 1}</td>
                    <td className="p-3 font-semibold">{b.title}</td>
                    <td className="p-3">
                      {b.author
                        ? `${b.author.firstName} ${b.author.lastName}`
                        : `Author #${b.authorId}`}
                    </td>
                    <td className="p-3">
                      {new Date(b.createdAt).toLocaleDateString('en-GB')}
                    </td>
                    <td className="p-3 flex gap-3 justify-center">
                      <Link
                        href={`/dashboard/blog/edit/${b.id}`}
                        className="text-yellow-500 hover:text-yellow-300"
                      >
                        <FaPen />
                      </Link>
                      {isAdmin && (
                        <button
                          onClick={() => handleDelete(b.id)}
                          disabled={!isAdmin}
                          className="text-red-500 hover:text-red-400"
                        >
                          <FaTrash />
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination controls */}
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
