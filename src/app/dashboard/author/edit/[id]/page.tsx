'use client';

import React from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { author } from 'lib/author';

const AuthorSchema = z.object({
  firstName: z.string().min(2, 'First name must be at least 2 characters'),
  lastName: z.string().min(2, 'Last name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
});

type AuthorForm = z.infer<typeof AuthorSchema>;

export default function EditAuthorPage() {
  const router = useRouter();
  const params = useParams();
  const queryClient = useQueryClient();
  const id = Number(params.id);

  const {
    data: a,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ['author', id],
    queryFn: async () => {
      const res = await author.getById(id);
      return res?.data;
    },
    enabled: !isNaN(id),
  });

  const updateAuthorMutation = useMutation({
    mutationFn: async (data: AuthorForm) => {
      return await author.update(id, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['authors'] });
      alert('✅ Author updated successfully!');
      router.push('/dashboard/author');
    },
    onError: (err) => {
      console.error('Error updating author:', err);
      alert('❌ Failed to update author.');
    },
  });

  //Hook form
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<AuthorForm>({
    resolver: zodResolver(AuthorSchema),
  });

  React.useEffect(() => {
    if (a) {
      reset({
        firstName: a.firstName || '',
        lastName: a.lastName || '',
        email: a.email || '',
      });
    }
  }, [a, reset]);

  const onSubmit = (data: AuthorForm) => {
    updateAuthorMutation.mutate(data);
  };

  if (isLoading) return <p className="text-gray-400">Loading author...</p>;
  if (isError)
    return (
      <p className="text-red-400">
        {(error as Error)?.message || 'Failed to load author'}
      </p>
    );

  return (
    <div className="max-w-3xl mx-auto bg-gray-900 p-8 rounded-2xl shadow-lg border border-gray-800">
      <h1 className="text-2xl font-bold text-white mb-6">Edit Author</h1>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div>
          <label className="block text-gray-300 mb-2">First Name</label>
          <input
            type="text"
            {...register('firstName')}
            className="w-full p-3 rounded-lg bg-gray-800 border border-gray-700 text-white"
            placeholder="Enter first name"
          />
          {errors.firstName && (
            <p className="text-red-400 text-sm mt-1">
              {errors.firstName.message}
            </p>
          )}
        </div>

        <div>
          <label className="block text-gray-300 mb-2">Last Name</label>
          <input
            type="text"
            {...register('lastName')}
            className="w-full p-3 rounded-lg bg-gray-800 border border-gray-700 text-white"
            placeholder="Enter last name"
          />
          {errors.lastName && (
            <p className="text-red-400 text-sm mt-1">
              {errors.lastName.message}
            </p>
          )}
        </div>

        <div>
          <label className="block text-gray-300 mb-2">Email</label>
          <input
            type="email"
            {...register('email')}
            className="w-full p-3 rounded-lg bg-gray-800 border border-gray-700 text-white"
            placeholder="Enter author email"
          />
          {errors.email && (
            <p className="text-red-400 text-sm mt-1">{errors.email.message}</p>
          )}
        </div>

        <button
          type="submit"
          disabled={updateAuthorMutation.isPending}
          className="bg-[#455bb5] hover:bg-[#3a4b99] text-white font-semibold px-6 py-3 rounded-lg transition"
        >
          {updateAuthorMutation.isPending ? 'Saving...' : 'Update Author'}
        </button>
      </form>
    </div>
  );
}
