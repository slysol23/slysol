'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { author } from 'lib/author';
import { BreadcrumbItem } from '@/components/breadCrum';
import AuthorForm, {
  AuthorFormValues,
  authorFormSchema,
  createAuthorFormDefaults,
} from '@/components/Form/AuthorForm';
import { showDashboardError } from '@/utils/dashboard-alert';

export default function AddAuthorPage() {
  const router = useRouter();
  const queryClient = useQueryClient();

  const createAuthor = useMutation({
    mutationFn: async (data: AuthorFormValues) => {
      return await author.create(data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['authors'] });
      router.push('/dashboard/author?created=true');
    },
    onError: () => {
      void showDashboardError('Failed to create author');
    },
  });

  const form = useForm<AuthorFormValues>({
    resolver: zodResolver(authorFormSchema),
    mode: 'onChange',
    defaultValues: createAuthorFormDefaults(),
  });

  const onSubmit = (data: AuthorFormValues) => {
    createAuthor.mutate(data);
  };

  const breadCrumbItems: BreadcrumbItem[] = [
    { label: 'Authors', href: '/dashboard/author' },
    { label: 'Add Author', href: '/dashboard/author/add' },
  ];

  return (
    <AuthorForm
      form={form}
      breadcrumbItems={breadCrumbItems}
      headerTitle="Add New Author"
      submitButtonText="Add Author"
      loadingButtonText="Adding..."
      isSubmitting={createAuthor.isPending}
      onSubmit={onSubmit}
    />
  );
}
