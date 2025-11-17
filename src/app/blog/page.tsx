'use client';

import React, { useState } from 'react';
import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import { blog } from 'lib/blog';
import { author } from 'lib/author';
import Container from '@/components/Container';
import Link from 'next/link';
import Footer from '@/components/Footer';
import Header from '@/components/Header';
import Title from '@/components/Title';
import { BlogApiResponse } from 'lib/type';
import Image from 'next/image';
import Breadcrumb, { BreadcrumbItem } from '@/components/breadCrum';

export default function BlogPage() {
  const [page, setPage] = useState(1);
  const limit = 6;

  // ✅ Fetch blogs
  const blogQuery = useQuery<BlogApiResponse, Error>({
    queryKey: ['blogs', page],
    queryFn: async () => await blog.getAll(page, limit),
    staleTime: 2 * 60 * 1000,
    keepPreviousData: true, // ✅ Correct usage
  } as UseQueryOptions<BlogApiResponse, Error>);

  // ✅ Fetch authors
  const authorQuery = useQuery({
    queryKey: ['authors'],
    queryFn: async () => await author.getAll(),
    staleTime: 5 * 60 * 1000,
  });

  const blogs = blogQuery.data?.data ?? [];
  const total = blogQuery.data?.total ?? 0;
  const totalPages = blogQuery.data?.totalPages ?? 1;
  const authors = authorQuery.data?.data ?? [];

  const getAuthorName = (authorId: number) => {
    const found = authors.find((a) => a.id === authorId);
    return found
      ? `${found.firstName} ${found.lastName}`
      : `Author #${authorId}`;
  };

  if (blogQuery.isLoading)
    return <div className="text-center text-white py-20">Loading blogs...</div>;

  if (blogQuery.isError)
    return (
      <div className="text-center text-red-500 py-20">
        Error: {blogQuery.error?.message}
      </div>
    );

  const breadCrumb: BreadcrumbItem[] = [{ label: 'Blogs', href: '/blog' }];
  return (
    <div>
      <Container hScreen={false}>
        <Header />
        <Title text="Blogs" className="py-5" />
        <Breadcrumb items={breadCrumb} />

        {!blogs.length ? (
          <p className="text-center text-gray-400">No blogs found.</p>
        ) : (
          <>
            <div className="grid md:grid-cols-1 lg:grid-cols-2 gap-8 pb-10">
              {blogs.map((b) => (
                <article
                  key={b.id}
                  className="backdrop-blur p-6 rounded-3xl shadow-md hover:scale-[1.02] transition-all duration-300"
                >
                  {b.image && (
                    <div className="relative w-full h-56 mb-4 bg-gray-800 rounded-2xl overflow-hidden">
                      <Image
                        src={
                          b.image.startsWith('/')
                            ? b.image
                            : `/uploads/${b.image}`
                        }
                        height={800}
                        width={500}
                        alt={b.title}
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      />
                    </div>
                  )}

                  <h2 className="text-2xl font-bold text-blue mb-2 truncate">
                    {b.title}
                  </h2>

                  <p className="text-sm font-bold text-gray-400 mb-2">
                    By:{' '}
                    {b.author
                      ? `${b.author.firstName} ${b.author.lastName}`
                      : getAuthorName(b.authorId)}
                    <span className="ml-2">
                      {new Date(b.createdAt).toLocaleDateString('en-GB', {
                        day: '2-digit',
                        month: 'numeric',
                        year: '2-digit',
                      })}
                    </span>
                  </p>

                  <p className="text-gray-300 line-clamp-3 mb-3">
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

            {/* Pagination */}
            <div className="flex justify-center items-center gap-4 pb-20">
              <button
                onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                disabled={page === 1 || blogQuery.isFetching}
                className="px-4 py-2 rounded-lg bg-gray-700 text-white disabled:opacity-40 hover:bg-gray-600"
              >
                ←
              </button>

              <span className="text-gray-300">
                Page {page} of {totalPages}
              </span>

              <button
                onClick={() =>
                  setPage((prev) => (prev < totalPages ? prev + 1 : prev))
                }
                disabled={page >= totalPages || blogQuery.isFetching}
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
