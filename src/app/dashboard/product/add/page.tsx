'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import ProductForm, {
  ProductFormData,
} from '../../../../components/Form/ProductForm';
import { useAddProduct } from 'hooks/useAddProduct';
import { BreadcrumbItem } from '@/components/breadCrum';
import { ProductCreateFormSchema } from '@/utils/productForm';

export default function AddProductPage() {
  const { categories, categoriesLoading, createProductMutation } =
    useAddProduct();

  const form = useForm<ProductFormData>({
    resolver: zodResolver(ProductCreateFormSchema),
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
    mode: 'onChange',
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
