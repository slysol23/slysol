'use client';

import React, { useEffect, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import dynamic from 'next/dynamic';
import Breadcrumb, { BreadcrumbItem } from '@/components/breadCrum';
import axios from 'axios';
import Image from 'next/image';
import 'jsoneditor-react/es/editor.min.css';
import { JsonEditor as Editor, JsonEditor } from 'jsoneditor-react';
import { blog } from 'lib/blog';
import { FaGlobeAsia, FaImage, FaUser } from 'react-icons/fa';
import { MdDashboard } from 'react-icons/md';

const CKEditorWrapper = dynamic(
  () => import('../../../../../components/CkEditor/CkEditorWrapper'),
  { ssr: false },
);

const BlogSchema = z.object({
  title: z.string().min(3),
  authorId: z.array(z.string()).min(1),
  description: z.string().min(1),
  content: z.string().min(10),
  tags: z.any().optional(),
  meta: z.any().optional(),
  image: z.any().optional(),
});

type BlogForm = z.infer<typeof BlogSchema>;

interface EditBlogPageProps {
  params: { id: string };
}

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

export default function EditBlogPage({ params }: EditBlogPageProps) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const blogId = Number(params.id);

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [selectedAuthors, setSelectedAuthors] = useState<any[]>([]);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const { data: authors = [], isLoading: authorsLoading } = useQuery({
    queryKey: ['authors'],
    queryFn: async () => {
      const res = await axios.get('/api/author');
      return res.data.data || [];
    },
  });

  const { data: blogData, isLoading: blogLoading } = useQuery({
    queryKey: ['blog', blogId],
    queryFn: async () => {
      const res = await axios.get(`/api/blog/id/${blogId}`);
      return res.data.data;
    },
    enabled: !isNaN(blogId),
  });

  const updateBlog = useMutation({
    mutationFn: async (formData: FormData) => {
      const res = await axios.put(`/api/blog/id/${blogId}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['blogs'] });
      queryClient.invalidateQueries({ queryKey: ['blog', blogId] });
      alert('Blog updated successfully!');
      router.push('/dashboard/blog');
    },
    onError: (error) => {
      console.error('Error updating blog:', error);
      alert('Failed to update blog');
    },
  });

  const publishBlog = useMutation({
    mutationFn: (isPublished: boolean) => blog.publish(blogId, isPublished),
    onSuccess: (data) => {
      const blogData = data?.data;
      if (!blogData) return;
      queryClient.setQueryData(['blog', blogId], blogData);
      queryClient.invalidateQueries({ queryKey: ['blogs'] });
      alert(
        `✓ Blog ${
          blogData.is_published ? 'published' : 'unpublished'
        } successfully!`,
      );
    },
  });

  const { register, handleSubmit, control, setValue, reset } =
    useForm<BlogForm>({
      resolver: zodResolver(BlogSchema),
      defaultValues: {
        content: '',
        authorId: [],
        tags: DEFAULT_TAGS,
        meta: DEFAULT_META,
      },
    });

  const parseJsonField = (value: any, defaultValue: any) => {
    if (!value) return defaultValue;
    if (typeof value === 'string') {
      try {
        return JSON.parse(value);
      } catch {
        return defaultValue;
      }
    }
    if (Array.isArray(value)) return value;
    return defaultValue;
  };

  useEffect(() => {
    if (!blogData) return;

    const parsedTags = parseJsonField(blogData.tags, DEFAULT_TAGS);
    const parsedMeta = parseJsonField(blogData.meta, DEFAULT_META);

    reset({
      title: blogData.title || '',
      description: blogData.description || '',
      content: blogData.content || '',
      authorId: blogData.authors?.map((a: any) => String(a.id)) || [],
      tags: parsedTags,
      meta: parsedMeta,
    });

    setSelectedAuthors(blogData.authors || []);
    setImagePreview(blogData.image || null);
  }, [blogData, reset]);

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

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const onSubmit = (data: BlogForm) => {
    const formData = new FormData();
    formData.append('title', data.title);
    formData.append('description', data.description);
    formData.append('content', data.content);
    selectedAuthors.forEach((a) => formData.append('authorId', String(a.id)));

    if (imageFile) formData.append('image', imageFile);
    else if (imagePreview) formData.append('existingImage', imagePreview);
    else formData.append('removeImage', 'true');

    if (data.tags) formData.append('tags', JSON.stringify(data.tags));
    if (data.meta) formData.append('meta', JSON.stringify(data.meta));

    updateBlog.mutate(formData);
  };

  const togglePublish = () => {
    if (!blogData) return;
    const action = blogData.is_published ? 'unpublish' : 'publish';
    if (!confirm(`Are you sure you want to ${action} this blog?`)) return;
    publishBlog.mutate(!blogData.is_published);
  };

  const breadCrumb: BreadcrumbItem[] = [
    { label: 'Blogs', href: '/dashboard/blog' },
    { label: 'Edit', href: `/dashboard/blog/edit/${blogId}` },
  ];

  return (
    <div>
      <header className="border-b border-gray-200">
        <h1 className="text-2xl font-bold mb-6">Edit Blog</h1>
        <Breadcrumb items={breadCrumb} />
      </header>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="flex justify-end gap-4 mt-4">
          <button
            type="submit"
            onClick={() => {
              router.push('/dashboard/blog');
            }}
            className="px-4 py-2 bg-gray-200 text-black hover:bg-gray-500 rounded"
            disabled={updateBlog.isPending}
          >
            {updateBlog.isPending ? 'Saving...' : 'Save'}
          </button>
          <div>
            <button
              type="button"
              className="px-4 py-2 bg-gray-200 text-black hover:bg-gray-500 rounded"
              onClick={togglePublish}
              disabled={publishBlog.isPending}
            >
              {blogData?.is_published
                ? publishBlog.isPending
                  ? 'Updating...'
                  : 'Unpublish'
                : publishBlog.isPending
                ? 'Updating...'
                : 'Publish'}
            </button>
          </div>
        </div>
        {/* Title & Description */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="flex gap-1 items-center text-black font-medium mb-4">
              Title <MdDashboard />
            </label>{' '}
            <input
              type="text"
              {...register('title')}
              className="w-full p-2 border rounded"
            />
          </div>
          <div>
            <label className=" flex items-center gap-1 text-black font-medium mb-4">
              Description <FaGlobeAsia />
            </label>{' '}
            <textarea
              {...register('description')}
              className="w-full p-2 border rounded"
              rows={2}
            />
          </div>
        </div>

        {/* Image & Authors */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label
              className="text-black font-medium mb-2 flex items-center gap-1 cursor-pointer"
              htmlFor="imageInput"
            >
              Cover <FaImage />
            </label>
            <input
              type="file"
              accept="image/*"
              id="imageInput"
              className="hidden"
              onChange={handleImageChange}
            />

            {imagePreview && (
              <div className="relative inline-block mt-4 w-full">
                <button
                  type="button"
                  onClick={() => {
                    setImagePreview(null);
                    setImageFile(null);
                  }}
                  className="absolute top-2 right-2 bg-white text-red-600 border border-red-500 rounded-full w-8 h-8 flex items-center justify-center shadow-lg cursor-pointer z-10 hover:bg-red-50 transition"
                >
                  ✕
                </button>
                <Image
                  height={192}
                  width={240}
                  src={imagePreview}
                  alt="Preview"
                  className="w-full h-auto max-h-64 object-cover rounded-lg border border-gray-300 shadow-md"
                />
              </div>
            )}
          </div>

          {/* Author Selection */}
          <div className="relative w-full">
            <label className="flex gap-1 items-center text-black font-medium mb-4">
              Authors <FaUser />
            </label>{' '}
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
        </div>

        {/* Tags */}
        <Controller
          name="tags"
          control={control}
          render={({ field }) => (
            <div>
              <label className="block mb-4 font-medium">Tags</label>
              {blogData && (
                <JsonEditor
                  key={`tags-${blogId}-${JSON.stringify(field.value)}`}
                  value={field.value || DEFAULT_TAGS}
                  onChange={(value) => field.onChange(value)}
                  mode="code"
                  allowedModes={['tree', 'code']}
                  navigationBar={true}
                  search={true}
                  mainMenuBar={true}
                  history={true}
                />
              )}
            </div>
          )}
        />

        {/* Meta */}
        <Controller
          name="meta"
          control={control}
          render={({ field }) => (
            <div>
              <label className="block mb-4 font-medium">Meta</label>
              {blogData && (
                <JsonEditor
                  key={`meta-${blogId}-${JSON.stringify(field.value)}`}
                  value={field.value || DEFAULT_META}
                  onChange={(value) => field.onChange(value)}
                  mode="code"
                  allowedModes={['tree', 'code']}
                  navigationBar={true}
                  search={true}
                  mainMenuBar={true}
                  history={true}
                  htmlElementProps={{ style: { height: '500px' } }}
                />
              )}
            </div>
          )}
        />
      </form>
    </div>
  );
}
