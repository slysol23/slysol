'use client';

import React, { useState } from 'react';
import { useQuery, keepPreviousData } from '@tanstack/react-query';
import { blog } from 'lib/blog';
import Container from '@/components/Container';
import Link from 'next/link';
import Footer from '@/components/Footer';
import Header from '@/components/Header';
import Title from '@/components/Title';
import { IBlog, ApiResponse } from 'lib/type';

export default function BlogPage() {
  const [page, setPage] = useState(1);
  const limit = 6;

  const { data, isLoading, isError, error, isFetching } = useQuery<
    ApiResponse<IBlog[]>
  >({
    queryKey: ['blogs', page],
    queryFn: async () => {
      const res = await blog.getAll(page, limit);
      return res;
    },
    placeholderData: keepPreviousData,
    staleTime: 2 * 60 * 1000,
  });

  if (isLoading)
    return <div className="text-center text-white py-20">Loading blogs...</div>;
  if (isError)
    return (
      <div className="text-center text-red-500 py-20">
        Error: {(error as Error).message}
      </div>
    );

  const blogs = data?.data ?? [];
  const total = data?.count ?? 0;
  const totalPages = Math.ceil(total / limit);

  return (
    <div>
      <Container hScreen={false}>
        <Header />
        <Title text="Blogs" className="py-10" />

        {!blogs || blogs.length === 0 ? (
          <p className="text-center text-gray-400">No blogs found.</p>
        ) : (
          <>
            <div className="grid md:grid-cols-1 lg:grid-cols-2 gap-8 pb-10">
              {blogs.map((b: IBlog) => (
                <article
                  key={b.id}
                  className="backdrop-blur p-6 rounded-3xl shadow-md hover:scale-[1.02] transition-all duration-300"
                >
                  {b.image && (
                    <img
                      src={
                        b.image.startsWith('http')
                          ? b.image
                          : `/uploads/${b.image}`
                      }
                      alt={b.title}
                      className="w-full h-56 object-cover rounded-2xl mb-4"
                    />
                  )}

                  <h2 className="text-2xl font-bold text-black mb-2 truncate">
                    {b.title}
                  </h2>
                  <p className="text-sm font-bold text-gray-300 mb-2">
                    By:{' '}
                    {b.author
                      ? `${b.author.firstName} ${b.author.lastName}`
                      : `Author #${b.authorId}`}{' '}
                    <span className="ml-2">
                      {new Date(b.createdAt).toLocaleDateString('en-GB', {
                        day: '2-digit',
                        month: 'numeric',
                        year: '2-digit',
                      })}
                    </span>
                  </p>

                  <p className="text-gray-400 line-clamp-3 mb-3">
                    {b.description}
                  </p>
                  <Link
                    href={`/blog/${b.id}`}
                    className="text-blue-500 hover:text-blue-400 hover:underline"
                  >
                    Read More
                  </Link>
                </article>
              ))}
            </div>

            {/* Pagination Controls */}
            <div className="flex justify-center items-center gap-4 pb-20">
              <button
                onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                disabled={page === 1 || isFetching}
                className="px-4 py-2 rounded-lg bg-gray-700 text-white disabled:opacity-40 hover:bg-gray-600"
              >
                ←
              </button>

              <span className="text-gray-300">
                Page {page} of {totalPages || 1}
              </span>

              <button
                onClick={() =>
                  setPage((prev) => (page < totalPages ? prev + 1 : prev))
                }
                disabled={page >= totalPages || isFetching}
                className="px-4 py-2 rounded-lg bg-gray-700 text-white disabled:opacity-40 hover:bg-gray-600"
              >
                →
              </button>
            </div>
          </>
        )}
      </Container>
      <Footer />
    </div>
  );
}
