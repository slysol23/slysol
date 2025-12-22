import { Metadata } from 'next';
import { IBlog } from 'lib/type';
import BlogClient from './BlogClient';
import { db } from '../../../db';
import {
  blogSchema,
  blogAuthorsSchema,
  authorSchema,
} from '../../../db/schema';
import { eq, inArray } from 'drizzle-orm';

interface Props {
  params: Promise<{ slug: string }> | { slug: string };
}

// Helper function to fetch blog directly from database
async function getBlogBySlug(slug: string): Promise<IBlog | null> {
  try {
    const [blogResult] = await db
      .select()
      .from(blogSchema)
      .where(eq(blogSchema.slug, slug))
      .limit(1);

    if (!blogResult) {
      return null;
    }

    // Fetch authors
    const relations = await db
      .select()
      .from(blogAuthorsSchema)
      .where(eq(blogAuthorsSchema.blogId, blogResult.id));

    const authorIds = relations.map((r) => r.authorId);

    const authors = authorIds.length
      ? await db
          .select()
          .from(authorSchema)
          .where(inArray(authorSchema.id, authorIds))
      : [];

    // Helper to safely convert createdBy/updatedBy
    const parseUserField = (field: any) => {
      if (!field) return { name: '—' };
      if (typeof field === 'string') return { name: field };
      if (field && typeof field === 'object' && 'name' in field) return field;
      return { name: '—' };
    };

    return {
      id: blogResult.id,
      authorId: blogResult.authorId,
      authors,
      title: blogResult.title,
      description: blogResult.description,
      content: blogResult.content,
      image: blogResult.image,
      slug: blogResult.slug,
      tags: Array.isArray(blogResult.tags) ? blogResult.tags : [],
      meta: blogResult.meta ?? { title: '', description: '', keywords: [] },
      createdAt: blogResult.createdAt,
      updatedAt: blogResult.updatedAt,
      createdBy: parseUserField(blogResult.createdBy),
      updatedBy: parseUserField(blogResult.updatedBy),
      is_published: blogResult.is_published,
      status: blogResult.is_published ? 'Published' : 'Draft',
    } as IBlog;
  } catch (error) {
    console.error('Error fetching blog by slug:', error);
    return null;
  }
}

// Generate static params for all published blogs
export async function generateStaticParams() {
  try {
    const blogs = await db
      .select()
      .from(blogSchema)
      .where(eq(blogSchema.is_published, true))
      .limit(100);

    return blogs.map((b) => ({
      slug: b.slug,
    }));
  } catch (error) {
    return [];
  }
}

// Generate metadata for SEO and social sharing
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://slysol.com';
  const siteName = 'Slysol';

  const resolvedParams = await Promise.resolve(params);
  const slug = resolvedParams.slug;

  const b = await getBlogBySlug(slug);

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
export default async function BlogPage({ params }: Props) {
  const resolvedParams = await Promise.resolve(params);
  return <BlogClient slug={resolvedParams.slug} />;
}
