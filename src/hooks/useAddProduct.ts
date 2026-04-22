import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { useUser } from 'hooks/useUser';
import {
  fetchAllProductCategories,
  readResponse,
} from 'hooks/useProducts';
import {
  ProductCreateForm,
  ProductCreateFormSchema,
  parseMultilineList,
  parseTechStackList,
} from '@/utils/productForm';
import {
  normalizeCategoryId,
  normalizeCategoryName,
} from '@/utils/product-category';
import { showDashboardError } from '@/utils/dashboard-alert';

const fetchCategories = async () => {
  return fetchAllProductCategories();
};

export const useAddProduct = () => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { user, isLoading: userLoading } = useUser();

  const { data: categories = [], isLoading: categoriesLoading } = useQuery({
    queryKey: ['product-categories'],
    queryFn: fetchCategories,
  });

  const createProductMutation = useMutation({
    mutationFn: async (data: ProductCreateForm) => {
      const normalizedCategoryName = normalizeCategoryName(data.category_id);
      const normalizedCategoryId = normalizeCategoryId(normalizedCategoryName);

      if (!normalizedCategoryId) {
        throw new Error(
          'Invalid category name. Please use at least one letter.',
        );
      }

      const categoryExists = categories.some(
        (category) => category.id === normalizedCategoryId,
      );

      if (!categoryExists) {
        const categoryResponse = await fetch('/api/product-category', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            name: normalizedCategoryName,
          }),
        });

        if (!categoryResponse.ok && categoryResponse.status !== 409) {
          await readResponse(categoryResponse);
        }
      }

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
        updated_by: user?.name?.trim() || 'Dashboard User',
        is_published: !!data.is_published,
      };

      const response = await fetch('/api/product', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      return readResponse(response);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      queryClient.invalidateQueries({ queryKey: ['product-categories'] });
      router.push('/dashboard/product?created=true');
    },
    onError: (error: Error) => {
      void showDashboardError(`Failed to create product: ${error.message}`);
    },
  });

  const form = useForm<ProductCreateForm>({
    resolver: zodResolver(ProductCreateFormSchema),
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
      is_published: false,
    },
    mode: 'onChange',
  });

  const onSubmit = (data: ProductCreateForm) => {
    createProductMutation.mutate(data);
  };

  return {
    user,
    userLoading,
    categories,
    categoriesLoading,
    createProductMutation,
    onSubmit,
    ...form,
  };
};
