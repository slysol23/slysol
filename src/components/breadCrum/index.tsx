'use client';

import React from 'react';
import Link from 'next/link';

// Breadcrumb Types
export interface BreadcrumbItem {
  label: string;
  href: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
  showHome?: boolean;
}

// Simple SVG Icons
const HomeIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
    <polyline points="9 22 9 12 15 12 15 22"></polyline>
  </svg>
);

const ChevronRightIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polyline points="9 18 15 12 9 6"></polyline>
  </svg>
);

// Breadcrumb Component
const Breadcrumb: React.FC<BreadcrumbProps> = ({ items, showHome = true }) => {
  return (
    <nav
      aria-label="Breadcrumb"
      className="flex items-center space-x-2 text-xs sm:text-sm min-w-0 w-full overflow-hidden"
    >
      {showHome && (
        <>
          <Link
            href="/"
            className="shrink-0 flex items-center text-gray-600 hover:text-gray-900 transition-colors"
            aria-label="Home"
          >
            <HomeIcon />
          </Link>
          {items.length > 0 && (
            <span className="shrink-0 text-gray-400">
              <ChevronRightIcon />
            </span>
          )}
        </>
      )}

      {items.map((item: BreadcrumbItem, index: number) => {
        const isLast = index === items.length - 1;

        return (
          <React.Fragment key={index}>
            {isLast ? (
              <span
                className="text-gray-900 font-medium min-w-0 truncate block max-w-25 sm:max-w-37.5 md:max-w-50 lg:max-w-xs"
                aria-current="page"
                title={item.label}
              >
                {item.label}
              </span>
            ) : (
              <>
                <Link
                  href={item.href}
                  className="text-gray-600 hover:text-gray-900 transition-colors min-w-0 truncate block max-w-25 sm:max-w-35 md:max-w-40 lg:max-w-80"
                  title={item.label}
                >
                  {item.label}
                </Link>
                <span className="shrink-0 text-gray-400">
                  <ChevronRightIcon />
                </span>
              </>
            )}
          </React.Fragment>
        );
      })}
    </nav>
  );
};

export default Breadcrumb;
