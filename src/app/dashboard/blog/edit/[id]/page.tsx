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
import Breadcrumb, { BreadcrumbItem } from '@/components/breadCrum';

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
  tags: z.string().optional(),
  metaTitle: z.string().optional(),
  metaDescription: z.string().optional(),
  metaKeywords: z.string().optional(),
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
      tags: '',
      metaTitle: '',
      metaDescription: '',
      metaKeywords: '',
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
        tags: blogData.tags?.join(', ') || '',
        metaTitle: blogData.meta?.title || '',
        metaDescription: blogData.meta?.description || '',
        metaKeywords: blogData.meta?.keywords?.join(', ') || '',
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
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  const onSubmit = (data: BlogForm) => {
    const formData = new FormData();
    formData.append('title', data.title);
    formData.append('description', data.description);
    formData.append('content', data.content);
    formData.append('authorId', data.authorId);

    if (selectedImage) formData.append('image', selectedImage);

    if (data.tags)
      formData.append(
        'tags',
        JSON.stringify(data.tags.split(',').map((t) => t.trim())),
      );
    formData.append(
      'meta',
      JSON.stringify({
        title: data.metaTitle,
        description: data.metaDescription,
        keywords: data.metaKeywords?.split(',').map((k) => k.trim()) || [],
      }),
    );

    updateBlog.mutate(formData);
  };

  if (authorsLoading || blogLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  const breadCrumb: BreadcrumbItem[] = [
    { label: 'Blogs', href: '/dashboard/blog' },
    { label: 'Edit', href: `/dashboard/blog/edit/${blogId}` },
  ];

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold text-black mb-6">Edit Blog</h1>
      <Breadcrumb items={breadCrumb} />

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
            <p className="text-red-400 text-sm mt-1">{errors.title.message}</p>
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
            {authors.map((a) => (
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

        {/* Tags */}
        <div>
          <label className="block text-black font-medium mb-2">
            Tags (comma separated)
          </label>
          <input
            type="text"
            {...register('tags')}
            className="w-full p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="tag1, tag2, tag3"
          />
        </div>

        {/* Meta */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-black font-medium mb-2">
              Meta Title
            </label>
            <input
              type="text"
              {...register('metaTitle')}
              className="w-full p-3 rounded-lg border border-gray-300"
            />
          </div>
          <div>
            <label className="block text-black font-medium mb-2">
              Meta Description
            </label>
            <input
              type="text"
              {...register('metaDescription')}
              className="w-full p-3 rounded-lg border border-gray-300"
            />
          </div>
          <div>
            <label className="block text-black font-medium mb-2">
              Meta Keywords (comma separated)
            </label>
            <input
              type="text"
              {...register('metaKeywords')}
              className="w-full p-3 rounded-lg border border-gray-300"
            />
          </div>
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
          <div className="mt-4">
            {previewUrl ? (
              <>
                <p className="text-sm text-black mb-2">New Image:</p>
                <Image
                  src={previewUrl}
                  alt="Selected Image"
                  width={192}
                  height={192}
                  className="w-48 h-48 object-cover rounded-md border border-gray-300"
                />
              </>
            ) : blogData?.image ? (
              <>
                <p className="text-sm text-black mb-2">Current Image:</p>
                <Image
                  src={getImagePath(blogData.image)!}
                  alt="Current Blog Image"
                  width={192}
                  height={192}
                  className="w-48 h-48 object-cover rounded-md border border-gray-300"
                  unoptimized
                />
              </>
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

        <div className="flex justify-end gap-4 mt-6">
          <button
            type="button"
            onClick={() => router.push('/dashboard/blog')}
            className="px-6 py-3 rounded-lg text-black border bg-red-500 hover:bg-red-700 transition"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={updateBlog.isPending}
            className="bg-gray-200 hover:bg-gray-400 text-black font-semibold px-6 py-3 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {updateBlog.isPending ? 'Updating...' : 'Update Blog'}
          </button>
        </div>
      </form>
    </div>
  );
}
