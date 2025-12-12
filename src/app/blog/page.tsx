'use client';

import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { blog } from 'lib/blog';
import { author } from 'lib/author';
import Container from '@/components/Container';
import Link from 'next/link';
import Footer from '@/components/Footer';
import Header from '@/components/Header';
import Title from '@/components/Title';
import { BlogApiResponse, IBlog, IAuthor } from 'lib/type';
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
  });

  // ✅ Fetch authors
  const authorQuery = useQuery<{ data: IAuthor[] }, Error>({
    queryKey: ['authors'],
    queryFn: async () => {
      const res = await author.getAll();
      return { data: res.data ?? [] };
    },
    staleTime: 5 * 60 * 1000,
  });

  const allBlogs: IBlog[] = blogQuery.data?.data ?? [];

  // ✅ Filter to show only published blogs on public page
  const blogs = allBlogs.filter((b) => b.is_published);

  const total = blogQuery.data?.total ?? 0;
  const totalPages = blogQuery.data?.totalPages ?? 1;
  const authors: IAuthor[] = authorQuery.data?.data ?? [];

  const getAuthorName = (authorId: number) => {
    const found = authors.find((a) => a.id === authorId);
    return found
      ? `${found.firstName} ${found.lastName}`
      : `Author #${authorId}`;
  };

  if (blogQuery.isLoading)
    return <div className="text-center text-black py-20">Loading blogs...</div>;

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
          <p className="text-center text-gray-400">No published blogs found.</p>
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
                        src={b.image}
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
                    {b?.authors && b.authors.length > 0
                      ? b.authors
                          .map(
                            (author) =>
                              `${author.firstName} ${author.lastName}`,
                          )
                          .join(', ')
                      : getAuthorName(b.authorId)}{' '}
                    <span className="ml-2">
                      {new Date(b.createdAt).toLocaleDateString('en-GB', {
                        day: '2-digit',
                        month: 'numeric',
                        year: '2-digit',
                      })}
                    </span>
                  </p>

                  <p className="text-gray-500 line-clamp-3 mb-3">
                    {b.description}
                  </p>

                  {!b.slug && (
                    <p className="text-red-500 text-xs mb-2">
                      ⚠️ Warning: This blog has no slug! ID: {b.id}
                    </p>
                  )}

                  <Link
                    href={b.slug ? `/blog/${b.slug}` : `/blog/id/${b.id}`}
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
