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
import Breadcrumb, { BreadcrumbItem } from '@/components/breadCrum';
import { getBlogImageSrc } from 'lib/blog/image';
import Image from 'next/image';
import Banner from '@/components/Banner';

export default function BlogPage() {
  const [page, setPage] = useState(1);
  const limit = 6;

  // ✅ Fetch blogs
  const blogQuery = useQuery<BlogApiResponse, Error>({
    queryKey: ['blogs', page],
    queryFn: async () => await blog.getAll(page, limit, true),
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

  const blogs = allBlogs;

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
      <Banner text="Blogs" empty />
      <Container hScreen={false}>
        {/* <Header /> */}
        {/* <Title text="Blogs" className="py-5" /> */}
        <div className="pt-10">
          <Breadcrumb items={breadCrumb} />
        </div>

        {!blogs.length ? (
          <p className="text-center text-gray-400">No published blogs found.</p>
        ) : (
          <>
            <div className="block md:grid md:grid-cols-1 lg:grid-cols-2 md:gap-8 py-10">
              {blogs.map((b) => (
                <article
                  key={b.id}
                  className="backdrop-blur p-3 sm:p-6 rounded-3xl mb-5 md:mb-0 shadow-md hover:scale-[1.02] transition-all duration-300"
                >
                  <Link href={b.slug ? `/blog/${b.slug}` : `/blog/id/${b.id}`}>
                    {getBlogImageSrc(b.image) && (
                      <Image
                        src={getBlogImageSrc(b.image) ?? ''}
                        alt={b.title}
                        className="w-full h-48 sm:h-56 object-fill rounded-2xl"
                        loading="lazy"
                        decoding="async"
                        height={224}
                        width={400}
                      />
                    )}

                    <h2 className="text-2xl font-bold text-blue mb-2 truncate">
                      {b.title}
                    </h2>

                    <p className="text-sm text-gray-400 mb-2 flex items-center justify-between">
                      <span className="text-sm text-gray-400">
                        by{' '}
                        {b?.authors && b.authors.length > 0
                          ? (() => {
                              const authorsList = b.authors.map(
                                (author) =>
                                  `${author.firstName} ${author.lastName}`,
                              );

                              if (authorsList.length <= 2) {
                                return authorsList.join(', ');
                              }

                              const remainingAuthors = authorsList.slice(1);
                              const remainingCount = remainingAuthors.length;

                              return (
                                <span className="group relative inline-block">
                                  <button
                                    type="button"
                                    className="text-gray-400 hover:text-gray-500 focus:outline-none"
                                  >
                                    {authorsList[0]}, +{remainingCount}
                                  </button>
                                  <span className="absolute bottom-full left-0 mb-2 hidden group-hover:block w-max max-w-xs bg-gray-800 text-gray-200 text-xs rounded-lg px-3 py-2 shadow-lg z-10">
                                    {remainingAuthors.join(', ')}
                                    <span className="absolute top-full left-4 w-0 h-0 border-l-4 border-r-4 border-b-4 border-transparent border-b-gray-800"></span>
                                  </span>
                                </span>
                              );
                            })()
                          : getAuthorName(b.authorId)}
                      </span>
                      <span className="text-gray-500 text-xs">
                        {new Date(b.createdAt).toLocaleDateString('en-GB', {
                          day: '2-digit',
                          month: 'short',
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
