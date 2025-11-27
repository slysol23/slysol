// C:\workspace\slysol\src\app\blog\[slug]\head.tsx
import { Metadata } from 'next';
import { blog } from 'lib/blog';
import { IBlog } from 'lib/type';

interface Params {
  slug: string;
}

interface MetaItem {
  property: string;
  content: any;
}

function parseMeta(meta: IBlog['meta']) {
  const obj: Record<string, any> = {};
  if (!meta || !Array.isArray(meta)) return obj;

  meta.forEach((item: MetaItem) => {
    if (item.property) obj[item.property] = item.content;
  });
  return obj;
}

export async function generateMetadata({
  params,
}: {
  params: Params;
}): Promise<Metadata> {
  const { slug } = params;

  if (!slug) return {};

  try {
    const res = await blog.getBySlug(slug);
    const b = res.data;

    if (!b) return {};

    const metaObj = parseMeta(b.meta);

    // Site configuration
    const siteUrl =
      process.env.NEXT_PUBLIC_SITE_URL || 'https://www.slysol.com';
    const siteName = process.env.NEXT_PUBLIC_SITE_NAME || 'slysol';
    const blogUrl = `${siteUrl}/blog/${b.slug}`;

    // Extract and format OG images properly
    const ogImages =
      Array.isArray(metaObj['og:images']) && metaObj['og:images'].length > 0
        ? metaObj['og:images'].map((img: any) => ({
            url: img.url || '',
            width: img.width || 1200,
            height: img.height || 630,
            alt: img.alt || b.title,
          }))
        : b.image
        ? [
            {
              url: b.image,
              width: 1200,
              height: 630,
              alt: b.title,
            },
          ]
        : [];

    // Extract authors as strings for OpenGraph
    const authors =
      Array.isArray(metaObj['authors']) && metaObj['authors'].length > 0
        ? metaObj['authors'].map((a: any) => a.name || '')
        : b.authors?.map((a) => `${a.firstName} ${a.lastName}`) || [];

    // Extract article tags
    const articleTags =
      Array.isArray(metaObj['article:tag']) && metaObj['article:tag'].length > 0
        ? metaObj['article:tag']
        : b.tags || [];

      
    // Published and modified times
    const publishedTime =
      metaObj['article:published_time'] ||
      metaObj['published_at'] ||
      new Date(b.createdAt).toISOString();

    const modifiedTime =
      metaObj['article:modified_time'] || new Date(b.updatedAt).toISOString();

    return {
      title: metaObj['og:title'] || b.title,
      description: metaObj['og:description'] || b.description,
      keywords: articleTags,
      authors: authors,
      creator: authors[0] || siteName,
      publisher: metaObj['og:site_name'] || siteName,
      alternates: {
        canonical: metaObj['canonical'] || blogUrl,
      },
      // Robots metadata
      robots: {
        index: true,
        follow: true,
        googleBot: {
          index: true,
          follow: true,
          'max-image-preview': 'large',
          'max-snippet': -1,
        },
      },
      // Open Graph metadata
      openGraph: {
        title: metaObj['og:title'] || b.title,
        description: metaObj['og:description'] || b.description,
        type: 'article',
        url: metaObj['og:url'] || blogUrl,
        siteName: metaObj['og:site_name'] || siteName,
        images: ogImages,
        locale: 'en_US',
        publishedTime: publishedTime,
        modifiedTime: modifiedTime,
        authors: authors,
        section: metaObj['article:section'] || '',
        tags: articleTags,
      },

      twitter: {
        card: metaObj['twitter:card'] || 'summary_large_image',
        title: metaObj['twitter:title'] || metaObj['og:title'] || b.title,
        description:
          metaObj['twitter:description'] ||
          metaObj['og:description'] ||
          b.description,
        images: ogImages.length > 0 ? ogImages.map((img) => img.url) : [],
        site: metaObj['twitter:site'] || '',
        creator: metaObj['twitter:creator'] || '',
      },
      // Category
      category: metaObj['article:section'] || 'Blog',
      // Additional metadata
      other: {
        'article:published_time': publishedTime,
        'article:modified_time': modifiedTime,
      },
    };
  } catch (err) {
    console.error('Error generating metadata:', err);
    return {
      title: 'Blog Post',
      description: 'Read our latest blog post',
    };
  }
}
