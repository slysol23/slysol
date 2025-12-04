'use client';

import React from 'react';
import { IUser } from 'lib/type';
import { FaTrash, FaPlus, FaPen } from 'react-icons/fa';
import Link from 'next/link';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useUser } from '../../../providers/UserProvider';
import RoleProtected from '@/components/Role/RoleProtected';
import Breadcrumb, { BreadcrumbItem } from '@/components/breadCrum';

const fetchUsers = async (): Promise<IUser[]> => {
  const res = await fetch('/api/user', { cache: 'no-store' });
  if (!res.ok) throw new Error('Failed to fetch users');
  const data = await res.json();
  return data.data;
};

const deleteUser = async (id: number) => {
  const res = await fetch(`/api/user/${id}`, { method: 'DELETE' });
  if (!res.ok) throw new Error('Failed to delete user');
};

const UsersDashboard = () => {
  const queryClient = useQueryClient();
  const { isAdmin } = useUser();

  const { data: users = [], isLoading } = useQuery<IUser[], Error>({
    queryKey: ['users'],
    queryFn: fetchUsers,
  });

  const mutation = useMutation({
    mutationFn: deleteUser,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['users'] }),
  });

  const handleDelete = (id: number) => {
    if (!confirm('Are you sure you want to delete this user?')) return;
    mutation.mutate(id);
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

  const breadCrumb: BreadcrumbItem[] = [
    { label: 'Users', href: '/dashboard/user' },
  ];

  return (
    <>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-black">
          Users
          <div className="mt-4">
            <Breadcrumb items={breadCrumb} />
          </div>
        </h1>
        {isAdmin && (
          <Link
            href="/dashboard/user/add"
            className="bg-gray-200 px-4 py-2 rounded-lg text-black hover:bg-gray-400 flex items-center gap-2"
          >
            <FaPlus /> Add User
          </Link>
        )}
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left text-gray-300 border border-gray-700 rounded-lg">
          <thead className="bg-blue text-white">
            <tr>
              <th className="p-3">#</th>
              <th className="p-3">Name</th>
              <th className="p-3">Email</th>
              <th className="p-3">Admin</th>
              <th className="p-3 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u, index) => (
              <tr
                key={u.id}
                className="border-t border-gray-700 text-black hover:bg-gray-400 transition"
              >
                <td className="p-3">{index + 1}</td>
                <td className="p-3 font-semibold">{u.name}</td>
                <td className="p-3">{u.email}</td>
                <td className="p-3 font-semibold">
                  {u.isAdmin ? 'Yes' : 'No'}
                </td>
                <td className="p-3 flex gap-3 justify-center">
                  <Link
                    href={`/dashboard/user/edit/${u.id}`}
                    className="text-yellow-500 hover:text-yellow-300"
                  >
                    <FaPen />
                  </Link>

                  {isAdmin && (
                    <button
                      onClick={() => handleDelete(Number(u.id))}
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
    </>
  );
};

export default function UsersDashboardPage() {
  return (
    <RoleProtected roles={['admin']}>
      <UsersDashboard />
    </RoleProtected>
  );
}
