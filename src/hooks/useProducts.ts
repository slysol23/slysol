import { useEffect, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useRouter, useSearchParams } from 'next/navigation';
import { PRODUCT_CATEGORY_PAGE_SIZE } from '@/utils/product-category';
import {
  confirmDashboardAction,
  showDashboardError,
  showDashboardSuccess,
} from '@/utils/dashboard-alert';

export interface ProductCategory {
  id: string;
  name: string;
  is_published: boolean;
  createdAt: string;
  updatedAt: string;
  updatedBy: string | null;
}

export interface ProductItem {
  id: number;
  title: string;
  category: string;
  categoryId: string;
  images: unknown;
  techstack: unknown;
  description: string;
  overview: string;
  challenges: string;
  approach: string;
  outcomes: string;
  feedback: string;
  is_published: boolean;
  createdAt: string;
  updatedAt: string;
  updatedBy: string | null;
  productCategory?: ProductCategory | null;
}

export interface ProductApiResponse {
  message: string;
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  count: number;
  data: ProductItem[];
}

export interface ProductResponse {
  data: ProductItem;
}

export interface ProductCategoryMeta {
  records: number;
  page: number;
  limit: number;
  total_pages: number;
}

export interface ProductCategoryResponse {
  message: string;
  meta: ProductCategoryMeta;
  data: ProductCategory[];
}

interface ApiErrorPayload {
  message?: string;
  error?: string;
}

export const PAGE_SIZE = 10;

export const getStringList = (value: unknown) => {
  if (!Array.isArray(value)) return [];

  return value.filter(
    (item): item is string =>
      typeof item === 'string' && item.trim().length > 0,
  );
};

export const getFirstImage = (value: unknown) => getStringList(value)[0] || '';

export const formatDate = (value?: string | null) => {
  if (!value) return '-';

  return new Date(value).toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'numeric',
    year: 'numeric',
  });
};

export const readResponse = async <T>(response: Response): Promise<T> => {
  const payload = (await response.json().catch(() => null)) as
    | (T & ApiErrorPayload)
    | null;

  if (!response.ok) {
    throw new Error(payload?.message || payload?.error || 'Request failed');
  }

  return payload as T;
};

export const categoriesPage = async (
  page = 1,
  limit = PRODUCT_CATEGORY_PAGE_SIZE,
) => {
  const response = await fetch(
    `/api/product-category?page=${page}&limit=${limit}`,
    {
      cache: 'no-store',
    },
  );

  return readResponse<ProductCategoryResponse>(response);
};

export const fetchAllProductCategories = async (
  limit = PRODUCT_CATEGORY_PAGE_SIZE,
): Promise<ProductCategory[]> => {
  const firstPage = await categoriesPage(1, limit);
  const totalPages = firstPage.meta?.total_pages ?? 0;

  if (totalPages <= 1) {
    return firstPage.data ?? [];
  }

  const remainingPages = await Promise.all(
    Array.from({ length: totalPages - 1 }, (_, index) =>
      categoriesPage(index + 2, limit),
    ),
  );

  return [
    ...(firstPage.data ?? []),
    ...remainingPages.flatMap((page) => page.data ?? []),
  ];
};

export const fetchPublishedProducts = async (
  limit = 100,
): Promise<ProductItem[]> => {
  const searchParams = new URLSearchParams({
    page: '1',
    limit: String(limit),
    published: 'true',
  });

  const response = await fetch(`/api/product?${searchParams.toString()}`, {
    cache: 'no-store',
  });

  const data = await readResponse<ProductApiResponse>(response);
  return data.data ?? [];
};

const fetchProducts = async (page: number) => {
  const response = await fetch(`/api/product?page=${page}&limit=${PAGE_SIZE}`, {
    cache: 'no-store',
  });

  return readResponse<ProductApiResponse>(response);
};

const deleteProduct = async (id: number) => {
  const response = await fetch(`/api/product/${id}`, {
    method: 'DELETE',
  });

  return readResponse<{ message: string }>(response);
};

export const useProductsPage = () => {
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);
  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    const created = searchParams?.get('created');
    const updated = searchParams?.get('updated');
    const published = searchParams?.get('published');
    let shouldReplace = false;

    if (created === 'true') {
      void showDashboardSuccess('Product created successfully!');
      shouldReplace = true;
    }

    if (updated === 'true') {
      void showDashboardSuccess('Product updated successfully!');
      shouldReplace = true;
    }

    if (published === 'true') {
      void showDashboardSuccess('Product published successfully!');
      shouldReplace = true;
    }

    if (published === 'false') {
      void showDashboardSuccess('Product moved to draft successfully!');
      shouldReplace = true;
    }

    if (shouldReplace) {
      router.replace('/dashboard/product', { scroll: false });
    }
  }, [searchParams, router]);

  const { data, isLoading, error, isFetching } = useQuery<
    ProductApiResponse,
    Error
  >({
    queryKey: ['products', page],
    queryFn: () => fetchProducts(page),
  });

  const deleteMutation = useMutation({
    mutationFn: deleteProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      void showDashboardSuccess('Product deleted successfully!');
    },
    onError: (mutationError: Error) => {
      void showDashboardError(`Failed to delete product: ${mutationError.message}`);
    },
  });

  const publishMutation = useMutation({
    mutationFn: async ({
      id,
      nextPublished,
    }: {
      id: number;
      nextPublished: boolean;
    }) => {
      const response = await fetch(`/api/product/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          is_published: nextPublished,
        }),
      });

      return readResponse<{ message: string }>(response);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      router.push(`/dashboard/product?published=${variables.nextPublished}`);
    },
    onError: (mutationError: Error) => {
      void showDashboardError(
        `Failed to update publish status: ${mutationError.message}`,
      );
    },
  });

  const handleDelete = async (id: number) => {
    const confirmed = await confirmDashboardAction({
      title: 'Delete product?',
      text: 'Are you sure you want to delete this product?',
      confirmButtonText: 'Delete',
    });

    if (!confirmed) return;
    deleteMutation.mutate(id);
  };

  const handleTogglePublish = async (id: number, currentStatus: boolean) => {
    const action = currentStatus
      ? 'unpublish this product'
      : 'publish this product';
    const confirmed = await confirmDashboardAction({
      title: `${currentStatus ? 'Unpublish' : 'Publish'} product?`,
      text: `Are you sure you want to ${action}?`,
      confirmButtonText: currentStatus ? 'Unpublish' : 'Publish',
    });

    if (!confirmed) return;

    publishMutation.mutate({
      id,
      nextPublished: !currentStatus,
    });
  };

  return {
    page,
    setPage,
    data,
    products: data?.data ?? [],
    totalPages: data?.totalPages ?? 1,
    isLoading,
    error,
    isFetching,
    deleteMutation,
    publishMutation,
    handleDelete,
    handleTogglePublish,
  };
};
