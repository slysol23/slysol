'use client';

import React, { useEffect } from 'react';
import { IUser } from 'lib/type';
import { FaTrash, FaPlus, FaPen } from 'react-icons/fa';
import Link from 'next/link';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useUser } from '../../../providers/UserProvider';
import RoleProtected from '@/components/Role/RoleProtected';
import DashboardListTable from '@/components/dashboard/DashboardListTable';
import { BreadcrumbItem } from '@/components/breadCrum';
import { useSearchParams, useRouter } from 'next/navigation';
import { DashboardTableColumn } from 'types/dashboard';
import DashboardButton from '@/components/Button/DashboardButton';
import {
  confirmDashboardAction,
  showDashboardError,
  showDashboardSuccess,
} from '@/utils/dashboard-alert';

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

  useEffect(() => {
    const created = searchParams?.get('created');
    const updated = searchParams?.get('updated');
    const deleted = searchParams?.get('deleted');

    if (created === 'true') {
      void showDashboardSuccess('User created successfully!');
      router.replace('/dashboard/user', { scroll: false });
    }

    if (updated === 'true') {
      void showDashboardSuccess('User updated successfully!');
      router.replace('/dashboard/user', { scroll: false });
    }

    if (deleted === 'true') {
      void showDashboardSuccess('User deleted successfully!');
      router.replace('/dashboard/user', { scroll: false });
    }
  }, [searchParams, router]);

  const {
    data: users = [],
    isLoading,
    error,
  } = useQuery<IUser[], Error>({
    queryKey: ['users'],
    queryFn: fetchUsers,
  });

  const mutation = useMutation({
    mutationFn: deleteUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      void showDashboardSuccess('User deleted successfully!');
    },
    onError: (mutationError: any) =>
      void showDashboardError(
        'Failed to delete user: ' + (mutationError.message || 'Unknown error'),
      ),
  });

  const handleDelete = async (id: number) => {
    const confirmed = await confirmDashboardAction({
      title: 'Delete user?',
      text: 'Are you sure you want to delete this user?',
      confirmButtonText: 'Delete',
    });

    if (!confirmed) return;
    mutation.mutate(id);
  };

  const breadCrumb: BreadcrumbItem[] = [
    { label: 'Users', href: '/dashboard/user' },
  ];

  const columns: DashboardTableColumn<IUser>[] = [
    {
      key: 'index',
      header: '#',
      skeletonType: 'text',
      cell: (_, index) => index + 1,
    },
    {
      key: 'name',
      header: 'Name',
      skeletonType: 'text',
      cell: (userItem) => (
        <span className="font-semibold">{userItem.name}</span>
      ),
    },
    {
      key: 'email',
      header: 'Email',
      skeletonType: 'text',
      cell: (userItem) => userItem.email,
    },
    {
      key: 'admin',
      header: 'Admin',
      skeletonType: 'badge',
      cell: (userItem) => (
        <span className="font-semibold">{userItem.isAdmin ? 'Yes' : 'No'}</span>
      ),
    },
    {
      key: 'actions',
      header: 'Actions',
      headerClassName: 'text-center',
      className: 'text-center',
      skeletonType: 'actions',
      cell: (userItem) => (
        <div className="flex items-center justify-center gap-3">
          <Link
            href={`/dashboard/user/edit/${userItem.id}`}
            className="text-yellow-500 hover:text-yellow-300"
          >
            <FaPen />
          </Link>

          {isAdmin && (
            <button
              onClick={() => void handleDelete(Number(userItem.id))}
              className="text-red-500 hover:text-red-400"
            >
              <FaTrash />
            </button>
          )}
        </div>
      ),
    },
  ];

  return (
    <DashboardListTable
      title="Users"
      breadcrumbs={breadCrumb}
      headerActions={
        isAdmin ? (
          <DashboardButton href="/dashboard/user/add">User</DashboardButton>
        ) : null
      }
      data={users}
      columns={columns}
      rowKey={(userItem) => userItem.id}
      loading={isLoading}
      error={error?.message || null}
      emptyMessage="No users found."
    />
  );
};

export default function UsersDashboardPage() {
  return (
    <RoleProtected roles={['admin']}>
      <UsersDashboard />
    </RoleProtected>
  );
}
