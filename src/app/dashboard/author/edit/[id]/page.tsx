'use client';

import React from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { author } from 'lib/author';
import { BreadcrumbItem } from '@/components/breadCrum';
import AuthorForm, {
  AuthorFormValues,
  authorFormSchema,
  createAuthorFormDefaults,
  mapAuthorToFormValues,
} from '@/components/Form/AuthorForm';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function EditAuthorPage() {
  const router = useRouter();
  const params = useParams();
  const queryClient = useQueryClient();
  const id = Number(params?.id);

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
    mutationFn: async (data: AuthorFormValues) => {
      return await author.update(id, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['authors'] });
      router.push('/dashboard/author?updated=true');
    },
    onError: () => {
      toast.error('Failed to update author', { autoClose: 3000 });
    },
  });

  const form = useForm<AuthorFormValues>({
    resolver: zodResolver(authorFormSchema),
    mode: 'onChange',
    defaultValues: createAuthorFormDefaults(),
  });
  const { reset } = form;

  React.useEffect(() => {
    if (a) {
      reset(mapAuthorToFormValues(a));
    }
  }, [a, reset]);

  const onSubmit = (data: AuthorFormValues) => {
    updateAuthorMutation.mutate(data);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen text-black flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
          <p className="text-xl">Loading...</p>
        </div>
      </div>
    );
  }
  if (isError)
    return (
      <p className="text-red-400">
        {(error as Error)?.message || 'Failed to load author'}
      </p>
    );
  const breadCrumb: BreadcrumbItem[] = [
    { label: 'Authors', href: '/dashboard/author' },
    { label: 'Edit Author', href: `/dashboard/author/edit/${id}` },
  ];
  return (
    <AuthorForm
      form={form}
      breadcrumbItems={breadCrumb}
      headerTitle="Edit Author"
      submitButtonText="Update Author"
      loadingButtonText="Updating..."
      isSubmitting={updateAuthorMutation.isPending}
      onSubmit={onSubmit}
    />
  );
}
