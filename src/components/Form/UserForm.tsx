'use client';

import { z } from 'zod';
import { UseFormReturn } from 'react-hook-form';
import Breadcrumb, { BreadcrumbItem } from '@/components/breadCrum';
import { IUser } from 'lib/auth/type';
import DashboardButton from '../Button/DashboardButton';

const userFormSchemaBase = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  isAdmin: z.enum(['yes', 'no']),
});

export const userAddFormSchema = userFormSchemaBase;

export const userEditFormSchema = userFormSchemaBase.extend({
  password: z
    .string()
    .min(6, 'Password must be at least 6 characters')
    .optional()
    .or(z.literal('')),
});

export type UserFormValues = z.infer<typeof userFormSchemaBase>;

export const createUserFormDefaults = (isAdmin = false): UserFormValues => ({
  name: '',
  email: '',
  password: '',
  isAdmin: isAdmin ? 'yes' : 'no',
});

export const mapUserToFormValues = (
  user: Pick<IUser, 'name' | 'email' | 'isAdmin'>,
): UserFormValues => ({
  name: user.name ?? '',
  email: user.email ?? '',
  password: '',
  isAdmin: user.isAdmin ? 'yes' : 'no',
});

interface UserFormProps {
  form: UseFormReturn<UserFormValues>;
  breadcrumbItems: BreadcrumbItem[];
  headerTitle: string;
  submitButtonText: string;
  loadingButtonText?: string;
  isSubmitting: boolean;
  onSubmit: (data: UserFormValues) => void | Promise<void>;
  formId?: string;
  passwordPlaceholder?: string;
}

export default function UserForm({
  form,
  breadcrumbItems,
  headerTitle,
  submitButtonText,
  loadingButtonText = 'Saving...',
  isSubmitting,
  onSubmit,
  formId = 'user-form',
  passwordPlaceholder = 'Enter password',
}: UserFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = form;

  return (
    <div className="min-h-screen text-black flex flex-col w-full">
      <header className="border-b border-gray-200 pb-4 flex flex-col xs:flex-row xs:items-center xs:justify-between gap-2 xs:gap-4 w-full">
        <div>
          <h1 className="text-2xl font-bold text-black">{headerTitle}</h1>
          <div className="pt-4">
            <Breadcrumb items={breadcrumbItems} />
          </div>
        </div>
        <DashboardButton
          type="submit"
          success
          form={formId}
          disabled={isSubmitting}
        >
          {isSubmitting ? loadingButtonText : submitButtonText}
        </DashboardButton>
      </header>

      <form onSubmit={handleSubmit(onSubmit)} id={formId}>
        <div className="mt-4">
          <label className="block text-black font-medium mb-2">Name</label>
          <input
            type="text"
            {...register('name')}
            className="w-full p-3 rounded-lg border border-gray-300 text-black"
            placeholder="Enter user name"
          />
          {errors.name && (
            <p className="text-red-400 text-sm mt-1">{errors.name.message}</p>
          )}
        </div>

        <div className="mt-4">
          <label className="block text-black font-medium mb-2">Email</label>
          <input
            type="email"
            {...register('email')}
            className="w-full p-3 rounded-lg border border-gray-300 text-black"
            placeholder="Enter user email"
          />
          {errors.email && (
            <p className="text-red-400 text-sm mt-1">{errors.email.message}</p>
          )}
        </div>

        <div className="mt-4">
          <label className="block text-black font-medium mb-2">Password</label>
          <input
            type="password"
            {...register('password')}
            className="w-full p-3 rounded-lg border border-gray-300 text-black"
            placeholder={passwordPlaceholder}
          />
          {errors.password && (
            <p className="text-red-400 text-sm mt-1">
              {errors.password.message}
            </p>
          )}
        </div>

        <div className="flex flex-col gap-1 mt-4">
          <label className="text-black font-medium">Is Admin?</label>
          <select
            {...register('isAdmin')}
            className="w-full border border-gray-300 rounded-lg p-2 text-black"
          >
            <option value="no">No</option>
            <option value="yes">Yes</option>
          </select>
          {errors.isAdmin && (
            <p className="text-red-400 text-sm mt-1">
              {errors.isAdmin.message}
            </p>
          )}
        </div>
      </form>
    </div>
  );
}
