'use client';

import React from 'react';
import { useSyncExternalStore } from 'react';
import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import Image from 'next/image';
import { ChevronDownIcon } from '@heroicons/react/20/solid';
import MainHeading from '../MainHeading';
import SubTitle from '../SubTitle';
import RichTextPreview from './RichTextPreview';
import ProductDetail from './ProductDetail';
import { getTechStackLabel } from '@/utils/techstack';
import {
  getFirstImage,
  getStringList,
  ProductApiResponse,
  ProductItem,
  readResponse,
} from 'hooks/useProducts';

const fetchPublishedProducts = async (): Promise<ProductItem[]> => {
  const searchParams = new URLSearchParams({
    page: '1',
    limit: '100',
    published: 'true',
  });

  const response = await fetch(`/api/product?${searchParams.toString()}`, {
    cache: 'no-store',
  });

  const data = await readResponse<ProductApiResponse>(response);
  return data.data ?? [];
};

const createHashKey = (value: string) =>
  value
    .trim()
    .replace(/['"`]/g, '')
    .replace(/[^A-Za-z0-9]+/g, '_')
    .replace(/^_+|_+$/g, '');

const useHash = () => {
  return useSyncExternalStore(
    (callback) => {
      const notify = () => callback();

      window.addEventListener('hashchange', notify);
      window.addEventListener('popstate', notify);

      const originalPushState = window.history.pushState;
      const originalReplaceState = window.history.replaceState;

      window.history.pushState = function (...args) {
        originalPushState.apply(this, args);
        notify();
      };

      window.history.replaceState = function (...args) {
        originalReplaceState.apply(this, args);
        notify();
      };

      return () => {
        window.removeEventListener('hashchange', notify);
        window.removeEventListener('popstate', notify);
        window.history.pushState = originalPushState;
        window.history.replaceState = originalReplaceState;
      };
    },
    () =>
      typeof window !== 'undefined'
        ? window.location.hash.replace(/^#/, '')
        : '',
    () => '',
  );
};

const PortfolioCards = () => {
  const { data, isLoading, error } = useQuery<ProductItem[], Error>({
    queryKey: ['portfolio-products'],
    queryFn: fetchPublishedProducts,
    staleTime: 60 * 1000,
  });

  const products = React.useMemo(
    () => (data ?? []).filter((product) => product.is_published),
    [data],
  );

  const [selectedCategoryId, setSelectedCategoryId] = React.useState('');
  const selectedProductRef = React.useRef<HTMLDivElement | null>(null);

  // Get hash directly from URL - updates immediately when URL changes
  const urlHash = useHash();

  // Compute selectedHash from URL (decodes URI components)
  const selectedHash = React.useMemo(() => {
    return urlHash ? decodeURIComponent(urlHash) : '';
  }, [urlHash]);

  const categories = React.useMemo(() => {
    const categoryMap = new Map<string, { id: string; name: string }>();

    products.forEach((product) => {
      const categoryId = product.productCategory?.id ?? product.categoryId;
      const categoryName = product.productCategory?.name ?? product.category;

      if (!categoryId || categoryMap.has(categoryId)) return;

      categoryMap.set(categoryId, {
        id: categoryId,
        name: categoryName || 'Uncategorized',
      });
    });

    return Array.from(categoryMap.values()).sort((a, b) =>
      a.name.localeCompare(b.name),
    );
  }, [products]);

  React.useEffect(() => {
    if (!selectedCategoryId) return;

    const categoryExists = categories.some(
      (category) => category.id === selectedCategoryId,
    );

    if (!categoryExists) {
      setSelectedCategoryId('');
    }
  }, [categories, selectedCategoryId]);

  // Find selected product based on URL hash
  const selectedProduct = React.useMemo(() => {
    if (!selectedHash) return null;

    return (
      products.find(
        (product) => createHashKey(product.title) === selectedHash,
      ) ?? null
    );
  }, [products, selectedHash]);

  const selectedProductId = selectedProduct?.id;

  // Scroll to detail view when product is selected
  React.useEffect(() => {
    if (!selectedProductId) return;

    const frame = window.requestAnimationFrame(() => {
      selectedProductRef.current?.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
    });

    return () => window.cancelAnimationFrame(frame);
  }, [selectedProductId]);

  const visibleProducts = React.useMemo(() => {
    if (!selectedCategoryId) return products;

    return products.filter((product) => {
      const categoryId = product.productCategory?.id ?? product.categoryId;
      return categoryId === selectedCategoryId;
    });
  }, [products, selectedCategoryId]);

  const selectedCategory = categories.find(
    (category) => category.id === selectedCategoryId,
  );
  const dropdownLabel = selectedCategory?.name || 'All projects';

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div className="space-y-3">
            <SubTitle text="FILTER PROJECTS" />
            <MainHeading text="Portfolio Projects" className="mt-1" />
            <div className="h-4 w-80 max-w-full rounded-full bg-slate animate-pulse" />
          </div>
          <div className="h-14 w-full max-w-md rounded-2xl bg-slate animate-pulse" />
        </div>
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 6 }).map((_, index) => (
            <div
              key={index}
              className="animate-pulse overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm"
            >
              <div className="aspect-16/10 bg-slate" />
              <div className="space-y-3 p-4">
                <div className="h-6 w-3/4 rounded-full bg-slate" />
                <div className="h-3 w-1/2 rounded-full bg-slate" />
                <div className="space-y-2">
                  <div className="h-3 w-full rounded-full bg-slate" />
                  <div className="h-3 w-11/12 rounded-full bg-slate" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error instanceof Error) {
    return (
      <div className="rounded-4xl border border-red-200 bg-red-50 px-6 py-8 text-center text-sm text-red-700">
        Unable to load products: {error.message}
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="rounded-4xl border border-dashed border-slate-300 bg-white px-6 py-10 text-center">
        <SubTitle text="NO PROJECTS" />
        <MainHeading text="No published portfolio items yet" className="mt-2" />
        <p className="mt-3 text-sm leading-7 text-mute">
          Once a project is published in the backend, it will appear here as a
          clickable case study card.
        </p>
      </div>
    );
  }

  // Show detail view if hash matches a product
  if (selectedProduct) {
    return (
      <div ref={selectedProductRef} id={selectedHash} className="scroll-mt-28">
        <ProductDetail product={selectedProduct} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="max-w-3xl">
          <SubTitle text="FEATURED PROJECTS" />
          <MainHeading text={`${selectedCategory?.name || 'All'} Projects`} />
        </div>

        <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-sm">
          <label
            className="mb-2 block text-xs font-semibold uppercase tracking-[0.24em] text-mute"
            htmlFor="portfolio-category-select"
          >
            Select Category
          </label>
          <div className="relative">
            <select
              id="portfolio-category-select"
              value={selectedCategoryId}
              onChange={(event) => setSelectedCategoryId(event.target.value)}
              className="w-full appearance-none rounded-xl border border-slate-200 bg-slate px-4 py-3 pr-10 text-sm font-semibold text-dark outline-none transition focus:border-primary2 focus:bg-white"
            >
              <option value="">All projects</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
            <ChevronDownIcon className="pointer-events-none absolute right-3 top-1/2 h-5 w-5 -translate-y-1/2 text-mute" />
          </div>
        </div>
      </div>

      {visibleProducts.length === 0 ? (
        <div className="rounded-4xl border border-dashed border-slate-300 bg-white px-6 py-10 text-center">
          <SubTitle text="NO PROJECTS" />
          <MainHeading
            text={
              selectedCategoryId
                ? `${dropdownLabel} has no published projects`
                : 'No published portfolio items yet'
            }
            className="mt-2"
          />
          <p className="mt-3 text-sm leading-7 text-mute">
            {selectedCategoryId
              ? 'Try another category or switch back to all projects.'
              : 'Once a project is published in the backend, it will appear here as a clickable case study card.'}
          </p>
        </div>
      ) : (
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {visibleProducts.map((product) => {
            const firstImage = getFirstImage(product.images);
            const techStack = getStringList(product.techstack);
            const productHash = createHashKey(product.title);

            return (
              <Link
                key={product.id}
                href={`/portfolio#${encodeURIComponent(productHash)}`}
                scroll={false}
                className="group flex h-full flex-col overflow-hidden rounded-3xl border border-slate-200 bg-white text-left shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-lg"
              >
                <div className="relative aspect-16/10 overflow-hidden bg-slate">
                  {firstImage ? (
                    <Image
                      src={firstImage}
                      alt={product.title}
                      fill
                      unoptimized
                      className="object-cover transition duration-500 group-hover:scale-105"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center bg-linear-to-br from-slate to-white px-6 text-center text-sm text-black">
                      No image preview available
                    </div>
                  )}
                  <div className="absolute left-3 top-3 rounded-full bg-black/60 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.24em] text-white">
                    {product.productCategory?.name || product.category}
                  </div>
                </div>

                <div className="flex flex-1 flex-col gap-4 p-4">
                  <div>
                    <h3 className="max-w-2/3 truncate text-lg font-semibold text-dark transition group-hover:text-primary2">
                      {product.title}
                    </h3>
                  </div>

                  <RichTextPreview
                    value={product.description}
                    emptyMessage="Open this project to read the full details."
                    lines={2}
                    className="text-black"
                  />

                  <div className="mt-auto flex flex-wrap gap-2">
                    {techStack.slice(0, 3).map((tech) => (
                      <span
                        key={tech}
                        className="rounded-full bg-slate px-3 py-1 text-[11px] font-semibold text-dark"
                      >
                        {getTechStackLabel(tech)}
                      </span>
                    ))}
                    {techStack.length > 3 && (
                      <span className="rounded-full bg-slate px-3 py-1 text-[11px] font-semibold text-mute">
                        +{techStack.length - 3}
                      </span>
                    )}
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default PortfolioCards;
