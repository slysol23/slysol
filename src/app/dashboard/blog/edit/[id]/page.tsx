'use client';

import React, { useEffect, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { blog } from 'lib/blog';
import { author } from 'lib/author';
import Image from 'next/image';
import dynamic from 'next/dynamic';

const CKEditorWrapper = dynamic(
  () => import('../../../../../components/CkEditor/CkEditorWrapper'),
  { ssr: false },
);

const BlogSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters'),
  description: z.string().min(1, 'Description is required'),
  content: z.string().min(10, 'Content must be at least 10 characters'),
  authorId: z.string().min(1, 'Author is required'),
  image: z.any().optional(),
});

type BlogForm = z.infer<typeof BlogSchema>;

interface EditBlogPageProps {
  params: { id: string };
}

export default function EditBlogPage({ params }: EditBlogPageProps) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const blogId = parseInt(params.id, 10);

  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const getImagePath = (image: string) => {
    if (!image) return null;
    return image.startsWith('/uploads/') ? image : `/uploads/${image}`;
  };

  // Fetch authors
  const { data: authors = [], isLoading: authorsLoading } = useQuery({
    queryKey: ['authors'],
    queryFn: async () => (await author.getAll())?.data || [],
  });

  // Fetch blog
  const { data: blogData, isLoading: blogLoading } = useQuery({
    queryKey: ['blog', blogId],
    queryFn: async () => (await blog.getById(blogId))?.data,
    enabled: !isNaN(blogId),
  });

  // Mutation for updating blog
  const updateBlog = useMutation({
    mutationFn: async (formData: FormData) => {
      const res = await fetch(`/api/blog/${blogId}`, {
        method: 'PATCH',
        body: formData,
      });
      if (!res.ok) throw new Error('Failed to update blog');
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['blogs'] });
      router.push('/dashboard/blog');
    },
  });

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<BlogForm>({
    resolver: zodResolver(BlogSchema),
    defaultValues: {
      title: '',
      description: '',
      content: '',
      authorId: '',
      image: undefined,
    },
  });

  // Pre-fill form
  useEffect(() => {
    if (blogData) {
      reset({
        title: blogData.title || '',
        description: blogData.description || '',
        content: blogData.content || '',
        authorId: blogData.author?.id?.toString() || '',
        image: undefined,
      });
    }
  }, [blogData, reset]);

  // Handle image selection
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setSelectedImage(file);

    if (file) {
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    } else {
      setPreviewUrl(null);
    }
  };

  // Cleanup preview URL
  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  const onSubmit = (data: BlogForm) => {
    const formData = new FormData();
    formData.append('title', data.title);
    formData.append('description', data.description);
    formData.append('content', data.content);
    formData.append('authorId', data.authorId);
    if (selectedImage) formData.append('image', selectedImage);

    updateBlog.mutate(formData);
  };

  if (authorsLoading || blogLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen text-black">
      <header className="border-b border-gray-200 py-6 px-6">
        <h1 className="text-3xl font-bold">Edit Blog</h1>
      </header>

      <main className="flex-grow py-10 px-6">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Title */}
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

          {/* Description */}
          <div>
            <label className="block text-black font-medium mb-2">
              Description
            </label>
            <textarea
              {...register('description')}
              className="w-full p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter blog description"
              rows={2}
            />
            {errors.description && (
              <p className="text-red-400 text-sm mt-1">
                {errors.description.message}
              </p>
            )}
          </div>

          {/* Author */}
          <div>
            <label className="block text-black font-medium mb-2">Author</label>
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
              Upload New Image
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="w-full p-3 text-black"
            />

            {/* Image Preview */}
            <div className="mt-4">
              {previewUrl ? (
                <div>
                  <p className="text-sm text-black mb-2">New Image:</p>
                  <Image
                    src={previewUrl}
                    alt="Selected Image"
                    width={192}
                    height={192}
                    className="w-48 h-48 object-cover rounded-md border border-gray-300"
                  />
                </div>
              ) : blogData?.image ? (
                <div>
                  <p className="text-sm text-black mb-2">Current Image:</p>
                  <Image
                    src={getImagePath(blogData.image)!}
                    alt="Current Blog Image"
                    width={192}
                    height={192}
                    className="w-48 h-48 object-cover rounded-md border border-gray-300"
                    unoptimized
                  />
                </div>
              ) : (
                <p className="text-gray-500 text-sm">No image uploaded</p>
              )}
            </div>
          </div>

          {/* CKEditor */}
          <div>
            <label className="block text-black font-medium mb-2">Content</label>
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

          <button
            type="submit"
            disabled={updateBlog.isPending}
            className="bg-gray-200 hover:bg-gray-400 text-black font-semibold px-6 py-3 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {updateBlog.isPending ? 'Updating...' : 'Update Blog'}
          </button>
        </form>
      </main>
    </div>
  );
}
