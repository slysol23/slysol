'use client';

import { useParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { blog } from 'lib/blog';
import Container from '@/components/Container';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import MainHeading from '@/components/MainHeading';
import Image from 'next/image';
import Head from 'next/head';
import { IBlog } from 'lib/type';
import Breadcrumb, { BreadcrumbItem } from '@/components/breadCrum';

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
          {b?.image && (
            <div className="w-full h-96 relative rounded-3xl overflow-hidden my-6 bg-gray-100">
              <Image
                src={b.image.startsWith('/') ? b.image : `/uploads/${b.image}`}
                alt={b.title}
                fill
                className="object-cover"
                sizes="100vw"
              />
            </div>
          )}

          <MainHeading text={b?.title ?? 'Untitled'} className="font-bold" />

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

          {b?.tags && b.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-3">
              {b.tags.map((tag: string, idx: number) => (
                <span
                  key={idx}
                  className="px-3 py-1 bg-gray-200 text-gray-700 rounded-full text-xs"
                >
                  #{tag.trim()}
                </span>
              ))}
            </div>
          )}

          {b?.meta && (
            <div className="text-xs text-gray-500 mb-3">
              {b.meta.title && (
                <p>
                  <strong>Meta Title:</strong> {b.meta.title}
                </p>
              )}
              {b.meta.description && (
                <p>
                  <strong>Meta Description:</strong> {b.meta.description}
                </p>
              )}
              {b.meta.keywords && b.meta.keywords.length > 0 && (
                <p>
                  <strong>Keywords:</strong> {b.meta.keywords.join(', ')}
                </p>
              )}
            </div>
          )}

          <div
            className="prose prose-lg text-black text-xl max-w-none"
            dangerouslySetInnerHTML={{ __html: b?.content || '' }}
          />
        </div>
      </Container>
      <Footer />
    </>
  );
}
