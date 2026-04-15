import { useEffect, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useRouter, useSearchParams } from 'next/navigation';
import { toast } from 'react-toastify';

export interface ProductCategory {
  id: string;
  name: string;
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

export interface ProductCategoryResponse {
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

export const readResponse = async <T,>(response: Response): Promise<T> => {
  const payload = (await response.json().catch(() => null)) as
    | (T & ApiErrorPayload)
    | null;

  if (!response.ok) {
    throw new Error(payload?.message || payload?.error || 'Request failed');
  }

  return payload as T;
};

const fetchProducts = async (page: number) => {
  const response = await fetch(
    `/api/product?page=${page}&limit=${PAGE_SIZE}`,
    {
      cache: 'no-store',
    },
  );

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
    const created = searchParams.get('created');
    const updated = searchParams.get('updated');
    const published = searchParams.get('published');
    let shouldReplace = false;

    if (created === 'true') {
      toast.success('Product created successfully!', {
        autoClose: 3000,
        position: 'bottom-right',
      });
      shouldReplace = true;
    }

    if (updated === 'true') {
      toast.success('Product updated successfully!', {
        autoClose: 3000,
        position: 'bottom-right',
      });
      shouldReplace = true;
    }

    if (published === 'true') {
      toast.success('Product published successfully!', {
        autoClose: 3000,
        position: 'bottom-right',
      });
      shouldReplace = true;
    }

    if (published === 'false') {
      toast.success('Product moved to draft successfully!', {
        autoClose: 3000,
        position: 'bottom-right',
      });
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
      toast.success('Product deleted successfully!', {
        autoClose: 3000,
        position: 'bottom-right',
      });
    },
    onError: (mutationError: Error) => {
      toast.error(`Failed to delete product: ${mutationError.message}`, {
        autoClose: 3000,
        position: 'bottom-right',
      });
    },
  });

  const handleDelete = (id: number) => {
    if (!confirm('Are you sure you want to delete this product?')) return;
    deleteMutation.mutate(id);
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
    handleDelete,
  };
};
