'use client';

import React from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { user } from 'lib/user';
import Breadcrumb, { BreadcrumbItem } from '@/components/breadCrum';

// Validation schema
const UserSchema = z.object({
  username: z.string().min(2, 'Username must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  isAdmin: z.enum(['yes', 'no']),
});

type UserForm = z.infer<typeof UserSchema>;

export default function EditUserPage() {
  const router = useRouter();
  const params = useParams();
  const queryClient = useQueryClient();
  const id = Number(params.id);

  // Fetch user
  const {
    data: u,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ['user', id],
    queryFn: async () => {
      const res = await user.getById(id);
      return res?.data;
    },
    enabled: !isNaN(id),
  });

  // Update user mutation
  const updateUserMutation = useMutation({
    mutationFn: async (data: Partial<UserForm>) => {
      // Convert isAdmin to boolean for backend
      const payload = { ...data, isAdmin: data.isAdmin === 'yes' };
      return await user.update(id, payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      alert('✅ User updated successfully!');
      router.push('/dashboard/user');
    },
    onError: (err) => {
      console.error('Error updating user:', err);
      alert('❌ Failed to update user.');
    },
  });

  // Form setup
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<UserForm>({
    resolver: zodResolver(UserSchema),
  });

  // Populate form with existing data
  React.useEffect(() => {
    if (u) {
      reset({
        username: u.name || '',
        email: u.email || '',
        password: '',
        isAdmin: u.isAdmin ? 'yes' : 'no',
      });
    }
  }, [u, reset]);

  const onSubmit = (data: UserForm) => {
    updateUserMutation.mutate(data);
  };

  if (isLoading)
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-600">
        Loading user...
      </div>
    );
  if (isError)
    return (
      <div className="min-h-screen flex items-center justify-center text-red-600">
        {(error as Error)?.message || 'Failed to load user'}
      </div>
    );
  const breadCrumb: BreadcrumbItem[] = [
    { label: 'Users', href: '/dashboard/user' },
    { label: 'Edit User', href: `/dashboard/user/edit/${id}` },
  ];
  return (
    <div className="min-h-screen text-black p-8">
      <h1 className="text-2xl font-bold mb-6">Edit User</h1>
      <Breadcrumb items={breadCrumb} />

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Username */}
        <div>
          <label className="block text-black mb-2 font-medium">Username</label>
          <input
            type="text"
            {...register('username')}
            className="w-full p-3 rounded-lg border border-gray-300 text-black focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter username"
          />
          {errors.username && (
            <p className="text-red-500 text-sm mt-1">
              {errors.username.message}
            </p>
          )}
        </div>

        {/* Email */}
        <div>
          <label className="block text-black mb-2 font-medium">Email</label>
          <input
            type="email"
            {...register('email')}
            className="w-full p-3 rounded-lg border border-gray-300 text-black focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter user email"
          />
          {errors.email && (
            <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
          )}
        </div>

        {/* Password */}
        <div>
          <label className="block text-black mb-2 font-medium">Password</label>
          <input
            type="password"
            {...register('password')}
            className="w-full p-3 rounded-lg border border-gray-300 text-black focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter new password"
          />
          {errors.password && (
            <p className="text-red-500 text-sm mt-1">
              {errors.password.message}
            </p>
          )}
        </div>

        {/* Is Admin */}
        <div>
          <label className="block text-black mb-2 font-medium">Is Admin</label>
          <select
            {...register('isAdmin')}
            className="w-full p-3 rounded-lg border border-gray-300 text-black focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="no">No</option>
            <option value="yes">Yes</option>
          </select>
          {errors.isAdmin && (
            <p className="text-red-500 text-sm mt-1">
              {errors.isAdmin.message}
            </p>
          )}
        </div>

        {/* Buttons */}
        <div className="flex justify-end gap-4">
          <button
            type="button"
            onClick={() => router.push('/dashboard/user')}
            className="px-6 py-3 rounded-lg border bg-red-500 hover:bg-red-700 transition"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={updateUserMutation.isPending}
            className="px-6 py-3 rounded-lg border border-gray-300 hover:bg-gray-400 transition"
          >
            {updateUserMutation.isPending ? 'Saving...' : 'Update User'}
          </button>
        </div>
      </form>
    </div>
  );
}
