'use client';

import { useEffect } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';
import ProductForm from '../../../../../components/Form/ProductForm';
import { useEditProduct } from 'hooks/useEditProduct';
import { BreadcrumbItem } from '@/components/breadCrum';
import DashboardButton from '@/components/Button/DashboardButton';
import { ProductEditFormSchema, ProductEditForm } from '@/utils/productForm';

export default function EditProductPage() {
  const {
    productId,
    userLoading,
    categories,
    categoriesLoading,
    product,
    productLoading,
    isError,
    error,
    updateProductMutation,
    publishProductMutation,
    togglePublish,
  } = useEditProduct();

  const form = useForm<ProductEditForm>({
    resolver: zodResolver(ProductEditFormSchema),
    defaultValues: {
      category_id: '',
      title: '',
      description: '',
      overview: '',
      challenges: '',
      approach: '',
      outcomes: '',
      feedback: '',
      imagesText: '',
      techstackText: '',
    },
  });

  useEffect(() => {
    if (product) {
      form.reset({
        category_id: product.productCategory?.name || product.category || '',
        title: product.title || '',
        description: product.description || '',
        overview: product.overview || '',
        challenges: product.challenges || '',
        approach: product.approach || '',
        outcomes: product.outcomes || '',
        feedback: product.feedback || '',
        imagesText: Array.isArray(product.images)
          ? product.images.join('\n')
          : '',
        techstackText: Array.isArray(product.techstack)
          ? product.techstack.join('\n')
          : '',
      });
    }
  }, [product, form]);

  if (userLoading || productLoading) {
    return (
      <SkeletonTheme baseColor="#e5e7eb" highlightColor="#f3f4f6">
        <div className="min-h-screen text-black flex flex-col">
          <header className="border-b border-gray-200 pb-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-4 w-full">
            <div className="flex-1 min-w-0 space-y-3">
              <Skeleton height={28} width={220} borderRadius={8} />
              <Skeleton height={16} width={160} borderRadius={9999} />
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <Skeleton height={40} width={128} borderRadius={8} />
              <Skeleton height={40} width={112} borderRadius={8} />
            </div>
          </header>

          <main className="flex-1 py-4 space-y-6">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-3">
                <Skeleton height={16} width={80} borderRadius={6} />
                <Skeleton height={48} borderRadius={8} />
              </div>
              <div className="space-y-3">
                <Skeleton height={16} width={96} borderRadius={6} />
                <Skeleton height={48} borderRadius={8} />
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-3">
                <Skeleton height={16} width={64} borderRadius={6} />
                <Skeleton height={220} borderRadius={8} />
              </div>
              <div className="space-y-3">
                <Skeleton height={16} width={92} borderRadius={6} />
                <Skeleton height={220} borderRadius={8} />
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-3">
                <Skeleton height={16} width={96} borderRadius={6} />
                <Skeleton height={260} borderRadius={8} />
              </div>
              <div className="space-y-3">
                <Skeleton height={16} width={72} borderRadius={6} />
                <Skeleton height={260} borderRadius={8} />
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-3">
                <Skeleton height={16} width={88} borderRadius={6} />
                <Skeleton height={260} borderRadius={8} />
              </div>
              <div className="space-y-3">
                <Skeleton height={16} width={76} borderRadius={6} />
                <Skeleton height={260} borderRadius={8} />
              </div>
            </div>
          </main>
        </div>
      </SkeletonTheme>
    );
  }

  if (!product || isError) {
    return (
      <p className="text-red-500 p-4">
        Error: {error?.message || 'Product not found'}
      </p>
    );
  }

  const breadcrumb: BreadcrumbItem[] = [
    { label: 'Products', href: '/dashboard/product' },
    {
      label: `Edit ${product.title}`,
      href: `/dashboard/product/edit/${productId}`,
    },
  ];

  const onSubmit = (data: ProductEditForm) => {
    updateProductMutation.mutate(data);
  };

  return (
    <ProductForm
      form={form}
      categories={categories}
      categoriesLoading={categoriesLoading}
      onSubmit={onSubmit}
      breadcrumbItems={breadcrumb}
      headerTitle={`Edit ${product.title}`}
      submitButtonText="Update Product"
      isSubmitting={updateProductMutation.isPending}
      initialCategoryId={product.categoryId}
      initialImages={Array.isArray(product.images) ? product.images : ['']}
      initialTechStack={
        Array.isArray(product.techstack) ? product.techstack : []
      }
      headerActions={
        <DashboardButton
          onClick={togglePublish}
          disabled={publishProductMutation.isPending}
        >
          {publishProductMutation.isPending
            ? 'Updating...'
            : product.is_published
              ? 'Move To Draft'
              : 'Publish'}
        </DashboardButton>
      }
      statusBadge={
        product.is_published
          ? { text: 'Published', className: 'bg-green-100 text-green-800' }
          : { text: 'Draft', className: 'bg-yellow-100 text-yellow-800' }
      }
    />
  );
}
