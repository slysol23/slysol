'use client';

import { useQuery } from '@tanstack/react-query';
import { blog } from 'lib/blog';
import { IBlog } from 'lib/type';
import Container from '@/components/Container';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import MainHeading from '@/components/MainHeading';
import Breadcrumb, { BreadcrumbItem } from '@/components/breadCrum';
import CommentForms from '@/components/Comments/commentSection';
import { Toaster } from 'react-hot-toast';
import Image from 'next/image';
import Link from 'next/link';
import { useMemo } from 'react';

interface BlogClientProps {
  slug: string;
}

export default function BlogClient({ slug }: BlogClientProps) {
  const {
    data: b,
    isLoading,
    error,
  } = useQuery<IBlog>({
    queryKey: ['blog', slug],
    queryFn: async () => {
      if (!slug) throw new Error('Invalid blog slug');
      const res = await blog.getBySlug(slug);
      if (!res?.data) throw new Error('Blog not found');
      return res.data;
    },
    enabled: !!slug,
  });

  const { data: recentBlogs, isLoading: loadingRecent } = useQuery<IBlog[]>({
    queryKey: ['recentBlogs'],
    queryFn: async () => {
      const res = await blog.getAll(1, 3, true);
      const blogs = res?.data || [];
      return blogs.sort(
        (a, b) =>
          new Date(b.createdAt || 0).getTime() -
          new Date(a.createdAt || 0).getTime(),
      );
    },
  });

  // Frontend-only published blogs filter
  const publishedBlogs = useMemo(
    () =>
      (recentBlogs ?? []).filter(
        (b) =>
          b.status?.toLowerCase() === 'published' && b.is_published === true,
      ),
    [recentBlogs],
  );

  if (isLoading)
    return <div className="text-center text-black py-20">Loading blog...</div>;

  if (error instanceof Error)
    return (
      <div className="text-center text-red-500 py-20">{error.message}</div>
    );

  const breadCrumb: BreadcrumbItem[] = [
    { label: 'Blogs', href: '/blog' },
    {
      label: b?.title
        ? b.title.split(' ').slice(0, 4).join(' ') +
          (b.title.split(' ').length > 4 ? ' ...' : '')
        : 'Blog',
      href: `/blog/${b?.slug}`,
    },
  ];

  const truncateWords = (text: string, wordCount: number) => {
    const words = text.split(' ');
    if (words.length <= wordCount) return text;
    return words.slice(0, wordCount).join(' ') + '...';
  };

  return (
    <>
      <Container hScreen={false}>
        <Header />
        <div className="pt-6 md:pt-10 pb-4">
          <h1 className="font-bold text-xl md:text-2xl mb-4">Blogs</h1>
          <Breadcrumb items={breadCrumb} />
          <div className="flex flex-col md:flex-row gap-4">
            {/* Main Blog Content */}
            <div className="flex-1">
              {b?.image && (
                <div className="w-full md:w-[775px] h-64 md:h-[400px] relative rounded-3xl overflow-hidden my-4 bg-gray-100">
                  <Image
                    src={b.image}
                    alt={b.title || 'Blog image'}
                    fill
                    className="object-cover"
                    priority
                  />
                </div>
              )}
              <MainHeading
                text={b?.title ?? 'Untitled'}
                className="font-bold text-2xl md:text-3xl"
              />
              <p className="text-sm text-gray-400 mb-2 mt-2">
                Published by{' '}
                {b?.authors && b.authors.length > 0
                  ? b.authors
                      .map((a) => `${a.firstName} ${a.lastName}`)
                      .join(', ')
                  : `Author #${b?.authorId}`}{' '}
                on{' '}
                {b?.createdAt
                  ? new Date(b.createdAt).toLocaleDateString('en-GB', {
                      day: '2-digit',
                      month: 'long',
                      year: 'numeric',
                    })
                  : ''}
              </p>
            </div>

            {/* Sidebar: Recent Blogs */}
            <aside className="md:w-80 lg:w-96 mt-6">
              <div className="top-10 bg-gray-100 rounded-2xl p-5">
                <h2 className="text-xl font-bold mb-2 text-black">
                  Recent Blogs
                </h2>
                {loadingRecent ? (
                  <p className="text-gray-400 text-sm">Loading...</p>
                ) : publishedBlogs.length === 0 ? (
                  <p className="text-gray-400 text-sm">
                    No published blogs yet
                  </p>
                ) : (
                  <div className="space-y-4">
                    {publishedBlogs.map((r) => (
                      <Link
                        key={r.id}
                        href={`/blog/${r.slug}`}
                        className="block group"
                      >
                        <div className="border-b-2 p-2 border-gray-300">
                          <div className="flex gap-3 hover:opacity-80 transition-opacity">
                            {r.image && (
                              <div className="rounded-lg overflow-hidden flex-shrink-0">
                                <Image
                                  src={r.image}
                                  alt={r.title}
                                  width={100}
                                  height={50}
                                  className="w-20 h-12 object-cover"
                                />
                              </div>
                            )}
                            <div className="flex-1 min-w-0">
                              <p className="text-xs text-gray-500 mb-1">
                                {r.createdAt
                                  ? new Date(r.createdAt).toLocaleDateString(
                                      'en-US',
                                      {
                                        month: 'short',
                                        day: 'numeric',
                                        year: 'numeric',
                                      },
                                    )
                                  : ''}
                              </p>
                              <h3 className="text-sm text-black font-semibold group-hover:text-blue-300 transition-colors">
                                {truncateWords(r.title, 4)}
                              </h3>
                            </div>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            </aside>
          </div>

          {/* Blog Content */}
          <div className="prose prose-base md:prose-lg text-black max-w-full mt-8">
            <div dangerouslySetInnerHTML={{ __html: b?.content || '' }} />
          </div>

          {/* Tags */}
          <div className="text-gray-700 rounded-lg p-2 md:p-4 bg-gray-200 mb-4 mt-4">
            <h2 className="font-medium mb-3">Tags:</h2>
            <div className="flex flex-wrap gap-2 md:gap-3 mb-3">
              {b?.tags?.map((tag, idx) => (
                <span key={idx} className="text-xs">
                  #{tag.trim()}
                </span>
              ))}
            </div>
          </div>

          {/* Comments */}
          <CommentForms blogId={b?.id || 0} />
          <Toaster position="top-right" />
        </div>
      </Container>
      <Footer />
    </>
  );
}
