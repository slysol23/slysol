'use client';

import React, { useEffect, useRef, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import Image from 'next/image';
import {
  ChevronDownIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from '@heroicons/react/20/solid';
import MainHeading from '../MainHeading';
import PortfolioTabs from './Tabs';
import RichTextPreview from './RichTextPreview';
import SubTitle from '../SubTitle';
import { getTechStackLabel } from '@/utils/techstack';
import {
  getFirstImage,
  getStringList,
  fetchAllProductCategories,
  ProductApiResponse,
  ProductCategory,
  ProductItem,
  readResponse,
} from 'hooks/useProducts';

const EMPTY_CATEGORIES: ProductCategory[] = [];
const EMPTY_PRODUCTS: ProductItem[] = [];

const fetchCategories = async (): Promise<ProductCategory[]> => {
  return fetchAllProductCategories();
};

const fetchProducts = async (categoryId: string): Promise<ProductItem[]> => {
  const searchParams = new URLSearchParams({
    page: '1',
    limit: '100',
    published: 'true',
  });

  if (categoryId) {
    searchParams.set('categoryId', categoryId);
  }

  const response = await fetch(`/api/product?${searchParams.toString()}`, {
    cache: 'no-store',
  });

  const data = await readResponse<ProductApiResponse>(response);
  return data.data ?? [];
};

const LoadingBlock = () => (
  <div className="animate-pulse space-y-4">
    <div className="aspect-video rounded-[1.75rem] bg-white/70" />
    <div className="flex flex-wrap gap-2">
      <div className="h-7 w-28 rounded-full bg-white/70" />
      <div className="h-7 w-24 rounded-full bg-white/70" />
      <div className="h-7 w-20 rounded-full bg-white/70" />
    </div>
    <div className="h-8 w-3/4 rounded-2xl bg-white/70" />
    <div className="space-y-2">
      <div className="h-3 w-full rounded bg-white/70" />
      <div className="h-3 w-11/12 rounded bg-white/70" />
      <div className="h-3 w-10/12 rounded bg-white/70" />
    </div>
    <div className="flex flex-wrap gap-2">
      <div className="h-8 w-20 rounded-full bg-white/70" />
      <div className="h-8 w-24 rounded-full bg-white/70" />
      <div className="h-8 w-28 rounded-full bg-white/70" />
    </div>
  </div>
);

const PortfolioShowcase = () => {
  const heroRef = useRef<HTMLDivElement>(null);
  const [selectedCategoryId, setSelectedCategoryId] = useState('');
  const [activeProductId, setActiveProductId] = useState<number | null>(null);
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  const categoriesQuery = useQuery<ProductCategory[], Error>({
    queryKey: ['portfolio-categories'],
    queryFn: fetchCategories,
    staleTime: 5 * 60 * 1000,
  });

  const categories = categoriesQuery.data ?? EMPTY_CATEGORIES;

  useEffect(() => {
    if (!selectedCategoryId) return;

    const categoryExists = categories.some(
      (category) => category.id === selectedCategoryId,
    );

    if (!categoryExists) {
      setSelectedCategoryId('');
    }
  }, [categories, selectedCategoryId]);

  const productsQuery = useQuery<ProductItem[], Error>({
    queryKey: ['portfolio-products', selectedCategoryId || 'all'],
    queryFn: () => fetchProducts(selectedCategoryId),
    staleTime: 60 * 1000,
  });

  const products = productsQuery.data ?? EMPTY_PRODUCTS;
  const publishedProducts = React.useMemo(
    () => products.filter((product) => product.is_published),
    [products],
  );

  useEffect(() => {
    setActiveProductId(null);
    setActiveImageIndex(0);
  }, [selectedCategoryId]);

  useEffect(() => {
    if (publishedProducts.length === 0) {
      setActiveProductId(null);
      return;
    }

    setActiveProductId((current) => {
      if (
        current &&
        publishedProducts.some((product) => product.id === current)
      ) {
        return current;
      }

      return publishedProducts[0].id;
    });
  }, [publishedProducts]);

  const activeProduct =
    publishedProducts.find((product) => product.id === activeProductId) ??
    publishedProducts[0] ??
    null;

  const activeImages = activeProduct ? getStringList(activeProduct.images) : [];
  const mainImage = activeImages[activeImageIndex] ?? activeImages[0] ?? '';
  const selectedCategory = categories.find(
    (category) => category.id === selectedCategoryId,
  );
  const filterLabel = selectedCategoryId
    ? selectedCategory?.name || 'Selected category'
    : 'All products';
  const techStack = activeProduct ? getStringList(activeProduct.techstack) : [];

  useEffect(() => {
    setActiveImageIndex(0);
  }, [activeProduct?.id]);

  const handleCategoryChange = (
    event: React.ChangeEvent<HTMLSelectElement>,
  ) => {
    setSelectedCategoryId(event.target.value);
  };

  const handleSelectProduct = (productId: number) => {
    setActiveProductId(productId);
    setActiveImageIndex(0);
    heroRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const handlePrevImage = () => {
    if (activeImages.length <= 1) return;

    setActiveImageIndex(
      (current) => (current - 1 + activeImages.length) % activeImages.length,
    );
  };

  const handleNextImage = () => {
    if (activeImages.length <= 1) return;

    setActiveImageIndex((current) => (current + 1) % activeImages.length);
  };

  return (
    <section
      ref={heroRef}
      className="relative overflow-hidden rounded-[2.25rem] border border-slate-200 bg-white/95 p-4 shadow-[0_30px_100px_rgba(15,23,42,0.08)] sm:p-6"
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(69,90,181,0.10),transparent_30%),radial-gradient(circle_at_bottom_right,rgba(235,87,123,0.10),transparent_28%)]" />

      <div className="relative z-10">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-3xl">
            <SubTitle text="FILTER BY CATEGORY" />
            <MainHeading
              text="Browse all published products or narrow them down by category"
              className="mt-2"
            />
            <p className="mt-3 max-w-2xl text-sm leading-7 text-mute">
              Start with every published product, then use the dropdown to focus
              on one backend category and explore its API-powered tabs.
            </p>
          </div>

          <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-sm">
            <label
              className="mb-2 block text-xs font-semibold uppercase tracking-[0.24em] text-mute"
              htmlFor="portfolio-category-select"
            >
              Category
            </label>
            <div className="relative">
              <select
                id="portfolio-category-select"
                value={selectedCategoryId}
                onChange={handleCategoryChange}
                disabled={categoriesQuery.isLoading}
                className="w-full appearance-none rounded-xl border border-slate-200 bg-slate px-4 py-3 pr-10 text-sm font-semibold text-dark outline-none transition focus:border-primary2 focus:bg-white disabled:cursor-not-allowed disabled:opacity-60"
              >
                <option value="">All products</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
              <ChevronDownIcon className="pointer-events-none absolute right-3 top-1/2 h-5 w-5 -translate-y-1/2 text-mute" />
            </div>
            <p className="mt-2 text-xs text-mute">
              {categoriesQuery.isLoading
                ? 'Loading categories from the backend...'
                : `${categories.length} categories loaded`}
            </p>
          </div>
        </div>

        {categoriesQuery.error instanceof Error && (
          <div className="mt-4 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            Unable to load categories: {categoriesQuery.error.message}
          </div>
        )}

        <div className="mt-8 grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
          <div
            className="rounded-4xl bg-slate p-4 sm:p-6"
            aria-busy={productsQuery.isLoading}
          >
            {productsQuery.isLoading && !activeProduct ? (
              <LoadingBlock />
            ) : activeProduct ? (
              <div className="space-y-5">
                <div className="space-y-4">
                  <div className="relative overflow-hidden rounded-[1.75rem] bg-white shadow-lg">
                    {mainImage ? (
                      <Image
                        src={mainImage}
                        alt={activeProduct.title}
                        width={1400}
                        height={900}
                        unoptimized
                        className="h-80 w-full object-cover sm:h-95"
                      />
                    ) : (
                      <div className="flex h-80 items-center justify-center bg-linear-to-br from-white to-slate-200 px-8 text-center text-sm text-mute sm:h-95">
                        No preview image is available for this project yet.
                      </div>
                    )}

                    {activeImages.length > 1 && (
                      <div className="absolute inset-x-4 top-4 flex items-center justify-between">
                        <button
                          type="button"
                          onClick={handlePrevImage}
                          className="rounded-full bg-white/90 p-2 text-dark shadow-md transition hover:bg-primary2 hover:text-white"
                          aria-label="Previous project image"
                        >
                          <ChevronLeftIcon className="h-5 w-5" />
                        </button>
                        <button
                          type="button"
                          onClick={handleNextImage}
                          className="rounded-full bg-white/90 p-2 text-dark shadow-md transition hover:bg-primary2 hover:text-white"
                          aria-label="Next project image"
                        >
                          <ChevronRightIcon className="h-5 w-5" />
                        </button>
                      </div>
                    )}
                  </div>

                  {activeImages.length > 1 && (
                    <div className="flex gap-3 overflow-x-auto pb-1">
                      {activeImages.map((image, index) => {
                        const active = index === activeImageIndex;

                        return (
                          <button
                            key={`${image}-${index}`}
                            type="button"
                            onClick={() => setActiveImageIndex(index)}
                            className={`relative h-20 w-28 shrink-0 overflow-hidden rounded-2xl border transition ${
                              active
                                ? 'border-primary2 ring-2 ring-primary2/20'
                                : 'border-transparent opacity-70 hover:opacity-100'
                            }`}
                            aria-label={`View image ${index + 1} for ${activeProduct.title}`}
                          >
                            <Image
                              src={image}
                              alt={`${activeProduct.title} preview ${index + 1}`}
                              width={220}
                              height={160}
                              unoptimized
                              className="h-full w-full object-cover"
                            />
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>

                <div className="flex flex-wrap gap-2">
                  <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-dark">
                    {filterLabel}
                  </span>
                  <span className="rounded-full bg-primary2/10 px-3 py-1 text-xs font-semibold text-primary2">
                    {techStack.length} technologies
                  </span>
                </div>

                <div className="space-y-3">
                  <MainHeading
                    text={activeProduct.title}
                    className="text-dark"
                  />
                  <RichTextPreview
                    value={activeProduct.description}
                    emptyMessage="Open the tabs to read the full case study summary."
                    lines={4}
                    className="text-black"
                  />
                  <p className="text-sm leading-7 text-dark/70">
                    Use the details panel to explore the available project
                    sections and technology stack.
                  </p>
                </div>

                <div className="flex flex-wrap gap-2">
                  {techStack.slice(0, 6).map((tech) => (
                    <span
                      key={tech}
                      className="rounded-full border border-white/60 bg-white px-3 py-2 text-sm font-semibold text-primary2 shadow-sm"
                    >
                      {getTechStackLabel(tech)}
                    </span>
                  ))}
                  {techStack.length > 6 && (
                    <span className="rounded-full border border-white/60 bg-white px-3 py-2 text-xs font-semibold text-mute shadow-sm">
                      +{techStack.length - 6} more
                    </span>
                  )}
                </div>
              </div>
            ) : (
              <div className="flex min-h-105 flex-col items-center justify-center rounded-[1.75rem] border border-dashed border-slate-300 bg-white p-8 text-center">
                <SubTitle text="NO PROJECTS" />
                <MainHeading
                  text="There are no published products in this category"
                  className="mt-2"
                />
                <p className="mt-3 max-w-md text-sm leading-7 text-mute">
                  Try a different category from the dropdown above.
                </p>
              </div>
            )}
          </div>

          <PortfolioTabs
            product={activeProduct}
            isLoading={productsQuery.isLoading}
          />
        </div>

        <div className="mt-8">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <SubTitle text="RELATED PRODUCTS" />
              <MainHeading text={filterLabel} className="mt-2" />
            </div>
            <p className="text-sm text-mute">
              {publishedProducts.length} published product
              {publishedProducts.length === 1 ? '' : 's'}
            </p>
          </div>

          {productsQuery.error instanceof Error && (
            <div className="mt-4 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              Unable to load products: {productsQuery.error.message}
            </div>
          )}

          {productsQuery.isLoading ? (
            <div className="mt-6 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              {Array.from({ length: 3 }).map((_, index) => (
                <div
                  key={index}
                  className="animate-pulse overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm"
                >
                  <div className="aspect-video bg-slate" />
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
          ) : publishedProducts.length === 0 ? (
            <div className="mt-6 rounded-4xl border border-dashed border-slate-300 bg-white px-6 py-10 text-center">
              <p className="text-sm leading-7 text-mute">
                No published products were found in this category yet.
              </p>
            </div>
          ) : (
            <div className="mt-6 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              {publishedProducts.map((product) => {
                const isActive = product.id === activeProduct?.id;
                const firstImage = getFirstImage(product.images);
                const productTechStack = getStringList(product.techstack);

                return (
                  <button
                    key={product.id}
                    type="button"
                    onClick={() => handleSelectProduct(product.id)}
                    className={`group flex h-full flex-col overflow-hidden rounded-3xl border text-left transition duration-300 ${
                      isActive
                        ? 'border-primary2 bg-white shadow-lg shadow-primary2/10 ring-2 ring-primary2/20'
                        : 'border-slate-200 bg-white hover:-translate-y-1 hover:shadow-lg'
                    }`}
                    aria-pressed={isActive}
                  >
                    <div className="relative aspect-video overflow-hidden bg-slate">
                      {firstImage ? (
                        <Image
                          src={firstImage}
                          alt={product.title}
                          fill
                          unoptimized
                          className="object-cover transition duration-500 group-hover:scale-105"
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center bg-linear-to-br from-slate to-white px-6 text-center text-sm text-mute">
                          No image preview available
                        </div>
                      )}
                      <div className="absolute left-3 top-3 rounded-full bg-black/55 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.24em] text-white">
                        {product.productCategory?.name || product.category}
                      </div>
                    </div>

                    <div className="flex flex-1 flex-col gap-4 p-4">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <h3 className="text-lg font-semibold text-dark transition group-hover:text-primary2">
                            {product.title}
                          </h3>
                        </div>
                        {isActive && (
                          <span className="rounded-full bg-primary2/10 px-3 py-1 text-xs font-semibold text-primary2">
                            Active
                          </span>
                        )}
                      </div>

                      <RichTextPreview
                        value={product.description}
                        emptyMessage="Open this project to read the full details."
                        lines={3}
                        className="text-black"
                      />

                      <div className="flex flex-wrap gap-2">
                        {productTechStack.slice(0, 3).map((tech) => (
                          <span
                            key={tech}
                            className="rounded-full bg-slate px-3 py-1 text-sm font-semibold text-dark"
                          >
                            {getTechStackLabel(tech)}
                          </span>
                        ))}
                        {productTechStack.length > 3 && (
                          <span className="rounded-full bg-slate px-3 py-1 text-[11px] font-semibold text-mute">
                            +{productTechStack.length - 3}
                          </span>
                        )}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default PortfolioShowcase;
