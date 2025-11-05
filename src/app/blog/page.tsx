'use client';

import React from 'react';
import Container from '@/components/Container';
import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';

interface BlogItem {
  id: number;
  title: string;
  description: string;
  content: string;
  image: string;
  authorId: number;
  authorName: string | null;
  authorEmail: string | null;
  createdAt: string;
  updatedAt: string;
}

interface BlogResponse {
  success: boolean;
  blog: BlogItem[];
  count: number;
}

const fetchBlogs = async (): Promise<BlogItem[]> => {
  const res = await fetch('/api/blog', {
    cache: 'no-store',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!res.ok) {
    throw new Error('Failed to fetch blogs');
  }

  const data: BlogResponse = await res.json();

  return data.blog || [];
};

export default function BlogPage() {
  const {
    data: blog = [],
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ['blog'],
    queryFn: fetchBlogs,
    staleTime: 2 * 60 * 1000,
  });

  const [currentPage, setCurrentPage] = React.useState(1);
  const blogsPerPage = 6;
  const totalPages = Math.ceil(blog.length / blogsPerPage);
  const startIndex = (currentPage - 1) * blogsPerPage;
  const visibleBlogs = blog.slice(startIndex, startIndex + blogsPerPage);

  if (isLoading) {
    return (
      <div className="grid place-items-center h-screen text-white">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <h2 className="text-xl">Loading blogs...</h2>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="grid place-items-center h-screen text-red-500">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">Error Loading Blogs</h2>
          <p>{(error as Error).message}</p>
        </div>
      </div>
    );
  }

  return (
    <Container className="relative z-10 py-10">
      <h1 className="font-bold text-5xl mb-10 text-center">Blogs</h1>

      {visibleBlogs.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-gray-400 text-xl mb-4">No blogs found.</p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {visibleBlogs.map((blog) => (
            <article
              key={blog.id}
              className="bg-gray-900/60 backdrop-blur-sm p-5 rounded-3xl shadow-md hover:shadow-lg hover:scale-[1.02] transition-all duration-300"
            >
              {blog.image && (
                <img
                  src={
                    blog.image.startsWith('http')
                      ? blog.image
                      : `/uploads/${blog.image.replace(/^\/+/, '')}`
                  }
                  alt={blog.title}
                  className="w-full h-64 object-cover rounded-2xl mb-5"
                  onError={(e) => {
                    e.currentTarget.src = '/placeholder-blog.jpg';
                  }}
                />
              )}

              <h2 className="text-2xl font-bold mb-2 text-white line-clamp-2">
                {blog.title}
              </h2>

              <div className="flex items-center gap-2 mb-3">
                <p className="text-sm text-gray-400">
                  By:
                  <span className="font-semibold">
                    {blog.authorName || `Author #${blog.authorId}`}
                  </span>
                  Date:
                  {new Date(blog.createdAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                  })}
                </p>
              </div>

              {blog.description && (
                <p className="text-gray-300 line-clamp-3 mb-4">
                  {blog.description.length > 150
                    ? blog.description.slice(0, 150) + '...'
                    : blog.description}
                </p>
              )}

              <Link
                href={`/blog/${blog.id}`}
                className="inline-block text-blue-500 hover:text-blue-400 hover:underline mt-4 font-medium transition-colors"
              >
                Read More →
              </Link>
            </article>
          ))}
        </div>
      )}

      {totalPages > 1 && (
        <div className="flex justify-center items-center mt-10 space-x-2">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
            disabled={currentPage === 1}
            className="px-4 py-2 rounded-lg transition bg-gray-700 text-gray-300 hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            ← Previous
          </button>

          {Array.from({ length: totalPages }).map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentPage(idx + 1)}
              className={`px-4 py-2 rounded-lg transition ${
                currentPage === idx + 1
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              {idx + 1}
            </button>
          ))}

          <button
            onClick={() =>
              setCurrentPage((prev) => Math.min(totalPages, prev + 1))
            }
            disabled={currentPage === totalPages}
            className="px-4 py-2 rounded-lg transition bg-gray-700 text-gray-300 hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next →
          </button>
        </div>
      )}

      <div className="text-center mt-4 text-gray-500 text-sm">
        Showing {startIndex + 1}-
        {Math.min(startIndex + blogsPerPage, blog.length)} of {blog.length}{' '}
        blogs
      </div>
    </Container>
  );
}
