'use client';

import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { author } from 'lib/author';
import { FaPen, FaTrash, FaPlus } from 'react-icons/fa';
import Link from 'next/link';
import Breadcrumb, { BreadcrumbItem } from '@/components/breadCrum';
import axios from 'axios';

export default function AuthorDashboardPage() {
  const queryClient = useQueryClient();
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
  const deleteAuthor = useMutation({
    mutationFn: async (id: number) => {
      const res = await axios.delete(`/api/author/${id}`);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['authors'] });
      alert('Author deleted successfully!');
    },
    onError: (error: any) => {
      if (error.response?.status === 409) {
        const data = error.response.data;
        alert(
          `${data.message}\n\nThis author is associated with ${data.blogsCount} blog(s). Please remove the author from these blogs first.`,
        );
      } else {
        alert(
          'Failed to delete author: ' +
            (error.response?.data?.message || error.message),
        );
      }
    },
  });

  const handleDelete = (id: number) => {
    if (confirm('Are you sure you want to delete this author?')) {
      deleteAuthor.mutate(id);
    }
  };
  if (isLoading) {
    return (
      <div className="min-h-screen text-black flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
          <p className="text-xl">Loading...</p>
        </div>
      </div>
    );
  }
  if (isError)
    return (
      <p className="text-red-400">
        {(error as Error)?.message || 'Failed to load authors'}
      </p>
    );
  const breadCrumb: BreadcrumbItem[] = [
    { label: 'Authors', href: '/dashboard/author' },
  ];
  return (
    <>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-black">
          Authors
          <div className="mt-4">
            <Breadcrumb items={breadCrumb} />
          </div>
        </h1>
        <Link
          href="/dashboard/author/add"
          className="bg-gray-200 px-4 py-2 rounded-lg hover:bg-gray-500 flex items-center gap-2"
        >
          <FaPlus /> Add Author
        </Link>
      </div>

      {authors.length === 0 ? (
        <p className="text-gray-400">No authors found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left border border-gray-700 rounded-lg">
            <thead className="bg-blue text-white">
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
                  className="border-t border-gray-700 hover:bg-gray-400 transition text-black"
                >
                  <td className="p-3">{index + 1}</td>
                  <td className="p-3 font-semibold">
                    {a.firstName} {a.lastName}
                  </td>
                  <td className="p-3">{a.email}</td>
                  <td className="p-3">
                    {a.createdAt
                      ? new Date(a.createdAt).toLocaleDateString('en-GB', {
                          day: '2-digit',
                          month: 'numeric',
                          year: 'numeric',
                        })
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
                          deleteAuthor.mutate(a.id);
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
