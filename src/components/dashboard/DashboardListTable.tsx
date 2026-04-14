'use client';

import React from 'react';
import Breadcrumb from '@/components/breadCrum';
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';
import { DashboardListTableProps } from 'types/dashboard';

const joinClasses = (...classes: Array<string | undefined | false>) =>
  classes.filter(Boolean).join(' ');

const renderSkeletonCell = (
  type?: DashboardListTableProps<unknown>['columns'][number]['skeletonType'],
) => {
  switch (type) {
    case 'image':
      return <Skeleton height={48} width={80} borderRadius={8} />;
    case 'badge':
      return <Skeleton height={24} width={80} borderRadius={9999} />;
    case 'actions':
      return (
        <div className="flex items-center justify-center gap-3">
          <Skeleton height={16} width={16} circle />
          <Skeleton height={16} width={16} circle />
        </div>
      );
    case 'text':
    default:
      return <Skeleton height={16} width="100%" className="max-w-48" />;
  }
};

function DashboardListTable<T>({
  title,
  count,
  breadcrumbs,
  headerActions,
  topContent,
  data,
  columns,
  rowKey,
  loading = false,
  error,
  emptyMessage,
  skeletonRows = 5,
  pagination,
  rowClassName,
}: DashboardListTableProps<T>) {
  const hasError = Boolean(error);
  const isEmpty = !loading && !hasError && data.length === 0;

  return (
    <>
      <div className="flex justify-between items-center mb-6 gap-4">
        <h1 className=" text-xl sm:text-2xl font-bold text-black">
          {title}
          {typeof count === 'number' && (
            <span className="ml-2 text-base font-medium text-gray-500">
              ({count})
            </span>
          )}
          <div className="mt-4">
            <Breadcrumb items={breadcrumbs} />
          </div>
        </h1>

        {headerActions && (
          <div className="flex items-center gap-3">{headerActions}</div>
        )}
      </div>

      {topContent}

      {loading ? (
        <SkeletonTheme baseColor="#e5e7eb" highlightColor="#f3f4f6">
          <div className="overflow-x-auto">
            <table className="w-full text-left border border-gray-700 rounded-lg">
              <thead className="bg-blue text-white">
                <tr>
                  {columns.map((column) => (
                    <th key={column.key} className="p-3">
                      {column.header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {Array.from({ length: skeletonRows }).map((_, rowIndex) => (
                  <tr
                    key={rowIndex}
                    className="border-t border-gray-700 text-black"
                  >
                    {columns.map((column) => (
                      <td key={column.key} className="p-3">
                        {renderSkeletonCell(column.skeletonType)}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </SkeletonTheme>
      ) : hasError ? (
        <p className="text-red-500">{error}</p>
      ) : isEmpty ? (
        <p className="text-gray-400">{emptyMessage}</p>
      ) : (
        <>
          <div className="overflow-x-auto min-w-full whitespace-nowrap">
            <table className="w-full text-left border border-gray-700 rounded-lg">
              <thead className="bg-blue text-white">
                <tr>
                  {columns.map((column) => (
                    <th
                      key={column.key}
                      className={joinClasses('p-3', column.headerClassName)}
                    >
                      {column.header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {data.map((row, index) => (
                  <tr
                    key={rowKey(row, index)}
                    className={joinClasses(
                      'border-t border-gray-700 transition text-black hover:bg-gray-400',
                      typeof rowClassName === 'function'
                        ? rowClassName(row, index)
                        : rowClassName,
                    )}
                  >
                    {columns.map((column) => (
                      <td
                        key={column.key}
                        className={joinClasses('p-3', column.className)}
                      >
                        {column.cell(row, index)}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {pagination && pagination.totalPages > 1 && (
            <div className="flex justify-center items-center gap-4 mt-6">
              <button
                onClick={pagination.onPrevious}
                disabled={pagination.page === 1}
                className="px-4 py-2 rounded-lg bg-gray-200 text-black hover:bg-gray-500 transition disabled:opacity-40"
              >
                {pagination.previousLabel || '\u2190'}
              </button>
              <span className="text-gray-700 font-medium">
                Page {pagination.page} of {pagination.totalPages}
              </span>
              <button
                onClick={pagination.onNext}
                disabled={pagination.page === pagination.totalPages}
                className="px-4 py-2 rounded-lg bg-gray-200 text-black hover:bg-gray-500 transition disabled:opacity-40"
              >
                {pagination.nextLabel || '\u2192'}
              </button>
            </div>
          )}
        </>
      )}
    </>
  );
}

export default DashboardListTable;
