'use client';

import React from 'react';
import { FaPen, FaPlus, FaTrash } from 'react-icons/fa';
import Link from 'next/link';
import Image from 'next/image';
import DashboardListTable from '@/components/dashboard/DashboardListTable';
import { BreadcrumbItem } from '@/components/breadCrum';
import { ProductItem, getFirstImage, useProductsPage } from 'hooks/useProducts';
import { DashboardTableColumn } from 'types/dashboard';

const ProductPage = () => {
  const {
    page,
    setPage,
    products,
    totalPages,
    isLoading,
    error,
    deleteMutation,
    handleDelete,
  } = useProductsPage();

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
      className: 'min-w-[180px] text-xs sm:text-sm font-semibold',
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
          <Link
            href={`/dashboard/product/edit/${product.id}`}
            className="text-yellow-500 hover:text-yellow-300 transition"
            title="Edit"
          >
            <FaPen />
          </Link>
          <button
            onClick={() => handleDelete(product.id)}
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
    <DashboardListTable
      title="Products"
      breadcrumbs={breadCrumb}
      headerActions={
        <>
          <Link
            href="/dashboard/product/add"
            className="bg-gray-200 px-4 py-2 rounded-lg text-black hover:bg-gray-400 flex items-center gap-2"
          >
            <FaPlus /> Add Product
          </Link>
        </>
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
  );
};

export default ProductPage;
