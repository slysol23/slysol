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
  feedback: z.string().trim().default(''),
  overview: z.string().min(1, 'Overview is required'),
  challenges: z.string().trim().default(''),
  approach: z.string().trim().default(''),
  outcomes: z.string().trim().default(''),
  is_published: z.boolean().default(false),
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
      is_published: false,
    },
  });

  const onSubmit = (data: ProductFormData) => {
    createProductMutation.mutate(data);
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
