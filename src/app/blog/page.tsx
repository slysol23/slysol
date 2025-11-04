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
  author: string;
  createdAt: string;
  updatedAt: string;
}

const fetchBlogs = async (): Promise<BlogItem[]> => {
  const res = await fetch('/api/blogs', { cache: 'no-store' });
  if (!res.ok) throw new Error('Failed to fetch blogs');
  return res.json();
};

export default function BlogPage() {
  const {
    data: blogs = [],
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ['blogs'],
    queryFn: fetchBlogs,
    staleTime: 2 * 60 * 1000,
  });

  const [currentPage, setCurrentPage] = React.useState(1);
  const blogsPerPage = 6;
  const totalPages = Math.ceil(blogs.length / blogsPerPage);
  const startIndex = (currentPage - 1) * blogsPerPage;
  const visibleBlogs = blogs.slice(startIndex, startIndex + blogsPerPage);

  if (isLoading)
    return (
      <div className="grid place-items-center h-screen text-white">
        <h2>Loading blogs...</h2>
      </div>
    );

  if (isError)
    return (
      <div className="grid place-items-center h-screen text-red-500">
        <h2>Error: {(error as Error).message}</h2>
      </div>
    );

  return (
    <Container className="relative z-10 py-10">
      <h1 className="font-bold text-5xl mb-10 text-center">Blogs</h1>

      {visibleBlogs.length === 0 ? (
        <p className="text-center text-gray-400">No blogs found.</p>
      ) : (
        <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {visibleBlogs.map((blog) => (
            <article
              key={blog.id}
              className="bg-gray-900/60 backdrop-blur-sm p-5 rounded-3xl shadow-md hover:shadow-lg hover:scale-[1.02] transition-all duration-300"
            >
              <img
                src={
                  blog.image.startsWith('http')
                    ? blog.image
                    : `/uploads/${blog.image.replace(/^\/+/, '')}`
                }
                alt={blog.title}
                className="w-full h-64 object-cover rounded-2xl mb-5"
              />

              <h2 className="text-2xl font-bold mb-2 text-white line-clamp-2">
                {blog.title}
              </h2>

              <p className="text-sm text-gray-400 mb-3">
                By <span className="font-semibold">{blog.author}</span> Date:
                {new Date(blog.createdAt).toLocaleDateString()}
              </p>

              <p className="text-gray-300 line-clamp-3 mb-4">
                {blog.description?.length > 150
                  ? blog.description.slice(0, 150) + '...'
                  : blog.description}
              </p>

              <Link
                href={`/blog/${blog.id}`}
                className="block text-blue-500 hover:underline mt-4 font-medium"
              >
                Read More →
              </Link>
            </article>
          ))}
        </div>
      )}

      {totalPages > 1 && (
        <div className="flex justify-center mt-10 space-x-2">
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
        </div>
      )}
    </Container>
  );
}
