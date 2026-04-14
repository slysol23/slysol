'use client';

import React from 'react';
import dynamic from 'next/dynamic';
import { Controller, UseFormReturn } from 'react-hook-form';
import { z } from 'zod';
import { FaGlobeAsia, FaImage, FaUser } from 'react-icons/fa';
import { MdCancel, MdDashboard } from 'react-icons/md';
import Breadcrumb, { BreadcrumbItem } from '@/components/breadCrum';
import Button from '@/components/Button';
import { IAuthor } from 'lib/blog/type';

export type BlogAuthorOption = Pick<
  IAuthor,
  'id' | 'firstName' | 'lastName' | 'email'
>;

const EMPTY_AUTHORS: BlogAuthorOption[] = [];

const JsonEditorWrapper = dynamic(
  () =>
    import('../jsoneditor/JSONEditorController').then(
      (mod) => mod.JsonEditorWrapper,
    ),
  { ssr: false },
);

const CKEditorWrapper = dynamic(() => import('../CkEditor/CkEditorWrapper'), {
  ssr: false,
});

export const blogFormSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters'),
  authorId: z.array(z.string()).min(1, 'Author is required'),
  content: z.string().min(10, 'Content must be at least 10 characters'),
  description: z.string().min(1, 'Description is required'),
  tags: z.any().optional(),
  meta: z.any().optional(),
  image: z.string().optional(),
});

export type BlogFormValues = z.infer<typeof blogFormSchema>;

export const createBlogDefaultTags = () => ['example'];

export const createBlogDefaultMeta = () => [
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

export const createBlogFormDefaults = (): BlogFormValues => ({
  title: '',
  authorId: [],
  content: '',
  description: '',
  tags: createBlogDefaultTags(),
  meta: createBlogDefaultMeta(),
  image: '',
});

export const parseBlogJsonField = <T,>(value: unknown, fallback: T): T => {
  if (!value) return fallback;
  if (typeof value === 'string') {
    try {
      return JSON.parse(value) as T;
    } catch {
      return fallback;
    }
  }
  if (Array.isArray(value)) return value as T;
  return fallback;
};

interface BlogFormProps {
  form: UseFormReturn<BlogFormValues>;
  authors: BlogAuthorOption[];
  breadcrumbItems: BreadcrumbItem[];
  headerTitle: string;
  submitButtonText: string;
  isSubmitting: boolean;
  onSubmit: (
    data: BlogFormValues,
    selectedAuthors: BlogAuthorOption[],
  ) => void | Promise<void>;
  headerActions?: React.ReactNode;
  initialSelectedAuthors?: BlogAuthorOption[];
  errorMessage?: string | null;
  formId?: string;
}

export default function BlogForm({
  form,
  authors,
  breadcrumbItems,
  headerTitle,
  submitButtonText,
  isSubmitting,
  onSubmit,
  headerActions,
  errorMessage,
  formId = 'blog-form',
  initialSelectedAuthors = EMPTY_AUTHORS,
}: BlogFormProps) {
  const {
    register,
    handleSubmit,
    control,
    setValue,
    formState: { errors },
  } = form;

  const [selectedAuthors, setSelectedAuthors] = React.useState<
    BlogAuthorOption[]
  >(initialSelectedAuthors);
  const [dropdownOpen, setDropdownOpen] = React.useState(false);

  React.useEffect(() => {
    setSelectedAuthors(initialSelectedAuthors);
    setValue(
      'authorId',
      initialSelectedAuthors.map((author) => String(author.id)),
      {
        shouldDirty: false,
        shouldValidate: false,
      },
    );
  }, [initialSelectedAuthors, setValue]);

  const updateSelectedAuthors = (nextAuthors: BlogAuthorOption[]) => {
    setSelectedAuthors(nextAuthors);
    setValue(
      'authorId',
      nextAuthors.map((author) => String(author.id)),
      {
        shouldDirty: true,
        shouldValidate: true,
      },
    );
  };

  const toggleAuthor = (author: BlogAuthorOption) => {
    const exists = selectedAuthors.some((item) => item.id === author.id);
    const nextAuthors = exists
      ? selectedAuthors.filter((item) => item.id !== author.id)
      : [...selectedAuthors, author];

    updateSelectedAuthors(nextAuthors);
  };

  const removeAuthor = (author: BlogAuthorOption) => {
    updateSelectedAuthors(
      selectedAuthors.filter((item) => item.id !== author.id),
    );
  };

  return (
    <div className="text-black min-h-screen flex flex-col w-full max-w-[100vw] overflow-x-hidden">
      <header className="border-b border-gray-200 pb-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-4 w-full">
        <div className="flex-1 min-w-0">
          <h1 className="text-xl sm:text-2xl font-bold truncate">
            {headerTitle}
          </h1>
          <div className="mt-2 flex items-center gap-2 flex-wrap">
            <Breadcrumb items={breadcrumbItems} />
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {headerActions}
          <Button
            type="submit"
            gray
            form={formId}
            disabled={isSubmitting}
            className="px-2 sm:px-4 py-1.5 sm:py-3 rounded-lg text-sm sm:text-base whitespace-nowrap bg-gray-200 hover:bg-green-300"
          >
            {isSubmitting ? 'Saving...' : submitButtonText}
          </Button>
        </div>
      </header>

      <main className="flex-1 py-4 w-full">
        {errorMessage && (
          <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
            {errorMessage}
          </div>
        )}

        <form
          id={formId}
          onSubmit={handleSubmit((data) => onSubmit(data, selectedAuthors))}
          className="space-y-6 w-full"
        >
          <div className="grid gap-4 sm:grid-cols-2 w-full">
            <div className="min-w-0 w-full">
              <label className="flex gap-1 items-center text-black font-medium mb-4">
                Title <MdDashboard />
              </label>
              <input
                type="text"
                {...register('title')}
                className="w-full p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 box-border"
                placeholder="Enter blog title"
              />
              {errors.title && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.title.message}
                </p>
              )}
            </div>

            <div className="min-w-0 w-full">
              <label className="flex items-center gap-1 text-black font-medium mb-4">
                Description <FaGlobeAsia />
              </label>
              <textarea
                {...register('description')}
                className="w-full p-3 rounded-lg border resize-none border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 box-border"
                placeholder="Enter blog description"
                rows={1}
              />
              {errors.description && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.description.message}
                </p>
              )}
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 w-full">
            <div className="min-w-0 w-full">
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
                className="w-full p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 box-border"
              />
            </div>

            <div className="relative w-full min-w-0">
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
                    {authors.length > 0 ? (
                      authors.map((author) => (
                        <div
                          key={author.id}
                          className={`cursor-pointer px-3 py-2 hover:bg-gray-300 flex justify-between items-center ${
                            selectedAuthors.some(
                              (item) => item.id === author.id,
                            )
                              ? 'bg-blue-50'
                              : ''
                          }`}
                          onClick={() => toggleAuthor(author)}
                        >
                          <span>
                            {author.firstName} {author.lastName}
                          </span>
                          {selectedAuthors.some(
                            (item) => item.id === author.id,
                          ) && (
                            <span className="text-blue-600 font-bold">
                              &#10003;
                            </span>
                          )}
                        </div>
                      ))
                    ) : (
                      <div className="px-3 py-2 text-gray-500 text-sm">
                        No authors found
                      </div>
                    )}
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
                        className="flex items-center justify-center w-5 h-5 text-black transition"
                        onClick={() => removeAuthor(author)}
                      >
                        <MdCancel className="hover:text-gray-500" />
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

          <div className="w-full min-w-0 overflow-hidden">
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

          <Controller
            name="tags"
            control={control}
            render={({ field }) => (
              <div className="w-full min-w-0">
                <label className="block text-black font-medium mb-2">
                  Tags
                </label>
                <div className="border rounded-lg p-2">
                  <JsonEditorWrapper
                    value={field.value ?? createBlogDefaultTags()}
                    onChange={field.onChange}
                    height="300px"
                  />
                </div>
              </div>
            )}
          />

          <Controller
            name="meta"
            control={control}
            render={({ field }) => (
              <div className="w-full min-w-0">
                <label className="block text-black font-medium mb-2">
                  Meta
                </label>
                <div className="border rounded-lg p-2">
                  <JsonEditorWrapper
                    value={field.value ?? createBlogDefaultMeta()}
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
