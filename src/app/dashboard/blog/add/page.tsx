'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import BlogForm, {
  BlogAuthorOption,
  BlogFormValues,
  blogFormSchema,
  createBlogFormDefaults,
} from '@/components/Form/BlogForm';
import { BreadcrumbItem } from '@/components/breadCrum';
import { useUser } from 'providers/UserProvider';
import { toast } from 'react-toastify';
import DashboardButton from '@/components/Button/DashboardButton';

export default function AddBlogPage() {
  const router = useRouter();
  const { user, isLoading: userLoading } = useUser();
  const queryClient = useQueryClient();

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

  const createBlog = useMutation({
    mutationFn: async (formData: FormData) => {
      const res = await axios.post('/api/blog', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['blogs'] });
      router.push('/dashboard/blog?created=true');
    },
    onError: (error) => {
      console.error('Error creating blog:', error);
      toast.error('Failed to create blog');
    },
  });

  const form = useForm<BlogFormValues>({
    resolver: zodResolver(blogFormSchema),
    defaultValues: createBlogFormDefaults(),
    mode: 'onChange',
  });

  const breadCrumb: BreadcrumbItem[] = [
    { label: 'Blogs', href: '/dashboard/blog' },
    { label: 'Add Blog', href: '/dashboard/blog/add' },
  ];

  const onSubmit = async (
    data: BlogFormValues,
    selectedAuthors: BlogAuthorOption[],
  ) => {
    if (!user) {
      router.push('/login');
      return;
    }

    const formData = new FormData();
    formData.append('title', data.title);
    formData.append('description', data.description);
    selectedAuthors.forEach((author) =>
      formData.append('authorId', String(author.id)),
    );
    formData.append('content', data.content);
    formData.append('image', data.image?.trim() ?? '');

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
          <DashboardButton onClick={() => router.push('/login')}>
            Sign In
          </DashboardButton>
        </div>
      </div>
    );
  }

  return (
    <BlogForm
      form={form}
      authors={authors}
      breadcrumbItems={breadCrumb}
      headerTitle="Add New Blog"
      submitButtonText="Save Blog"
      isSubmitting={createBlog.isPending}
      onSubmit={onSubmit}
    />
  );
}
