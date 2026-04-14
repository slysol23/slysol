'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import ProductForm, {
  ProductFormData,
} from '../../../../components/Form/ProductForm';
import { useAddProduct } from 'hooks/useAddProduct';
import { BreadcrumbItem } from '@/components/breadCrum';

const productSchema = z.object({
  category_id: z.string().min(1, 'Category is required'),
  title: z.string().min(1, 'Title is required'),
  imagesText: z.string(),
  techstackText: z.string(),
  description: z.string().min(1, 'Description is required'),
  feedback: z.string().min(1, 'Feedback is required'),
  overview: z.string().min(1, 'Overview is required'),
  challenges: z.string().min(1, 'Challenges are required'),
  approach: z.string().min(1, 'Approach is required'),
  outcomes: z.string().min(1, 'Outcomes are required'),
});

export default function AddProductPage() {
  const { categories, categoriesLoading, createProductMutation } =
    useAddProduct();

  const form = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      category_id: '',
      title: '',
      imagesText: '',
      techstackText: '',
      description: '',
      feedback: '',
      overview: '',
      challenges: '',
      approach: '',
      outcomes: '',
    },
  });

  const onSubmit = (data: ProductFormData) => {
    // Transform data for API
    const payload = {
      ...data,
      images: data.imagesText.split('\n').filter(Boolean),
      techstack: data.techstackText.split('\n').filter(Boolean),
      updated_by: 'Current User', // Get from auth context
      is_published: false,
    };

    createProductMutation.mutate(payload);
  };

  const breadcrumb: BreadcrumbItem[] = [
    { label: 'Products', href: '/dashboard/product' },
    { label: 'Add Product', href: '/dashboard/product/add' },
  ];

  return (
    <ProductForm
      form={form}
      categories={categories}
      categoriesLoading={categoriesLoading}
      onSubmit={onSubmit}
      breadcrumbItems={breadcrumb}
      headerTitle="Add New Product"
      submitButtonText="Save Product"
      isSubmitting={createProductMutation.isPending}
    />
  );
}
