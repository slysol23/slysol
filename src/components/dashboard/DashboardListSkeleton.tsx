'use client';

import React from 'react';
import { DashboardTableColumn } from 'types/dashboard';

interface DashboardListSkeletonProps<T> {
  columns: DashboardTableColumn<T>[];
  rows?: number;
}

const renderSkeletonCell = (type?: DashboardTableColumn<unknown>['skeletonType']) => {
  switch (type) {
    case 'image':
      return <div className="w-20 h-12 rounded-lg bg-gray-200" />;
    case 'badge':
      return <div className="w-20 h-6 rounded-full bg-gray-200" />;
    case 'actions':
      return (
        <div className="flex items-center justify-center gap-3">
          <div className="w-4 h-4 rounded bg-gray-200" />
          <div className="w-4 h-4 rounded bg-gray-200" />
        </div>
      );
    case 'text':
    default:
      return <div className="h-4 w-full max-w-[12rem] rounded bg-gray-200" />;
  }
};

function DashboardListSkeleton<T>({
  columns,
  rows = 5,
}: DashboardListSkeletonProps<T>) {
  return (
    <div className="overflow-x-auto animate-pulse">
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
          {[...Array(rows)].map((_, rowIndex) => (
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
  );
}

export default DashboardListSkeleton;
