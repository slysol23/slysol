'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import UserForm, {
  UserFormValues,
  createUserFormDefaults,
  userAddFormSchema,
} from '@/components/Form/UserForm';
import { BreadcrumbItem } from '@/components/breadCrum';
import { showDashboardError } from '@/utils/dashboard-alert';

async function createUser(data: {
  name: string;
  email: string;
  password: string;
  isAdmin?: boolean;
}) {
  const res = await fetch('/api/user', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || 'Failed to create user');
  }

  return res.json();
}

export default function AddUserPage() {
  const router = useRouter();
  const queryClient = useQueryClient();

  const createUserMutation = useMutation({
    mutationFn: createUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      router.push('/dashboard/user?created=true');
    },
    onError: (error: any) => {
      void showDashboardError('Failed to create user: ' + error.message);
    },
  });

  const form = useForm<UserFormValues>({
    resolver: zodResolver(userAddFormSchema),
    defaultValues: createUserFormDefaults(),
  });

  const breadCrumb: BreadcrumbItem[] = [
    { label: 'Users', href: '/dashboard/user' },
    { label: 'Add User', href: '/dashboard/user/add' },
  ];

  const onSubmit = (data: UserFormValues) => {
    createUserMutation.mutate({
      name: data.name,
      email: data.email,
      password: data.password,
      isAdmin: data.isAdmin === 'yes',
    });
  };

  return (
    <UserForm
      form={form}
      breadcrumbItems={breadCrumb}
      headerTitle="Add New User"
      submitButtonText="Add User"
      loadingButtonText="Adding..."
      isSubmitting={createUserMutation.isPending}
      onSubmit={onSubmit}
      passwordPlaceholder="Enter password"
    />
  );
}
