'use client';

import React, { useState } from 'react';
import { FaEye, FaPen, FaPlus, FaTrash } from 'react-icons/fa';
import { MdPublicOff, MdPublish } from 'react-icons/md';
import Link from 'next/link';
import Image from 'next/image';
import DashboardListTable from '@/components/dashboard/DashboardListTable';
import CategoryModal from '@/components/Category/CategoryMoadal';
import { BreadcrumbItem } from '@/components/breadCrum';
import { ProductItem, getFirstImage, useProductsPage } from 'hooks/useProducts';
import { DashboardTableColumn } from 'types/dashboard';
import DashboardButton from '@/components/Button/DashboardButton';
import { createPortfolioHash } from '@/utils/portfolio';

const ProductPage = () => {
  const {
    page,
    setPage,
    products,
    totalPages,
    isLoading,
    error,
    deleteMutation,
    publishMutation,
    handleDelete,
    handleTogglePublish,
  } = useProductsPage();

  // State for category modal
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);

  const breadCrumb: BreadcrumbItem[] = [
    { label: 'Products', href: '/dashboard/product' },
  ];

  const columns: DashboardTableColumn<ProductItem>[] = [
    {
      key: 'image',
      header: 'Image',
      skeletonType: 'image',
      cell: (product) => {
        const firstImage = getFirstImage(product.images);

        return firstImage ? (
          <Image
            width={100}
            height={100}
            unoptimized
            loading="lazy"
            decoding="async"
            src={firstImage}
            alt={product.title}
            className="w-20 h-12 object-cover rounded-lg"
          />
        ) : (
          <span className="text-gray-400 text-sm">No image</span>
        );
      },
    },
    {
      key: 'title',
      header: 'Title',
      className: 'min-w-[180px] max-w-[180px] text-xs sm:text-sm font-semibold',
      skeletonType: 'text',
      cell: (product) => (
        <div className="truncate font-semibold" title={product.title}>
          {product.title}
        </div>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      skeletonType: 'badge',
      cell: (product) => (
        <span
          className={`px-2 py-1 rounded text-xs font-medium ${
            product.is_published
              ? 'bg-green-100 text-green-800'
              : 'bg-yellow-100 text-yellow-800'
          }`}
        >
          {product.is_published ? 'Published' : 'Draft'}
        </span>
      ),
    },
    {
      key: 'category',
      header: 'Category',
      className: 'text-xs sm:text-sm whitespace-nowrap font-semibold',
      skeletonType: 'text',
      cell: (product) =>
        product.productCategory?.name || product.category || product.categoryId,
    },
    {
      key: 'updated',
      header: 'Updated By',
      className: 'text-xs sm:text-sm whitespace-nowrap font-semibold',
      skeletonType: 'text',
      cell: (product) => <div>{product.updatedBy || '-'}</div>,
    },

    {
      key: 'actions',
      header: 'Actions',
      headerClassName: 'text-center',
      className: 'text-center',
      skeletonType: 'actions',
      cell: (product) => (
        <div className="flex items-center justify-center gap-3">
          {product.is_published && (
            <Link
              href={`/portfolio#${encodeURIComponent(
                createPortfolioHash(
                  product.productCategory?.id ?? product.categoryId,
                  product.title,
                ),
              )}`}
              scroll={false}
              className="text-black hover:text-gray-600 transition"
              title="View Published"
            >
              <FaEye />
            </Link>
          )}
          <button
            onClick={() =>
              void handleTogglePublish(product.id, product.is_published)
            }
            disabled={publishMutation.isPending}
            className={`transition-colors disabled:opacity-40 ${
              product.is_published
                ? 'text-orange-500 hover:text-orange-700'
                : 'text-green-500 hover:text-green-700'
            }`}
            title={product.is_published ? 'Unpublish' : 'Publish'}
          >
            {product.is_published ? <MdPublicOff /> : <MdPublish />}
          </button>
          <Link
            href={`/dashboard/product/edit/${product.id}`}
            className="text-yellow-500 hover:text-yellow-300 transition"
            title="Edit"
          >
            <FaPen />
          </Link>
          <button
            onClick={() => void handleDelete(product.id)}
            disabled={deleteMutation.isPending}
            className="text-red-500 hover:text-red-700 transition-colors disabled:opacity-40"
            title="Delete product"
          >
            <FaTrash />
          </button>
        </div>
      ),
    },
  ];

  return (
    <>
      <DashboardListTable
        title="Products"
        breadcrumbs={breadCrumb}
        headerActions={
          <div className="flex items-center gap-3">
            <DashboardButton onClick={() => setIsCategoryModalOpen(true)}>
              <FaPlus />
              Add Categories
            </DashboardButton>
            <DashboardButton href="/dashboard/product/add">
              Product
            </DashboardButton>
          </div>
        }
        data={products}
        columns={columns}
        rowKey={(product) => product.id}
        loading={isLoading}
        error={error?.message || null}
        emptyMessage="No products found."
        pagination={{
          page,
          totalPages,
          onPrevious: () =>
            setPage((currentPage) => Math.max(currentPage - 1, 1)),
          onNext: () =>
            setPage((currentPage) => Math.min(currentPage + 1, totalPages)),
        }}
      />

      {/* Category Modal */}
      <CategoryModal
        isOpen={isCategoryModalOpen}
        onClose={() => setIsCategoryModalOpen(false)}
      />
    </>
  );
};

export default ProductPage;
