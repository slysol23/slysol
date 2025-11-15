'use client';

import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { blog } from 'lib/blog';
import { author } from 'lib/author';
import { useRouter } from 'next/navigation';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import dynamic from 'next/dynamic';
import Breadcrumb, { BreadcrumbItem } from '@/components/breadCrum';

const CKEditorWrapper = dynamic(
  () => import('../../../../components/CkEditor/CkEditorWrapper'),
  { ssr: false },
);

const BlogSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters'),
  authorId: z.string().min(1, 'Author is required'),
  content: z.string().min(10, 'Content must be at least 10 characters'),
  description: z.string(),
  image: z.any().optional(),
});

type BlogForm = z.infer<typeof BlogSchema>;

export default function AddBlogPage() {
  const router = useRouter();
  const queryClient = useQueryClient();

  const { data: authors = [], isLoading: authorsLoading } = useQuery({
    queryKey: ['authors'],
    queryFn: async () => (await author.getAll())?.data || [],
  });

  const createBlog = useMutation({
    mutationFn: async (data: FormData) => blog.create(data as any),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['blogs'] });
      router.push('/dashboard/blog');
    },
  });

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isValid },
  } = useForm<BlogForm>({
    resolver: zodResolver(BlogSchema),
    defaultValues: { content: '' },
  });

  const onSubmit = (data: BlogForm) => {
    const formData = new FormData();
    formData.append('title', data.title);
    formData.append('description', data.description);
    formData.append('authorId', data.authorId);
    formData.append('content', data.content);
    if (data.image?.[0]) formData.append('image', data.image[0]);
    createBlog.mutate(formData);
  };
  const breadCrumb: BreadcrumbItem[] = [
    { label: 'Blogs', href: '/dashboard/blog' },
    { label: 'Add Blog', href: '/dashboard/blog/add' },
  ];

  return (
    <div className=" min-h-screen text-black">
      <header className="border-b border-gray-200 px-6">
        <h1 className="text-3xl font-bold">Add New Blog</h1>
        <span className="p-5">
          <Breadcrumb items={breadCrumb} />
        </span>
      </header>
      <main className="flex-grow py-10 px-6">
        {!authorsLoading && (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Header */}
            <div>
              <label className="block text-black font-medium mb-2">Title</label>
              <input
                type="text"
                {...register('title')}
                className="w-full p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter blog title"
              />
              {errors.title && (
                <p className="text-red-400 text-sm mt-1">
                  {errors.title.message}
                </p>
              )}
            </div>

            {/* Descritpion */}
            <div>
              <label className="block text-black font-medium mb-2">
                Description
              </label>
              <textarea
                {...register('description')}
                className="w-full p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter blog description"
                rows={1}
              />
              {errors.description && (
                <p className="text-red-400 text-sm mt-1">
                  {errors.description.message}
                </p>
              )}
            </div>

            {/* Author */}
            <div>
              <label className="block text-black font-medium mb-2">
                Author
              </label>
              <select
                {...register('authorId')}
                className="w-full p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select an author</option>
                {authors.map((a: any) => (
                  <option key={a.id} value={a.id}>
                    {a.firstName} {a.lastName}
                  </option>
                ))}
              </select>
              {errors.authorId && (
                <p className="text-red-400 text-sm mt-1">
                  {errors.authorId.message}
                </p>
              )}
            </div>

            {/* Image */}
            <div>
              <label className="block text-black font-medium mb-2">
                Upload Image
              </label>
              <input
                type="file"
                accept="image/*"
                {...register('image')}
                className="w-full p-3 text-black"
              />
            </div>

            {/* CKEditor */}
            <div>
              <label className="block text-black font-medium mb-2">
                Content
              </label>
              <Controller
                name="content"
                control={control}
                render={({ field }) => (
                  <CKEditorWrapper
                    initialData={field.value}
                    onChange={field.onChange}
                  />
                )}
              />
              {errors.content && (
                <p className="text-red-400 text-sm mt-1">
                  {errors.content.message}
                </p>
              )}
            </div>

            <div className="flex justify-end gap-4">
              <button
                type="button"
                onClick={() => router.push('/dashboard/blog')}
                className="px-6 py-3 rounded-lg border bg-red-500 hover:bg-red-700 transition"
              >
                Cancel
              </button>
              {isValid && (
                <button
                  type="submit"
                  disabled={createBlog.isPending}
                  className="px-6 py-3 rounded-lg border border-gray-300 hover:bg-gray-400 transition"
                >
                  {createBlog.isPending ? 'Adding...' : 'Add Blog'}
                </button>
              )}
            </div>
          </form>
        )}
      </main>
    </div>
  );
}
