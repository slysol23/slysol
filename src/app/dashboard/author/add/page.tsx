'use client';

import React from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { author } from 'lib/author';
import { useRouter } from 'next/navigation';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import Breadcrumb, { BreadcrumbItem } from '@/components/breadCrum';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const AuthorSchema = z.object({
  firstName: z.string().min(2, 'First name must be at least 2 characters'),
  lastName: z.string().min(2, 'Last name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
});

type AuthorForm = z.infer<typeof AuthorSchema>;

export default function AddAuthorPage() {
  const router = useRouter();
  const queryClient = useQueryClient();

  const createAuthor = useMutation({
    mutationFn: async (data: AuthorForm) => {
      return await author.create(data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['authors'] });
      router.push('/dashboard/author?created=true');
    },
    onError: () => {
      toast.error('Failed to create author', { autoClose: 3000 });
    },
  });
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<AuthorForm>({
    resolver: zodResolver(AuthorSchema),
    mode: 'onChange',
  });

  const onSubmit = (data: AuthorForm) => {
    createAuthor.mutate(data);
  };

  const breadCrumbItems: BreadcrumbItem[] = [
    { label: 'Auhtors', href: '/dashboard/author' },
    { label: 'Add Author', href: '/dashboard/author/add' },
  ];
  return (
    <div className="min-h-screen text-black">
      <header className="border-b border-gray-200">
        <h1 className="text-2xl font-bold">Add New Author</h1>
        <div className="mt-4">
          <Breadcrumb items={breadCrumbItems} />
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow py-4">
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="flex justify-end mt-4">
            <button
              type="submit"
              disabled={createAuthor.isPending}
              className="px-6 py-3 rounded-lg border border-gray-300 hover:bg-gray-400 transition"
            >
              {createAuthor.isPending ? 'Saving...' : 'Add Author'}
            </button>
          </div>
          <div>
            <label className="block text-black font-medium mb-2">
              First Name
            </label>
            <input
              type="text"
              {...register('firstName')}
              className="w-full p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter first name"
            />
            {errors.firstName && (
              <p className="text-red-500 text-sm mt-1">
                {errors.firstName.message}
              </p>
            )}
          </div>

          <div className="mt-4">
            <label className="block text-black font-medium mb-2">
              Last Name
            </label>
            <input
              type="text"
              {...register('lastName')}
              className="w-full p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter last name"
            />
            {errors.lastName && (
              <p className="text-red-500 text-sm mt-1">
                {errors.lastName.message}
              </p>
            )}
          </div>

          <div className="mt-4">
            <label className="block text-black font-medium mb-2">Email</label>
            <input
              type="email"
              {...register('email')}
              className="w-full p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter author email"
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">
                {errors.email.message}
              </p>
            )}
          </div>
        </form>
      </main>
    </div>
  );
}
