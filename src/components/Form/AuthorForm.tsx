'use client';

import { UseFormReturn } from 'react-hook-form';
import { z } from 'zod';
import Breadcrumb, { BreadcrumbItem } from '@/components/breadCrum';
import { IAuthor } from 'lib/type';
import DashboardButton from '../Button/DashboardButton';

export const authorFormSchema = z.object({
  firstName: z.string().min(2, 'First name must be at least 2 characters'),
  lastName: z.string().min(2, 'Last name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
});

export type AuthorFormValues = z.infer<typeof authorFormSchema>;

export const createAuthorFormDefaults = (): AuthorFormValues => ({
  firstName: '',
  lastName: '',
  email: '',
});

export const mapAuthorToFormValues = (
  author: Pick<IAuthor, 'firstName' | 'lastName' | 'email'>,
): AuthorFormValues => ({
  firstName: author.firstName ?? '',
  lastName: author.lastName ?? '',
  email: author.email ?? '',
});

interface AuthorFormProps {
  form: UseFormReturn<AuthorFormValues>;
  breadcrumbItems: BreadcrumbItem[];
  headerTitle: string;
  submitButtonText: string;
  loadingButtonText?: string;
  isSubmitting: boolean;
  onSubmit: (data: AuthorFormValues) => void | Promise<void>;
  formId?: string;
}

export default function AuthorForm({
  form,
  breadcrumbItems,
  headerTitle,
  submitButtonText,
  loadingButtonText = 'Saving...',
  isSubmitting,
  onSubmit,
  formId = 'author-form',
}: AuthorFormProps) {
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

      <main className="flex-1 py-4 w-full">
        <form onSubmit={handleSubmit(onSubmit)} id={formId} className="w-full">
          <div>
            <label className="block text-black font-medium mb-2">
              First Name
            </label>
            <input
              type="text"
              {...register('firstName')}
              className="w-full p-3 rounded-lg border border-gray-300 text-black focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter first name"
            />
            {errors.firstName && (
              <p className="text-red-500 text-sm mt-1">
                {errors.firstName.message}
              </p>
            )}
          </div>

          <div className="mt-4">
            <label className="block text-black font-medium mb-2">
              Last Name
            </label>
            <input
              type="text"
              {...register('lastName')}
              className="w-full p-3 rounded-lg border border-gray-300 text-black focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter last name"
            />
            {errors.lastName && (
              <p className="text-red-500 text-sm mt-1">
                {errors.lastName.message}
              </p>
            )}
          </div>

          <div className="mt-4">
            <label className="block text-black font-medium mb-2">Email</label>
            <input
              type="email"
              {...register('email')}
              className="w-full p-3 rounded-lg border border-gray-300 text-black focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter author email"
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">
                {errors.email.message}
              </p>
            )}
          </div>
        </form>
      </main>
    </div>
  );
}
