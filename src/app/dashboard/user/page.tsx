'use client';

import React, { useEffect } from 'react';
import { IUser } from 'lib/type';
import { FaTrash, FaPlus, FaPen } from 'react-icons/fa';
import Link from 'next/link';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useUser } from '../../../providers/UserProvider';
import RoleProtected from '@/components/Role/RoleProtected';
import Breadcrumb, { BreadcrumbItem } from '@/components/breadCrum';
import { toast } from 'react-toastify';
import { useSearchParams, useRouter } from 'next/navigation';

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
  const searchParams = useSearchParams();
  const router = useRouter();

  // Show toast based on query params (for create/update/delete)
  useEffect(() => {
    const created = searchParams.get('created');
    const updated = searchParams.get('updated');
    const deleted = searchParams.get('deleted');

    if (created === 'true') {
      toast.success('User created successfully!', {
        autoClose: 3000,
        position: 'bottom-right',
      });
      router.replace('/dashboard/user', { scroll: false });
    }

    if (updated === 'true') {
      toast.success('User updated successfully!', {
        autoClose: 3000,
        position: 'bottom-right',
      });
      router.replace('/dashboard/user', { scroll: false });
    }

    if (deleted === 'true') {
      toast.success('User deleted successfully!', {
        autoClose: 3000,
        position: 'bottom-right',
      });
      router.replace('/dashboard/user', { scroll: false });
    }
  }, [searchParams, router]);

  const { data: users = [], isLoading } = useQuery<IUser[], Error>({
    queryKey: ['users'],
    queryFn: fetchUsers,
  });

  const mutation = useMutation({
    mutationFn: deleteUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      toast.success('User deleted successfully!', {
        autoClose: 3000,
        position: 'bottom-right',
      });
    },
    onError: (error: any) =>
      toast.error(
        'Failed to delete user: ' + (error.message || 'Unknown error'),
        {
          autoClose: 3000,
          position: 'bottom-right',
        },
      ),
  });

  const handleDelete = (id: number) => {
    if (!confirm('Are you sure you want to delete this user?')) return;
    mutation.mutate(id);
  };

  // Skeleton loader
  if (isLoading) {
    return (
      <div className="overflow-x-auto animate-pulse space-y-2 p-3">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="h-12 bg-gray-200 rounded w-full"></div>
        ))}
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

      {users.length === 0 ? (
        <p className="text-gray-400">No users found.</p>
      ) : (
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
      )}
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
