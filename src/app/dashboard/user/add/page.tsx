'use client';

import React from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useMutation, useQueryClient } from '@tanstack/react-query';

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
    formState: { errors },
  } = useForm<UserForm>({
    resolver: zodResolver(UserSchema),
  });

  const onSubmit = (data: UserForm) => {
    createUserMutation.mutate(data);
  };

  return (
    <div className="max-w-3xl mx-auto bg-gray-900 p-8 rounded-2xl shadow-lg border border-gray-800">
      <h1 className="text-2xl font-bold text-white mb-6">Add New User</h1>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Name */}
        <div>
          <label className="block text-gray-300 mb-2">Name</label>
          <input
            type="text"
            {...register('name')}
            className="w-full p-3 rounded-lg bg-gray-800 border border-gray-700 text-white"
            placeholder="Enter user name"
          />
          {errors.name && (
            <p className="text-red-400 text-sm mt-1">{errors.name.message}</p>
          )}
        </div>

        {/* Email */}
        <div>
          <label className="block text-gray-300 mb-2">Email</label>
          <input
            type="email"
            {...register('email')}
            className="w-full p-3 rounded-lg bg-gray-800 border border-gray-700 text-white"
            placeholder="Enter user email"
          />
          {errors.email && (
            <p className="text-red-400 text-sm mt-1">{errors.email.message}</p>
          )}
        </div>

        {/* Password */}
        <div>
          <label className="block text-gray-300 mb-2">Password</label>
          <input
            type="password"
            {...register('password')}
            className="w-full p-3 rounded-lg bg-gray-800 border border-gray-700 text-white"
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
          <label className="text-gray-300">Is Admin?</label>
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={createUserMutation.isPending}
          className="bg-[#455bb5] hover:bg-[#3a4b99] text-white font-semibold px-6 py-3 rounded-lg transition"
        >
          {createUserMutation.isPending ? 'Saving...' : 'Add User'}
        </button>
      </form>
    </div>
  );
}
