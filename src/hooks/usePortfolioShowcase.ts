'use client';

import {
  useEffect,
  useMemo,
  useState,
} from 'react';
import { useQuery } from '@tanstack/react-query';
import { normalizeCategoryId } from '@/utils/product-category';
import {
  createPortfolioHash,
  getPortfolioProductCategoryId,
  normalizePortfolioSlugSegment,
  parsePortfolioHashSegments,
} from '@/utils/portfolio';
import {
  fetchPublishedProducts,
  fetchAllProductCategories,
  getFirstImage,
  ProductCategory,
  ProductItem,
} from 'hooks/useProducts';
import useHash from 'hooks/useHash';

const DEFAULT_HERO_IMAGE =
  'https://res.cloudinary.com/dj6kzchpv/image/upload/v1776839982/portfolio-bg_11zon_gm9zte.png';

const EMPTY_PRODUCTS: ProductItem[] = [];
const EMPTY_CATEGORIES: ProductCategory[] = [];

const usePortfolioShowcase = () => {
  const urlHash = useHash();
  const selectedHash = useMemo(
    () => (urlHash ? decodeURIComponent(urlHash) : ''),
    [urlHash],
  );
  const selectedHashParts = useMemo(
    () => parsePortfolioHashSegments(selectedHash),
    [selectedHash],
  );
  const [selectedCategoryId, setSelectedCategoryId] = useState('');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  const productsQuery = useQuery<ProductItem[], Error>({
    queryKey: ['portfolio-products'],
    queryFn: () => fetchPublishedProducts(),
    staleTime: 60 * 1000,
  });

  const categoriesQuery = useQuery<ProductCategory[], Error>({
    queryKey: ['portfolio-categories'],
    queryFn: () => fetchAllProductCategories(),
    staleTime: 5 * 60 * 1000,
  });

  const products = productsQuery.data ?? EMPTY_PRODUCTS;
  const apiCategories = useMemo(
    () =>
      (categoriesQuery.data ?? EMPTY_CATEGORIES).filter(
        (category) => category.is_published,
      ),
    [categoriesQuery.data],
  );

  const derivedCategories = useMemo(() => {
    const categoryMap = new Map<string, ProductCategory>();

    products.forEach((product) => {
      const categoryId = product.productCategory?.id ?? product.categoryId;
      const categoryName = product.productCategory?.name ?? product.category;

      if (!categoryId || categoryMap.has(categoryId)) return;

      categoryMap.set(categoryId, {
        id: categoryId,
        name: categoryName || 'Uncategorized',
        is_published: true,
        createdAt: product.createdAt,
        updatedAt: product.updatedAt,
        updatedBy: product.updatedBy,
      });
    });

    return Array.from(categoryMap.values()).sort((a, b) =>
      a.name.localeCompare(b.name),
    );
  }, [products]);

  const categories = useMemo(() => {
    const merged = new Map<string, ProductCategory>();

    apiCategories.forEach((category) => merged.set(category.id, category));
    derivedCategories.forEach((category) => {
      if (!merged.has(category.id)) {
        merged.set(category.id, category);
      }
    });

    return Array.from(merged.values()).sort((a, b) =>
      a.name.localeCompare(b.name),
    );
  }, [apiCategories, derivedCategories]);

  const visibleProducts = useMemo(() => {
    if (!selectedCategoryId) return products;

    return products.filter((product) => {
      const categoryId = product.productCategory?.id ?? product.categoryId;
      return categoryId === selectedCategoryId;
    });
  }, [products, selectedCategoryId]);

  const selectedProductFromHash = useMemo(() => {
    if (!selectedHash) return null;

    const normalizedHashCategory = normalizeCategoryId(
      selectedHashParts.categorySegment,
    );
    const normalizedHashSlug = normalizePortfolioSlugSegment(
      selectedHashParts.slugSegment || selectedHashParts.categorySegment,
    );
    const hasCategorySegment = Boolean(selectedHashParts.slugSegment);

    return (
      products.find((product) => {
        const productCategorySegment = normalizeCategoryId(
          getPortfolioProductCategoryId(product),
        );
        const productSlugSegment = normalizePortfolioSlugSegment(product.title);

        if (hasCategorySegment) {
          return (
            productSlugSegment === normalizedHashSlug &&
            (!normalizedHashCategory ||
              productCategorySegment === normalizedHashCategory)
          );
        }

        return productSlugSegment === normalizedHashSlug;
      }) ?? null
    );
  }, [products, selectedHash, selectedHashParts]);

  const selectedProduct = selectedProductFromHash ?? visibleProducts[0] ?? null;
  const selectedProductId = selectedProduct?.id ?? null;
  const selectedProductCategoryId =
    selectedProductFromHash?.productCategory?.id ??
    selectedProductFromHash?.categoryId ??
    '';

  useEffect(() => {
    if (!selectedProductCategoryId) return;

    if (selectedProductCategoryId !== selectedCategoryId) {
      setSelectedCategoryId(selectedProductCategoryId);
    }
  }, [selectedProductCategoryId, selectedCategoryId]);

  useEffect(() => {
    if (!selectedProductId) return;

    const frame = window.requestAnimationFrame(() => {
      document.getElementById('portfolio-hero')?.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
    });

    return () => window.cancelAnimationFrame(frame);
  }, [selectedProductId]);

  const updateHash = (hash: string | null, mode: 'push' | 'replace') => {
    if (typeof window === 'undefined') return;

    const nextUrl = hash
      ? `${window.location.pathname}#${hash}`
      : window.location.pathname;

    window.history[mode === 'push' ? 'pushState' : 'replaceState'](
      null,
      '',
      nextUrl,
    );
  };

  const handleCategoryChange = (nextCategoryId: string) => {
    setSelectedCategoryId(nextCategoryId);

    if (!nextCategoryId) {
      updateHash(null, 'replace');
      return;
    }

    const nextProduct = products.find((product) => {
      const categoryId = product.productCategory?.id ?? product.categoryId;
      return categoryId === nextCategoryId;
    });

    if (nextProduct) {
      updateHash(
        createPortfolioHash(nextCategoryId, nextProduct.title),
        'replace',
      );
      return;
    }

    updateHash(null, 'replace');
  };

  const handleSelectProject = (project: ProductItem) => {
    const categoryId = getPortfolioProductCategoryId(project);

    if (categoryId) {
      setSelectedCategoryId(categoryId);
    }

    updateHash(createPortfolioHash(categoryId, project.title), 'push');
  };

  const handleReset = () => {
    setSelectedCategoryId('');
    updateHash(null, 'replace');
  };

  const categoryLabel = selectedCategoryId
    ? categories.find((category) => category.id === selectedCategoryId)?.name ||
      selectedProduct?.productCategory?.name ||
      selectedProduct?.category ||
      'Projects'
    : 'All Projects';
  const heroHeadline = selectedProduct
    ? selectedProduct.title
    : selectedCategoryId
      ? `No projects found in ${categoryLabel}`
      : 'Browse live portfolio projects';
  const heroImage =
    (selectedProduct && getFirstImage(selectedProduct.images)) ||
    DEFAULT_HERO_IMAGE;

  const categoriesLoading =
    categoriesQuery.isLoading && categories.length === 0;
  const categoriesNotice =
    categoriesQuery.error instanceof Error
      ? 'Category API is unavailable right now, so the sidebar is leaning on categories inferred from the published projects.'
      : null;

  return {
    categories,
    categoriesLoading,
    categoriesNotice,
    categoryLabel,
    handleCategoryChange,
    handleReset,
    handleSelectProject,
    heroHeadline,
    heroImage,
    isSidebarCollapsed,
    products,
    productsError: productsQuery.error,
    productsLoading: productsQuery.isLoading,
    selectedCategoryId,
    selectedProduct,
    selectedProductId,
    setIsSidebarCollapsed,
    toggleSidebarCollapse: () =>
      setIsSidebarCollapsed((current) => !current),
    visibleProducts,
  };
};

export default usePortfolioShowcase;
