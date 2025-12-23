'use client';

import React from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { user } from 'lib/user';
import Breadcrumb, { BreadcrumbItem } from '@/components/breadCrum';

async function createUser(data: {
  name: string;
  email: string;
  password: string;
  isAdmin?: boolean;
}) {
  const res = await fetch('/api/user', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || 'Failed to create user');
  }

  return res.json();
}

// Validation schema
const UserSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  isAdmin: z.boolean().optional(),
});

type UserForm = z.infer<typeof UserSchema>;

export default function AddUserPage() {
  const router = useRouter();
  const queryClient = useQueryClient();

  const createUserMutation = useMutation({
    mutationFn: createUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      alert('✅ User created successfully!');
      router.push('/dashboard/user');
    },
    onError: (err: any) => {
      console.error('Error creating user:', err);
      alert(`❌ Failed to create user: ${err.message}`);
    },
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<UserForm>({
    resolver: zodResolver(UserSchema),
  });

  const onSubmit = (data: UserForm) => {
    createUserMutation.mutate(data);
  };

  const breadCrumb: BreadcrumbItem[] = [
    { label: 'Users', href: '/dashboard/user' },
    { label: 'Add User', href: '/dashboard/user/add' },
  ];

  return (
    <div className="min-h-screen text-black">
      {/* Header */}
      <header className="border-b border-gray-200 text-black">
        <h1 className="text-2xl font-bold text-black">Add New User</h1>
        <div className="pt-4">
          <Breadcrumb items={breadCrumb} />
        </div>
      </header>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="flex justify-end mt-4">
          <button
            type="submit"
            disabled={createUserMutation.isPending}
            className="px-6 py-3 rounded-lg border border-gray-300 hover:bg-gray-500 transition"
          >
            {createUserMutation.isPending ? 'Adding...' : 'Add User'}
          </button>
        </div>
        <div className="mt-4">
          <label className="block text-black font-medium mb-2">Name</label>
          <input
            type="text"
            {...register('name')}
            className="w-full p-3 rounded-lg  border border-gray-300 text-black"
            placeholder="Enter user name"
          />
          {errors.name && (
            <p className="text-red-400 text-sm mt-1">{errors.name.message}</p>
          )}
        </div>

        {/* Email */}
        <div className="mt-4">
          <label className="block text-black font-medium mb-2">Email</label>
          <input
            type="email"
            {...register('email')}
            className="w-full p-3 rounded-lg border border-gray-300 text-black"
            placeholder="Enter user email"
          />
          {errors.email && (
            <p className="text-red-400 text-sm mt-1">{errors.email.message}</p>
          )}
        </div>

        {/* Password */}
        <div className="mt-4">
          <label className="block text-black font-medium mb-2">Password</label>
          <input
            type="password"
            {...register('password')}
            className="w-full p-3 rounded-lg border border-gray-300 text-black"
            placeholder="Enter password"
          />
          {errors.password && (
            <p className="text-red-400 text-sm mt-1">
              {errors.password.message}
            </p>
          )}
        </div>

        {/* Is Admin */}
        <div className="flex flex-col gap-1 mt-4">
          <label className="text-black font-medium">Is Admin?</label>

          <select
            className="w-full border border-gray-300 rounded-lg p-2 text-black"
            onChange={(e) => setValue('isAdmin', e.target.value === 'yes')}
          >
            <option value="no">No</option>
            <option value="yes">Yes</option>
          </select>
        </div>
      </form>
    </div>
  );
}
