import { useEffect } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useParams, useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { useUser } from 'hooks/useUser';
import {
  ProductCategoryResponse,
  ProductItem,
  ProductResponse,
  getStringList,
  readResponse,
} from 'hooks/useProducts';
import {
  ProductEditForm,
  ProductEditFormSchema,
  parseMultilineList,
  parseTechStackList,
} from '@/utils/productForm';
import { normalizeCategoryName } from '@/utils/product-category';

const fetchCategories = async () => {
  const response = await fetch('/api/product-category', {
    cache: 'no-store',
  });

  const data = await readResponse<ProductCategoryResponse>(response);
  return data.data ?? [];
};

const fetchProduct = async (productId: number) => {
  const response = await fetch(`/api/product/${productId}`, {
    cache: 'no-store',
  });

  const data = await readResponse<ProductResponse>(response);
  return data.data;
};

export const useEditProduct = () => {
  const params = useParams();
  const router = useRouter();
  const queryClient = useQueryClient();
  const { user, isLoading: userLoading } = useUser();
  const productId = Number(params?.id);

  const { data: categories = [], isLoading: categoriesLoading } = useQuery({
    queryKey: ['product-categories'],
    queryFn: fetchCategories,
  });

  const {
    data: product,
    isLoading: productLoading,
    isError,
    error,
  } = useQuery<ProductItem, Error>({
    queryKey: ['product', productId],
    queryFn: () => fetchProduct(productId),
    enabled: !Number.isNaN(productId),
  });

  const updateProductMutation = useMutation({
    mutationFn: async (data: ProductEditForm) => {
      const normalizedCategoryName = normalizeCategoryName(data.category_id);

      const payload = {
        category_id: normalizedCategoryName,
        title: data.title.trim(),
        images: parseMultilineList(data.imagesText),
        overview: data.overview.trim(),
        challenges: data.challenges.trim(),
        approach: data.approach.trim(),
        outcomes: data.outcomes.trim(),
        feedback: data.feedback.trim(),
        techstack: parseTechStackList(data.techstackText),
        description: data.description.trim(),
        updated_by:
          user?.name?.trim() || product?.updatedBy || 'Dashboard User',
        is_published: product?.is_published ?? false,
      };

      const response = await fetch(`/api/product/${productId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      return readResponse(response);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      queryClient.invalidateQueries({ queryKey: ['product', productId] });
      queryClient.invalidateQueries({ queryKey: ['product-categories'] });
      router.push('/dashboard/product?updated=true');
    },
    onError: (mutationError: Error) => {
      toast.error(`Failed to update product: ${mutationError.message}`, {
        autoClose: 3000,
        position: 'bottom-right',
      });
    },
  });

  const publishProductMutation = useMutation({
    mutationFn: async (nextIsPublished: boolean) => {
      const response = await fetch(`/api/product/${productId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          is_published: nextIsPublished,
        }),
      });

      return readResponse(response);
    },
    onSuccess: (_, nextIsPublished) => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      queryClient.invalidateQueries({ queryKey: ['product', productId] });
      router.push(`/dashboard/product?published=${nextIsPublished}`);
    },
    onError: (mutationError: Error) => {
      toast.error(`Failed to update publish status: ${mutationError.message}`, {
        autoClose: 3000,
        position: 'bottom-right',
      });
    },
  });

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
    mode: 'onChange',
  });

  useEffect(() => {
    if (!product) return;

    form.reset({
      category_id: product.productCategory?.name || product.category || '',
      title: product.title || '',
      description: product.description || '',
      overview: product.overview || '',
      challenges: product.challenges || '',
      approach: product.approach || '',
      outcomes: product.outcomes || '',
      feedback: product.feedback || '',
      imagesText: getStringList(product.images).join('\n'),
      techstackText: getStringList(product.techstack).join('\n'),
    });
  }, [product, form]);

  const onSubmit = (data: ProductEditForm) => {
    updateProductMutation.mutate(data);
  };

  const togglePublish = () => {
    if (!product) return;

    const nextIsPublished = !product.is_published;
    const action = nextIsPublished
      ? 'publish this product'
      : 'move this product to draft';

    if (!confirm(`Are you sure you want to ${action}?`)) return;
    publishProductMutation.mutate(nextIsPublished);
  };

  return {
    productId,
    user,
    userLoading,
    categories,
    categoriesLoading,
    product,
    productLoading,
    isError,
    error,
    updateProductMutation,
    publishProductMutation,
    onSubmit,
    togglePublish,
    ...form,
  };
};
