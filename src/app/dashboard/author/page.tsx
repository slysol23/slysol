'use client';

import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { author } from 'lib/author';
import { FaPen, FaTrash, FaPlus } from 'react-icons/fa';
import Link from 'next/link';

export default function AuthorDashboardPage() {
  const queryClient = useQueryClient();

  //  Fetch all
  const {
    data: authors = [],
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ['authors'],
    queryFn: async () => {
      const res = await author.getAll();
      return res?.data || [];
    },
  });

  // Mutation for deleting author
  const deleteMutation = useMutation({
    mutationFn: async (id: number) => await author.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['authors'] });
      alert('🗑 Author deleted successfully!');
    },
    onError: (err) => {
      console.error('Error deleting author:', err);
      alert('❌ Failed to delete author.');
    },
  });

  if (isLoading) return <p className="text-gray-400">Loading authors...</p>;
  if (isError)
    return (
      <p className="text-red-400">
        {(error as Error)?.message || 'Failed to load authors'}
      </p>
    );

  return (
    <>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-black">Manage Authors</h1>
        <Link
          href="/dashboard/author/add"
          className="bg-blue px-4 py-2 rounded-lg hover:bg-gray-400 flex items-center gap-2"
        >
          <FaPlus /> Add Author
        </Link>
      </div>

      {authors.length === 0 ? (
        <p className="text-gray-400">No authors found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left border border-gray-700 rounded-lg">
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
              {authors.map((a: any, index: number) => (
                <tr
                  key={a.id}
                  className="border-t border-gray-700 hover:bg-gray-400 transition text-black"
                >
                  <td className="p-3">{index + 1}</td>
                  <td className="p-3 font-semibold">
                    {a.firstName} {a.lastName}
                  </td>
                  <td className="p-3">{a.email}</td>
                  <td className="p-3">
                    {a.createdAt
                      ? new Date(a.createdAt).toLocaleDateString('en-GB')
                      : '-'}
                  </td>
                  <td className="p-3 flex gap-3 justify-center">
                    <Link
                      href={`/dashboard/author/edit/${a.id}`}
                      className="text-yellow-500 hover:text-yellow-300"
                    >
                      <FaPen />
                    </Link>
                    <button
                      onClick={() => {
                        if (
                          confirm(
                            'Are you sure you want to delete this author?',
                          )
                        )
                          deleteMutation.mutate(a.id);
                      }}
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
