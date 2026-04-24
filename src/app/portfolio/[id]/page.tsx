import { and, eq } from 'drizzle-orm';
import Container from '@/components/Container';
import Footer from '@/components/Footer';
import Header from '@/components/Header';
import HeaderInfo from '@/components/Header/HeaderInfo';
import PortfolioDetails from '@/components/Portfolio/Details';
import Section from '@/components/Section';
import type { ProductItem } from 'hooks/useProducts';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import React from 'react';
import { db } from '../../../db';
import { productSchema } from '../../../db/schema';

const getProductById = async (
  productId: number,
): Promise<ProductItem | null> => {
  const product = await db.query.productSchema.findFirst({
    where: and(
      eq(productSchema.id, productId),
      eq(productSchema.is_published, true),
    ),
    with: {
      productCategory: true,
    },
  });

  if (!product) {
    return null;
  }

  return {
    id: product.id,
    title: product.title,
    category: product.category,
    categoryId: product.categoryId,
    images: product.images,
    techstack: product.techstack,
    description: product.description,
    overview: product.overview,
    challenges: product.challenges,
    approach: product.approach,
    outcomes: product.outcomes,
    feedback: product.feedback,
    is_published: product.is_published,
    createdAt: product.createdAt.toISOString(),
    updatedAt: product.updatedAt.toISOString(),
    updatedBy: product.updatedBy,
    productCategory: product.productCategory
      ? {
          id: product.productCategory.id,
          name: product.productCategory.name,
          is_published: product.productCategory.is_published,
          createdAt: product.productCategory.createdAt.toISOString(),
          updatedAt: product.productCategory.updatedAt.toISOString(),
          updatedBy: product.productCategory.updatedBy,
        }
      : null,
  };
};

export default async function PortfolioProjectPage({
  params,
}: {
  params: { id: string };
}) {
  const productId = Number(params.id);

  if (Number.isNaN(productId)) {
    notFound();
  }

  const product = await getProductById(productId);

  if (!product) {
    notFound();
  }

  return (
    <>
      <div className="relative h-60 overflow-hidden md:h-80">
        <Image
          src="/images/portfolio/portfolio-bg.webp"
          alt="Slysol portfolio header"
          fill
          className="object-cover"
          style={{ objectPosition: 'left top' }}
        />
        <div className="absolute inset-0 z-1 bg-black/35" />
        <div className="relative z-2">
          <HeaderInfo classes={{ root: 'text-white' }} />
        </div>
        <Container className="h-full z-2" hScreen={false}>
          <Header
            classes={{
              root: 'md:text-white',
              menuUnderline: 'md:bg-white',
              whiteLogo: true,
            }}
          />
        </Container>
      </div>

      <Section>
        <Container hScreen={false}>
          <PortfolioDetails product={product} />
        </Container>
      </Section>

      <Footer />
    </>
  );
}
