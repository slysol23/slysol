'use client';

import React from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { user } from 'lib/user';

// API call to create user
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
    formState: { errors, isValid },
  } = useForm<UserForm>({
    resolver: zodResolver(UserSchema),
  });

  const onSubmit = (data: UserForm) => {
    createUserMutation.mutate(data);
  };
  const createAuthorMutation = useMutation({
    mutationFn: async (data: UserForm) => {
      return await user.create(data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['authors'] });
      alert('✅ Author created successfully!');
      router.push('/dashboard/author');
    },
    onError: (err) => {
      console.error('Error creating author:', err);
      alert('❌ Author with this email already exist.');
    },
  });

  return (
    <div className="min-h-screen text-black">
      {/* Header */}
      <header className="border-b border-gray-200 py-6 text-black  px-6">
        <h1 className="text-3xl font-bold text-black">Add New User</h1>
      </header>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 py-10 px-6">
        {/* Name */}
        <div>
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
        <div>
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
        <div>
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
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            {...register('isAdmin')}
            className="w-4 h-4 accent-blue-500"
          />
          <label className="text-black">Is Admin?</label>
        </div>

        {/* Submit */}
        <div className="flex justify-between">
          {isValid && (
            <button
              type="submit"
              disabled={createAuthorMutation.isPending}
              className="px-6 py-3 rounded-lg border border-gray-300 hover:bg-gray-400 transition"
            >
              {createAuthorMutation.isPending ? 'Saving...' : 'Add Author'}
            </button>
          )}

          {/* <div className="flex justify-end"> */}
          <button
            type="button"
            onClick={() => router.push('/dashboard/author')}
            className="px-6 py-3 rounded-lg border border-gray-300 hover:bg-gray-400 transition"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
