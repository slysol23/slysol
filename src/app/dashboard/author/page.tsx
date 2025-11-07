'use client';

import React, { useEffect, useState } from 'react';
import DashboardLayout from '../page';
import { author } from 'lib/author';
import { IAuthor } from 'lib/type';
import { FaPen, FaTrash, FaPlus } from 'react-icons/fa';
import Link from 'next/link';

export default function AuthorsDashboardPage() {
  const [authors, setAuthors] = useState<IAuthor[]>([]);
  const [loading, setLoading] = useState(true);

  // ✅ Fetch authors from backend
  const fetchAuthors = async () => {
    try {
      setLoading(true);
      const res = await author.getAll(); // assumes author API returns { data: IAuthor[] }
      setAuthors(res?.data || []);
    } catch (error) {
      console.error('Error fetching authors:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAuthors();
  }, []);

  // 🗑 Delete author
  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this author?')) return;
    try {
      await author.delete(id);
      fetchAuthors(); // refresh list
    } catch (error) {
      console.error('Error deleting author:', error);
    }
  };

  return (
    <DashboardLayout>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-black">Manage Authors</h1>
        <Link
          href="/dashboard/authors/add"
          className="bg-blue px-4 py-2 rounded-lg hover:bg-gray-400 flex items-center gap-2"
        >
          <FaPlus /> Add Author
        </Link>
      </div>

      {loading ? (
        <p className="text-gray-400">Loading authors...</p>
      ) : authors.length === 0 ? (
        <p className="text-gray-400">No authors found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-gray-300 border border-gray-700 rounded-lg">
            <thead className="bg-black text-white">
              <tr>
                <th className="p-3">#</th>
                <th className="p-3">Name</th>
                <th className="p-3">Email</th>
                <th className="p-3">Created</th>
                <th className="p-3 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {authors.map((a, index) => (
                <tr
                  key={a.id}
                  className="border-t border-gray-700 hover:bg-gray-400 text-black transition"
                >
                  <td className="p-3">{index + 1}</td>
                  <td className="p-3 font-semibold">{`${a.firstName} ${a.lastName}`}</td>
                  <td className="p-3">{a.email}</td>
                  <td className="p-3">
                    {new Date(a.createdAt).toLocaleDateString('en-GB')}
                  </td>
                  <td className="p-3 flex gap-3 justify-center">
                    <Link
                      href={`/dashboard/authors/edit/${a.id}`}
                      className="text-yellow-400 hover:text-yellow-300"
                    >
                      <FaPen />
                    </Link>
                    <button
                      onClick={() => handleDelete(a.id)}
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
    </DashboardLayout>
  );
}
