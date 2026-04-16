'use client';

import React from 'react';
import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import Image from 'next/image';
import { ChevronLeftIcon } from '@heroicons/react/20/solid';
import Breadcrumb, { BreadcrumbItem } from '@/components/breadCrum';
import Title from '../Title';
import SubTitle from '../SubTitle';
import Carousal from '@/components/Slider';
import PortfolioTabs from './Tabs';
import RichTextPreview from './RichTextPreview';

import {
  getFirstImage,
  getStringList,
  ProductItem,
  ProductApiResponse,
  ProductResponse,
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

const fetchProduct = async (productId: number): Promise<ProductItem> => {
  const response = await fetch(`/api/product/${productId}?published=true`, {
    cache: 'no-store',
  });

  const data = await readResponse<ProductResponse>(response);
  return data.data;
};

const createHashKey = (value: string) =>
  value
    .trim()
    .replace(/['"`]/g, '')
    .replace(/[^A-Za-z0-9]+/g, '_')
    .replace(/^_+|_+$/g, '');

const ProductDetailSkeleton = () => (
  <div className="animate-pulse space-y-6">
    <div className="space-y-4">
      <div className="h-4 w-32 rounded-full bg-slate" />
      <div className="h-10 w-3/4 rounded-2xl bg-slate" />
      <div className="h-4 w-2/3 rounded-full bg-slate" />
      <div className="flex flex-wrap gap-2">
        <div className="h-8 w-24 rounded-full bg-slate" />
        <div className="h-8 w-28 rounded-full bg-slate" />
        <div className="h-8 w-20 rounded-full bg-slate" />
      </div>
    </div>
    <div className="aspect-video rounded-4xl bg-slate" />
    <div className="rounded-4xl bg-white p-5 shadow-sm">
      <div className="h-6 w-48 rounded-full bg-slate" />
      <div className="mt-4 grid gap-3">
        <div className="h-10 rounded-full bg-slate" />
        <div className="h-56 rounded-3xl bg-slate" />
      </div>
    </div>
  </div>
);

interface ProductDetailProps {
  productId?: number;
  product?: ProductItem | null;
}

const ProductDetail = ({
  productId,
  product: providedProduct = null,
}: ProductDetailProps) => {
  const shouldFetch =
    !providedProduct &&
    Number.isFinite(productId ?? Number.NaN) &&
    (productId ?? 0) > 0;

  const {
    data: fetchedProduct,
    isLoading,
    error,
  } = useQuery<ProductItem, Error>({
    queryKey: ['portfolio-product', productId ?? 0],
    queryFn: () => fetchProduct(productId as number),
    enabled: shouldFetch,
    staleTime: 5 * 60 * 1000,
  });

  const { data: publishedProducts = [] } = useQuery<ProductItem[], Error>({
    queryKey: ['portfolio-products'],
    queryFn: fetchPublishedProducts,
    staleTime: 60 * 1000,
  });

  const product = providedProduct ?? fetchedProduct;

  if (shouldFetch && isLoading) {
    return <ProductDetailSkeleton />;
  }

  if (shouldFetch && error instanceof Error) {
    return (
      <div className="rounded-4xl border border-red-200 bg-red-50 px-6 py-10 text-center text-sm text-red-700">
        {error.message}
      </div>
    );
  }

  if (!product) {
    return (
      <div className="rounded-4xl border border-dashed border-slate-300 bg-white px-6 py-10 text-center">
        <SubTitle text="CASE STUDY" />
        <Title text="Product not found" className="mt-2" />
        <p className="mt-3 text-sm leading-7 text-mute">
          The project you selected is not available or has not been published
          yet.
        </p>
        <Link
          href="/portfolio"
          className="mt-6 inline-flex items-center gap-2 rounded-full bg-primary2 px-5 py-3 text-sm font-semibold text-white transition hover:opacity-90"
        >
          <ChevronLeftIcon className="h-4 w-4" />
          Back to portfolio
        </Link>
      </div>
    );
  }

  const images = getStringList(product.images);
  const categoryLabel = product.productCategory?.name || product.category;
  const breadcrumbItems: BreadcrumbItem[] = [
    { label: 'Portfolio', href: '/portfolio' },
    { label: product.title, href: '/portfolio' },
  ];
  const relatedProducts = publishedProducts
    .filter((item) => {
      const sameCategory =
        (item.productCategory?.id || item.categoryId) === product.categoryId;
      return sameCategory && item.id !== product.id;
    })
    .sort(
      (a, b) =>
        new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(),
    )
    .slice(0, 3);

  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <Breadcrumb items={breadcrumbItems} />
        <SubTitle text="PORTFOLIO PROJECT" />
        <Title text={product.title} className="truncate" />
      </div>

      <div className="overflow-hidden rounded-4xl border border-slate-200 bg-white p-1 sm:p-4 shadow-[0_30px_100px_rgba(15,23,42,0.08)]">
        {images.length > 0 ? (
          <Carousal
            items={1}
            margin={0}
            loop={images.length > 1}
            nav
            dots
            className="w-full"
          >
            {images.map((image, index) => (
              <div key={`${image}-${index}`} className="p-1">
                <div className="relative aspect-video overflow-hidden rounded-[1.75rem] bg-slate">
                  <Image
                    src={image}
                    alt={`${product.title} image ${index + 1}`}
                    fill
                    unoptimized
                    className="object-cover"
                  />
                </div>
              </div>
            ))}
          </Carousal>
        ) : (
          <div className="flex aspect-video items-center justify-center rounded-[1.75rem] bg-linear-to-br from-slate to-white px-8 text-center text-sm text-mute">
            No images were added for this project yet.
          </div>
        )}
      </div>

      <PortfolioTabs product={product} />

      {relatedProducts.length > 0 && (
        <section className="space-y-5">
          <div className="flex flex-col gap-2">
            <SubTitle text="RELATED PROJECTS" />
            <Title
              text={`More from ${categoryLabel}`}
              className="text-2xl md:text-3xl"
            />
          </div>
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {relatedProducts.map((item) => {
              const relatedImage = getFirstImage(item.images);
              const relatedPreview =
                item.description?.trim() || item.overview?.trim() || '';
              const itemHash = createHashKey(item.title);

              return (
                <Link
                  key={item.id}
                  href={`/portfolio#${encodeURIComponent(itemHash)}`}
                  scroll={false}
                  className="group flex h-full flex-col overflow-hidden rounded-3xl border border-slate-200 bg-white text-left shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-lg"
                >
                  <div className="relative aspect-16/10 overflow-hidden bg-slate">
                    {relatedImage ? (
                      <Image
                        src={relatedImage}
                        alt={item.title}
                        fill
                        unoptimized
                        className="object-cover transition duration-500 group-hover:scale-105"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center bg-linear-to-br from-slate to-white px-6 text-center text-sm text-mute">
                        No image preview available
                      </div>
                    )}
                  </div>

                  <div className="flex flex-1 flex-col gap-3 p-4">
                    <div>
                      <h3 className="text-lg font-semibold text-black transition group-hover:text-primary2 truncate">
                        {item.title}
                      </h3>
                    </div>
                    <RichTextPreview
                      value={relatedPreview}
                      emptyMessage="Open this project to see the full case study."
                      lines={2}
                      className="text-black"
                    />
                  </div>
                </Link>
              );
            })}
          </div>
        </section>
      )}
    </div>
  );
};

export default ProductDetail;
