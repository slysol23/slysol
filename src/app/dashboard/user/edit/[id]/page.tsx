'use client';

import { useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Resolver, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { user } from 'lib/user';
import { IUser } from 'lib/type';
import UserForm, {
  UserFormValues,
  createUserFormDefaults,
  mapUserToFormValues,
  userEditFormSchema,
} from '@/components/Form/UserForm';
import { BreadcrumbItem } from '@/components/breadCrum';
import { toast } from 'react-toastify';

export default function EditUserPage() {
  const router = useRouter();
  const params = useParams();
  const queryClient = useQueryClient();
  const id = Number(params.id);

  const {
    data: u,
    isLoading,
    isError,
    error,
  } = useQuery<IUser | undefined>({
    queryKey: ['user', id],
    queryFn: async () => {
      const res = await user.getById(id);
      return res?.data;
    },
    enabled: !isNaN(id),
  });

  const updateUser = useMutation({
    mutationFn: async (data: UserFormValues) => {
      const payload: Partial<IUser> & { password?: string } = {
        name: data.name,
        email: data.email,
        isAdmin: data.isAdmin === 'yes',
      };

      if (data.password && data.password.trim() !== '') {
        payload.password = data.password;
      }

      return await user.update(id, payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      router.push('/dashboard/user?updated=true');
    },
    onError: (error: any) => {
      toast.error('Failed to update user: ' + error.message, {
        autoClose: 3000,
      });
    },
  });

  const form = useForm<UserFormValues>({
    resolver: zodResolver(userEditFormSchema) as Resolver<UserFormValues>,
    defaultValues: createUserFormDefaults(),
  });

  useEffect(() => {
    if (u) {
      form.reset(mapUserToFormValues(u));
    }
  }, [u, form]);

  const onSubmit = (data: UserFormValues) => updateUser.mutate(data);

  if (isLoading)
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-600">
        Loading user...
      </div>
    );
  if (isError)
    return (
      <div className="min-h-screen flex items-center justify-center text-red-600">
        {(error as Error)?.message || 'Failed to load user'}
      </div>
    );

  const breadCrumb: BreadcrumbItem[] = [
    { label: 'Users', href: '/dashboard/user' },
    { label: 'Edit User', href: `/dashboard/user/edit/${id}` },
  ];

  return (
    <UserForm
      form={form}
      breadcrumbItems={breadCrumb}
      headerTitle="Edit User"
      submitButtonText="Update User"
      loadingButtonText="Updating..."
      isSubmitting={updateUser.isPending}
      onSubmit={onSubmit}
      passwordPlaceholder="Leave blank to keep current password"
    />
  );
}
