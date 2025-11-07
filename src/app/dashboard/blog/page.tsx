'use client';

import React, { useEffect, useState } from 'react';
import { blog } from 'lib/blog';
import { IBlog } from 'lib/type';
import { FaPen, FaTrash, FaPlus } from 'react-icons/fa';
import Link from 'next/link';

export default function BlogDashboardPage() {
  const [blogs, setBlogs] = useState<IBlog[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchBlogs = async () => {
    try {
      setLoading(true);
      const res = await blog.getAll();
      setBlogs(res?.data || []);
    } catch (error) {
      console.error('Error fetching blogs:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this blog?')) return;
    try {
      await blog.delete(id);
      fetchBlogs();
    } catch (error) {
      console.error('Error deleting blog:', error);
    }
  };

  return (
    <>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-black">Manage Blogs</h1>
        <Link
          href="/dashboard/blog/add"
          className="bg-blue px-4 py-2 rounded-lg hover:bg-gray-400 flex items-center gap-2"
        >
          <FaPlus /> Add Blog
        </Link>
      </div>

      {loading ? (
        <p className="text-gray-400">Loading blogs...</p>
      ) : blogs.length === 0 ? (
        <p className="text-gray-400">No blogs found.</p>
      ) : (
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
                  <td className="p-3">{index + 1}</td>
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
                    <button
                      onClick={() => handleDelete(b.id)}
                      className="text-red-500 hover:text-red-400"
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
    </>
  );
}
