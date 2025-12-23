'use client';

import React, { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import dynamic from 'next/dynamic';
import Breadcrumb, { BreadcrumbItem } from '@/components/breadCrum';
import axios from 'axios';
import Image from 'next/image';
import { MdDashboard } from 'react-icons/md';
import { useUser } from 'providers/UserProvider';
import { FaGlobeAsia, FaImage, FaUser } from 'react-icons/fa';
import toast from 'react-hot-toast';

const JsonEditorWrapper = dynamic(
  () =>
    import('../../../../components/jsoneditor/JSONEditorController').then(
      (mod) => mod.JsonEditorWrapper,
    ),
  { ssr: false },
);
const CKEditorWrapper = dynamic(
  () => import('../../../../components/CkEditor/CkEditorWrapper'),
  { ssr: false },
);

const DEFAULT_TAGS = ['example'];

const DEFAULT_META = [
  { property: 'og:title', content: '' },
  { property: 'og:description', content: '' },
  { property: 'og:type', content: '' },
  { property: 'og:url', content: '' },
  {
    property: 'og:images',
    content: [{ url: '' }, { url: '' }],
  },
  {
    property: 'authors',
    content: [{ name: '' }, { name: '' }],
  },
  { property: 'published_at', content: '' },
];

const BlogSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters'),
  authorId: z.array(z.string()).min(1, 'Author is required'),
  content: z.string().min(10, 'Content must be at least 10 characters'),
  description: z.string().min(1, 'Description is required'),
  tags: z.any().optional(),
  meta: z.any().optional(),
  image: z.any().optional(),
});

type BlogForm = z.infer<typeof BlogSchema>;

export default function AddBlogPage() {
  const router = useRouter();
  const { user, isLoading: userLoading } = useUser();
  const [errorMsg, setErrorMsg] = useState<string>('');

  const { data: authors = [], isLoading: authorsLoading } = useQuery({
    queryKey: ['authors'],
    queryFn: async () => {
      try {
        const res = await axios.get('/api/author');
        return res.data.data || [];
      } catch (err) {
        return [];
      }
    },
  });

  const createBlog = useMutation({
    mutationFn: async (formData: FormData) => {
      const res = await axios.post('/api/blog', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return res.data;
    },
    onSuccess: () => {
      toast.success('Successfully Created blog');
      setTimeout(() => router.push('/dashboard/blog'), 500);
      router.push('/dashboard/blog');
    },
    onError: (error) => {
      console.error('Error creating blog:', error);
      alert('Failed to create blog');
    },
  });

  const {
    register,
    handleSubmit,
    control,
    setValue,
    formState: { errors },
  } = useForm<BlogForm>({
    resolver: zodResolver(BlogSchema),
    defaultValues: {
      content: '',
      authorId: [],
      tags: DEFAULT_TAGS,
      meta: DEFAULT_META,
    },
    mode: 'onChange',
  });

  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [selectedAuthors, setSelectedAuthors] = useState<any[]>([]);
  const [imageFile, setImageFile] = useState<File | null>(null);

  const toggleAuthor = (author: any) => {
    const exists = selectedAuthors.find((a) => a.id === author.id);
    const updated = exists
      ? selectedAuthors.filter((a) => a.id !== author.id)
      : [...selectedAuthors, author];
    setSelectedAuthors(updated);
    setValue(
      'authorId',
      updated.map((a) => String(a.id)),
    );
  };

  const removeAuthor = (author: any) => {
    const updated = selectedAuthors.filter((a) => a.id !== author.id);
    setSelectedAuthors(updated);
    setValue(
      'authorId',
      updated.map((a) => String(a.id)),
    );
  };

  const breadCrumb: BreadcrumbItem[] = [
    { label: 'Blogs', href: '/dashboard/blog' },
    { label: 'Add Blog', href: '/dashboard/blog/add' },
  ];

  const onSubmit = async (data: BlogForm) => {
    if (!user) {
      alert('You must be logged in to create a blog');
      router.push('/login');
      return;
    }

    const formData = new FormData();
    formData.append('title', data.title);
    formData.append('description', data.description);
    data.authorId.forEach((id) => formData.append('authorId', id));
    formData.append('content', data.content);
    if (imageFile) formData.append('image', imageFile);

    if (data.tags) {
      formData.append('tags', JSON.stringify(data.tags));
    }

    if (data.meta) {
      formData.append('meta', JSON.stringify(data.meta));
    }

    createBlog.mutate(formData);
  };

  if (userLoading || authorsLoading) {
    return (
      <div className="min-h-screen text-black flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
          <p className="text-xl">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen text-black flex items-center justify-center">
        <div className="text-center">
          <p className="text-xl mb-4">
            You must be logged in to create a blog.
          </p>
          <button
            onClick={() => router.push('/login')}
            className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          >
            Sign In
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen text-black">
      <header className="border-b border-gray-200">
        <h1 className="text-2xl font-bold">Add New Blog</h1>
        <div className="mt-4">
          <Breadcrumb items={breadCrumb} />
        </div>
      </header>
      <div className="flex justify-end mt-4">
        <button
          type="submit"
          form="blog-form"
          disabled={createBlog.isPending}
          className="px-6 py-3 rounded-lg bg-gray-200 text-black hover:bg-gray-400 transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {createBlog.isPending ? 'Saving...' : 'Save Blog'}
        </button>
      </div>
      <main className="flex-grow py-4">
        {errorMsg && (
          <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
            Error: {errorMsg}
          </div>
        )}
        <form
          id="blog-form"
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-6"
        >
          {/* Title & Description */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="flex gap-1 items-center text-black font-medium mb-4">
                Title <MdDashboard />
              </label>
              <input
                type="text"
                {...register('title')}
                className="w-full p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter blog title"
              />
              {errors.title && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.title.message}
                </p>
              )}
            </div>
            <div>
              <label className=" flex items-center gap-1 text-black font-medium mb-4">
                Description <FaGlobeAsia />
              </label>
              <textarea
                {...register('description')}
                className="w-full p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter blog description"
              />
              {errors.description && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.description.message}
                </p>
              )}
            </div>
          </div>

          {/* Image & Author */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label
                className=" text-black font-medium mb-4 flex items-center gap-1 cursor-pointer"
                htmlFor="imageInput"
                onClick={() => document.getElementById('imageInput')}
              >
                Cover <FaImage />
              </label>
              <input
                type="file"
                accept="image/*"
                {...register('image')}
                id="imageInput"
                className="hidden"
                onChange={(e) => {
                  if (e.target.files && e.target.files.length > 0) {
                    const file = e.target.files[0];
                    setImageFile(file);
                    setImagePreview(URL.createObjectURL(file));
                  }
                }}
              />
              {imagePreview && (
                <div className="relative inline-block">
                  <button
                    type="button"
                    onClick={() => {
                      setImagePreview(null);
                      setImageFile(null);
                      const input = document.getElementById(
                        'imageInput',
                      ) as HTMLInputElement;
                      if (input) input.value = '';
                    }}
                    className="absolute top-2 right-2 bg-white text-red-600 border border-red-500 rounded-full px-2 py-1 text-xs shadow cursor-pointer"
                  >
                    ✕
                  </button>
                  <Image
                    height={192}
                    width={240}
                    src={imagePreview}
                    alt="Preview"
                    className="rounded-lg border items-center object-cover"
                  />
                </div>
              )}
            </div>

            {/* Author Selection */}
            <div className="relative w-full">
              <label className="flex gap-1 items-center text-black font-medium mb-4">
                Authors <FaUser />
              </label>
              <div className="relative bg-white">
                <button
                  type="button"
                  className="bg-white w-full p-3 border rounded-lg text-left flex justify-between items-center focus:outline-none focus:ring-2 focus:ring-blue-500"
                  onClick={() => setDropdownOpen((prev) => !prev)}
                >
                  {selectedAuthors.length > 0
                    ? `${selectedAuthors.length} selected`
                    : 'Select authors'}
                  <span className="ml-2">&#9662;</span>
                </button>
                {dropdownOpen && (
                  <div className="absolute z-50 mt-1 w-full max-h-60 overflow-y-auto border rounded-lg bg-white shadow-lg">
                    {authors.map((author: any) => (
                      <div
                        key={author.id}
                        className={`cursor-pointer px-3 py-2 hover:bg-gray-300 flex justify-between items-center ${
                          selectedAuthors.find((a) => a.id === author.id)
                            ? 'bg-blue-50'
                            : ''
                        }`}
                        onClick={() => toggleAuthor(author)}
                      >
                        <span>
                          {author.firstName} {author.lastName}
                        </span>
                        {selectedAuthors.find((a) => a.id === author.id) && (
                          <span className="text-blue-600 font-bold">✓</span>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
              {selectedAuthors.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-3">
                  {selectedAuthors.map((author) => (
                    <div
                      key={author.id}
                      className="flex items-center gap-2 bg-blue-100 text-blue-800 px-3 py-1 rounded-full shadow-sm"
                    >
                      {author.firstName} {author.lastName}
                      <button
                        type="button"
                        className="flex items-center justify-center w-5 h-5 text-white bg-red-500 rounded-full hover:bg-red-600 transition"
                        onClick={() => removeAuthor(author)}
                      >
                        &times;
                      </button>
                    </div>
                  ))}
                </div>
              )}
              {errors.authorId && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.authorId.message}
                </p>
              )}
            </div>
          </div>

          {/* Content */}
          <div>
            <label className="block text-black font-medium mb-4">Content</label>
            <Controller
              name="content"
              control={control}
              render={({ field }) => (
                <CKEditorWrapper
                  id="blog-content-editor"
                  initialData={field.value}
                  onChange={field.onChange}
                />
              )}
            />
            {errors.content && (
              <p className="text-red-500 text-sm mt-1">
                {errors.content.message}
              </p>
            )}
          </div>

          {/* Tags */}
          <Controller
            name="tags"
            control={control}
            render={({ field }) => (
              <div>
                <label className="block text-black font-medium mb-2">
                  Tags
                </label>
                <div className="border rounded-lg p-2">
                  <JsonEditorWrapper
                    value={field.value}
                    onChange={field.onChange}
                    height="300px"
                  />
                </div>
              </div>
            )}
          />

          {/* Meta */}
          <Controller
            name="meta"
            control={control}
            render={({ field }) => (
              <div>
                <label className="block text-black font-medium mb-2">
                  Meta
                </label>
                <div className="border rounded-lg p-2">
                  <JsonEditorWrapper
                    value={field.value}
                    onChange={field.onChange}
                    height="500px"
                  />
                </div>
              </div>
            )}
          />
        </form>
      </main>
    </div>
  );
}
