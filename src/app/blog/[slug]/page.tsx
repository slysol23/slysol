import { Metadata } from 'next';
import { blog } from 'lib/blog';
import { IBlog } from 'lib/type';
import BlogClient from './BlogClient';

interface Props {
  params: { slug: string };
}

// ✅ ADD THIS: Generate static params for all published blogs
export async function generateStaticParams() {
  try {
    // Fetch all published blogs
    const response = await blog.getAll(1, 100, true); // page=1, limit=100, published=true
    const blogs = response.data || [];

    return blogs.map((b) => ({
      slug: b.slug,
    }));
  } catch (error) {
    console.error('❌ Error generating static params:', error);
    return [];
  }
}

// Generate metadata for SEO and social sharing
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://slysol.com';
  const siteName = 'Slysol';
  const slug = params.slug;

  let b: IBlog | undefined;

  try {
    const res = await blog.getBySlug(slug);
    b = res?.data;
  } catch (err) {
    console.error('❌ Error fetching blog for metadata:', err);

    // Return basic metadata on error
    return {
      title: 'Blog Not Found | Slysol',
      description: 'The requested blog post could not be found.',
      openGraph: {
        siteName,
        locale: 'en_US',
        type: 'website',
      },
    };
  }

  if (!b) {
    return {
      title: 'Blog Not Found | Slysol',
      description: 'The requested blog post could not be found.',
      openGraph: {
        siteName,
        locale: 'en_US',
        type: 'website',
      },
    };
  }

  const blogUrl = `${siteUrl}/blog/${b.slug}`;
  const imageUrl = b.image
    ? b.image.startsWith('http')
      ? b.image
      : `${siteUrl}${b.image}`
    : `${siteUrl}/default-blog-image.jpg`;

  const authorNames = b.authors?.length
    ? b.authors.map((a) => `${a.firstName} ${a.lastName}`).join(', ')
    : 'Slysol Team';

  const publishedTime = b.createdAt
    ? typeof b.createdAt === 'string'
      ? b.createdAt
      : new Date(b.createdAt).toISOString()
    : new Date().toISOString();

  const metaTitle = b.meta?.title || b.title || 'Untitled Blog';
  const metaDescription =
    b.meta?.description || b.description || 'Read this article on Slysol';

  return {
    title: `${metaTitle} | Slysol`,
    description: metaDescription,
    keywords: b.meta?.keywords || b.tags || [],
    authors: [{ name: authorNames }],

    openGraph: {
      siteName,
      locale: 'en_US',
      title: metaTitle,
      description: metaDescription,
      type: 'article',
      url: blogUrl,
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: b.title || 'Blog image',
        },
      ],
      publishedTime,
      authors: [authorNames],
      tags: b.tags || [],
    },

    twitter: {
      card: 'summary_large_image',
      site: '@slysol',
      title: metaTitle,
      description: metaDescription,
      images: [imageUrl],
      creator: '@slysol',
    },

    alternates: {
      canonical: blogUrl,
    },

    robots: {
      index: b.is_published !== false,
      follow: true,
    },
  };
}

// Server Component that renders the client component
export default function BlogPage({ params }: Props) {
  return <BlogClient slug={params.slug} />;
}
