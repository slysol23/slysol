'use client';

import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useParams, useRouter } from 'next/navigation';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { blog } from 'lib/blog';
import { IBlog } from 'lib/blog/type';
import Button from '@/components/Button';
import BlogForm, {
  BlogAuthorOption,
  BlogFormValues,
  blogFormSchema,
  createBlogDefaultMeta,
  createBlogDefaultTags,
  createBlogFormDefaults,
  parseBlogJsonField,
} from '@/components/Form/BlogForm';
import Breadcrumb, { BreadcrumbItem } from '@/components/breadCrum';
import { isEditableBlogImage } from 'lib/blog/image';
import DashboardButton from '@/components/Button/DashboardButton';
import {
  confirmDashboardAction,
  showDashboardError,
} from '@/utils/dashboard-alert';

const EMPTY_AUTHORS: BlogAuthorOption[] = [];

export default function EditBlogPage() {
  const router = useRouter();
  const params = useParams();
  const queryClient = useQueryClient();
  const blogId = Number(params?.id);
  const [storedImage, setStoredImage] = useState<string | null>(null);

  const { data: authors = [], isLoading: authorsLoading } = useQuery({
    queryKey: ['authors'],
    queryFn: async () => {
      try {
        const res = await axios.get('/api/author');
        return res.data.data || [];
      } catch {
        return [];
      }
    },
  });

  const {
    data: blogData,
    isLoading: blogLoading,
    isError,
    error,
  } = useQuery<IBlog | undefined>({
    queryKey: ['blog', blogId],
    queryFn: async () => {
      const res = await axios.get(`/api/blog/id/${blogId}`);
      return res.data.data;
    },
    enabled: !Number.isNaN(blogId),
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
      void showDashboardError('Failed to update blog');
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
      void showDashboardError('Failed to update publish status');
    },
  });

  const form = useForm<BlogFormValues>({
    resolver: zodResolver(blogFormSchema),
    defaultValues: createBlogFormDefaults(),
    mode: 'onChange',
  });

  useEffect(() => {
    if (!blogData) return;

    form.reset({
      title: blogData.title || '',
      description: blogData.description || '',
      content: blogData.content || '',
      authorId: blogData.authors?.map((author) => String(author.id)) || [],
      tags: parseBlogJsonField(blogData.tags, createBlogDefaultTags()),
      meta: parseBlogJsonField(blogData.meta, createBlogDefaultMeta()),
      image: isEditableBlogImage(blogData.image) ? blogData.image || '' : '',
    });

    setStoredImage(
      isEditableBlogImage(blogData.image) ? null : blogData.image || null,
    );
  }, [blogData, form]);

  const onSubmit = async (
    data: BlogFormValues,
    selectedAuthors: BlogAuthorOption[],
  ) => {
    const formData = new FormData();
    formData.append('title', data.title);
    formData.append('description', data.description);
    formData.append('content', data.content);

    selectedAuthors.forEach((author) =>
      formData.append('authorId', String(author.id)),
    );

    const imageValue = data.image?.trim() ?? '';
    if (imageValue) {
      formData.append('image', imageValue);
    } else if (storedImage) {
      formData.append('existingImage', storedImage);
    } else {
      formData.append('removeImage', 'true');
    }

    if (data.tags) {
      formData.append('tags', JSON.stringify(data.tags));
    }

    if (data.meta) {
      formData.append('meta', JSON.stringify(data.meta));
    }

    updateBlog.mutate(formData);
  };

  const togglePublish = async () => {
    if (!blogData) return;
    const action = blogData.is_published ? 'unpublish' : 'publish';
    const confirmed = await confirmDashboardAction({
      title: `${action.charAt(0).toUpperCase() + action.slice(1)} blog?`,
      text: `Are you sure you want to ${action} this blog?`,
      confirmButtonText: action === 'publish' ? 'Publish' : 'Unpublish',
    });

    if (!confirmed) return;
    publishBlog.mutate(!blogData.is_published);
  };

  const breadCrumb: BreadcrumbItem[] = [
    { label: 'Blogs', href: '/dashboard/blog' },
    {
      label: `Edit ${blogData?.title}`,
      href: `/dashboard/blog/edit/${blogId}`,
    },
  ];

  if (authorsLoading || blogLoading) {
    return (
      <div className="min-h-screen text-black flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
          <p className="text-xl">Loading...</p>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <p className="text-red-500 p-4">
        {(error as Error)?.message || 'Failed to load blog'}
      </p>
    );
  }

  if (!blogData) {
    return <p className="text-red-500 p-4">Blog not found</p>;
  }

  return (
    <BlogForm
      form={form}
      authors={authors}
      breadcrumbItems={breadCrumb}
      headerTitle={blogData.title}
      submitButtonText="Update Blog"
      isSubmitting={updateBlog.isPending}
      onSubmit={onSubmit}
      initialSelectedAuthors={blogData.authors || EMPTY_AUTHORS}
      headerActions={
        <DashboardButton
          type="submit"
          onClick={() => void togglePublish()}
          disabled={publishBlog.isPending}
        >
          {blogData?.is_published
            ? publishBlog.isPending
              ? 'Updating...'
              : 'Unpublish'
            : publishBlog.isPending
              ? 'Updating...'
              : 'Publish'}
        </DashboardButton>
      }
    />
  );
}
