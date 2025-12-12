'use client';

import { useParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { blog } from 'lib/blog';
import Container from '@/components/Container';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import MainHeading from '@/components/MainHeading';
import Head from 'next/head';
import Link from 'next/link';
import { IBlog } from 'lib/type';
import Breadcrumb, { BreadcrumbItem } from '@/components/breadCrum';
import CommentForms from '@/components/Comments/commentSection';
import { Toaster } from 'react-hot-toast';
import Image from 'next/image';

export default function BlogPage() {
  const params = useParams();
  const slugParam = params.slug;
  const slug = Array.isArray(slugParam) ? slugParam[0] : slugParam;

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
      const res = await blog.getAll(1, 3);
      const blogs = res?.data || [];
      return blogs.sort(
        (a, b) =>
          new Date(b.createdAt || 0).getTime() -
          new Date(a.createdAt || 0).getTime(),
      );
    },
  });

  if (isLoading)
    return <div className="text-center text-black py-20">Loading blog...</div>;

  if (error instanceof Error)
    return (
      <div className="text-center text-red-500 py-20">{error.message}</div>
    );

  const breadCrumb: BreadcrumbItem[] = [
    { label: 'Blogs', href: '/blog' },
    { label: b?.title || 'Blog', href: `/blog/${b?.slug}` },
  ];

  return (
    <>
      <Head>
        <title>{b?.meta?.title || b?.title || 'Blog'}</title>
        {b?.meta?.description && (
          <meta name="description" content={b.meta.description} />
        )}
        {b?.meta?.keywords && b.meta.keywords.length > 0 && (
          <meta name="keywords" content={b.meta.keywords.join(', ')} />
        )}
      </Head>

      <Container hScreen={false}>
        <Header />
        <div className="pt-10 pb-20">
          <Breadcrumb items={breadCrumb} />

          <div className="flex flex-col lg:flex-row gap-8">
            <div className="flex-1">
              {b?.image && (
                <div className="w-full h-96 relative rounded-3xl overflow-hidden my-6 bg-gray-100">
                  <Image src={b.image} alt={b.title || 'Blog image'} fill />
                </div>
              )}

              <MainHeading
                text={b?.title ?? 'Untitled'}
                className="font-bold"
              />

              <p className="text-sm text-gray-400 mb-2 mt-2">
                Published by{' '}
                {b?.authors && b.authors.length > 0
                  ? b.authors
                      .map((author) => `${author.firstName} ${author.lastName}`)
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

              <div className="prose prose-lg text-black">
                <div dangerouslySetInnerHTML={{ __html: b?.content || '' }} />
              </div>

              {/* Tags Section */}
              <div className="text-gray-700 rounded-lg p-2 bg-gray-200 mb-4 mt-5">
                <h2 className="font-medium">Tags:</h2>
                {b?.tags && b.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-3">
                    {b.tags.map((tag: string, idx: number) => (
                      <span key={idx} className="text-xs">
                        #{tag.trim()}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Sidebar: Recent Blogs */}
            <aside className="lg:w-100 mt-6">
              <div className="top-10 bg-gray-100 rounded-2xl p-5">
                <h2 className="text-xl font-bold mb-2 text-black">
                  Recent Blogs
                </h2>
                {loadingRecent ? (
                  <p className="text-gray-400 text-sm">Loading...</p>
                ) : (
                  <div className="space-y-4">
                    {recentBlogs && recentBlogs.length > 0 ? (
                      recentBlogs.map((recentBlog) => (
                        <Link
                          key={recentBlog.id}
                          href={`/blog/${recentBlog.slug}`}
                          className="block group"
                        >
                          <div className="border-b-2 p-2 border-gray-300">
                            <div className="flex gap-3 hover:opacity-80 transition-opacity">
                              {recentBlog.image && (
                                <div className="rounded-lg overflow-hidden flex-shrink-0">
                                  <Image
                                    src={recentBlog.image}
                                    alt={recentBlog.title}
                                    className="w-20 h-12 object-cover"
                                    width={100}
                                    height={50}
                                  />
                                </div>
                              )}
                              <div className="flex-1 min-w-0">
                                <p className="text-xs text-gray-500 mb-1">
                                  {recentBlog.createdAt
                                    ? new Date(
                                        recentBlog.createdAt,
                                      ).toLocaleDateString('en-US', {
                                        month: 'long',
                                        day: 'numeric',
                                        year: 'numeric',
                                      })
                                    : ''}
                                </p>
                                <h3 className="text-sm text-black font-semibold line-clamp-2 group-hover:text-blue-300 transition-colors">
                                  {recentBlog.title}
                                </h3>
                              </div>
                            </div>
                          </div>
                        </Link>
                      ))
                    ) : (
                      <p className="text-gray-400 text-sm">
                        No recent blogs available
                      </p>
                    )}
                  </div>
                )}
              </div>
            </aside>
          </div>

          <CommentForms blogId={b?.id || 0} />
          <Toaster position="top-right" />
        </div>
      </Container>
      <Footer />
    </>
  );
}
