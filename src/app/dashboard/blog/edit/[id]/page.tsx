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
import { blog } from 'lib/blog';
import { FaGlobeAsia, FaImage, FaUser } from 'react-icons/fa';
import { MdDashboard } from 'react-icons/md';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { getBlogImageSrc, isEditableBlogImage } from 'lib/blog/image';

const JsonEditorWrapper = dynamic(
  () =>
    import('../../../../../components/jsoneditor/JSONEditorController').then(
      (mod) => mod.JsonEditorWrapper,
    ),
  { ssr: false },
);

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
  image: z.string().optional(),
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
  const [errorMsg, setErrorMsg] = useState<string>('');

  const [storedImage, setStoredImage] = useState<string | null>(null);
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
      router.push('/dashboard/blog?updated=true');
    },
    onError: () => {
      toast.error('Failed to update blog', { autoClose: 3000 });
    },
  });

  const publishBlog = useMutation({
    mutationFn: (isPublished: boolean) => blog.publish(blogId, isPublished),
    onSuccess: (data) => {
      const blogData = data?.data;
      if (!blogData) return;
      queryClient.setQueryData(['blog', blogId], blogData);
      queryClient.invalidateQueries({ queryKey: ['blogs'] });

      router.push(`/dashboard/blog?published=${blogData.is_published}`);
    },
    onError: () => {
      toast.error('Failed to update publish status', { autoClose: 3000 });
    },
  });

  const { register, handleSubmit, control, setValue, reset, watch } =
    useForm<BlogForm>({
      resolver: zodResolver(BlogSchema),
      defaultValues: {
        content: '',
        authorId: [],
        tags: DEFAULT_TAGS,
        meta: DEFAULT_META,
        image: '',
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
      image: isEditableBlogImage(blogData.image) ? blogData.image || '' : '',
    });

    setSelectedAuthors(blogData.authors || []);
    setStoredImage(
      isEditableBlogImage(blogData.image) ? null : blogData.image || null,
    );
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

  const onSubmit = (data: BlogForm) => {
    const formData = new FormData();
    formData.append('title', data.title);
    formData.append('description', data.description);
    formData.append('content', data.content);
    selectedAuthors.forEach((a) => formData.append('authorId', String(a.id)));

    const imageValue = data.image?.trim() ?? '';
    if (imageValue) formData.append('image', imageValue);
    else if (storedImage) formData.append('existingImage', storedImage);
    else formData.append('removeImage', 'true');

    if (data.tags) formData.append('tags', JSON.stringify(data.tags));
    if (data.meta) formData.append('meta', JSON.stringify(data.meta));

    updateBlog.mutate(formData);
  };

  const imageValue = watch('image')?.trim() || '';
  const previewSrc = imageValue || getBlogImageSrc(storedImage);

  const togglePublish = () => {
    if (!blogData) return;
    const action = blogData.is_published ? 'unpublish' : 'publish';
    if (!confirm(`Are you sure you want to ${action} this blog?`)) return;
    publishBlog.mutate(!blogData.is_published);
  };

  const breadCrumb: BreadcrumbItem[] = [
    { label: 'Blogs', href: '/dashboard/blog' },
    {
      label: `Edit ${blogData?.title}`,
      href: `/dashboard/blog/edit/${blogId}`,
    },
  ];

  return (
    <div>
      <header className="w-full border-b border-gray-200 block pb-4 xs:flex items-center justify-between">
        <div className="min-w-0 flex-1">
          <h1 className="text-xl sm:text-2xl font-bold max-w-70 md:max-w-80 sm:max-w-50 truncate block">
            {blogData?.title}
          </h1>
          <div className="my-2 sm:my-4">
            <Breadcrumb items={breadCrumb} />
          </div>
        </div>
        <div className="flex items-center gap-4 ">
          <button
            type="submit"
            form="edit-blog-form"
            className="px-2 sm:px-4 py-1 sm:py-2 bg-gray-200 text-black hover:bg-gray-500 rounded"
            disabled={updateBlog.isPending}
          >
            {updateBlog.isPending ? 'Saving...' : 'Save'}
          </button>

          <div>
            <button
              type="button"
              className="px-2 sm:px-4 py-1 bg-gray-200 text-black hover:bg-gray-500 rounded"
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
      </header>
      <div className="flex justify-end mt-4" />
      <main className="grow py-4">
        {errorMsg && (
          <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
            Error: {errorMsg}
          </div>
        )}
        <form
          id="edit-blog-form"
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-6"
        >
          {/* Title & Description */}
          <div className="grid sm:grid-cols-2 gap-4">
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
                className="w-full p-2 border rounded resize-none"
                rows={1}
              />
            </div>
          </div>

          {/* Image & Authors */}
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label
                className="text-black font-medium mb-4 flex items-center gap-1 cursor-pointer"
                htmlFor="imageInput"
              >
                Cover Image URL <FaImage />
              </label>
              <input
                type="text"
                id="imageInput"
                placeholder="https://example.com/cover.jpg"
                {...register('image')}
                className="w-full p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />

              {/* {previewSrc && (
              <div className="relative inline-block pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setValue('image', '');
                    setStoredImage(null);
                  }}
                  className="absolute top-6 right-2 bg-white text-red-600 border border-red-500 rounded-full w-6 h-6 flex justify-center shadow-lg cursor-pointer z-10 hover:bg-red-50 transition"
                >
                  &times;
                </button>
                <img
                  src={previewSrc}
                  alt="Preview"
                  className="w-full h-auto max-h-64 object-cover rounded-lg border border-gray-300 shadow-md"
                  loading="lazy"
                  decoding="async"
                />
              </div>
            )} */}
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
                      className="flex items-center gap-2 bg-gray-200 text-black px-3 py-1 rounded-full shadow-sm"
                    >
                      {author.firstName} {author.lastName}
                      <button
                        type="button"
                        className="flex items-center justify-center w-5 h-5 text-black hover:text-gray-500 cursor-pointer"
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
                <JsonEditorWrapper
                  value={field.value || DEFAULT_TAGS}
                  onChange={field.onChange}
                  height="200px"
                />
              </div>
            )}
          />

          <Controller
            name="meta"
            control={control}
            render={({ field }) => (
              <div>
                <label className="block mb-4 font-medium">Meta</label>
                <JsonEditorWrapper
                  value={field.value || DEFAULT_META}
                  onChange={field.onChange}
                  height="500px"
                />
              </div>
            )}
          />
        </form>
      </main>
    </div>
  );
}
