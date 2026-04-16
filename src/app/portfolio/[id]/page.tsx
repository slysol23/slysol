import Container from '@/components/Container';
import Footer from '@/components/Footer';
import Header from '@/components/Header';
import HeaderInfo from '@/components/Header/HeaderInfo';
import ProductDetail from '@/components/Portfolio/ProductDetail';
import Section from '@/components/Section';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import React from 'react';

export default function PortfolioProjectPage({
  params,
}: {
  params: { id: string };
}) {
  const productId = Number(params.id);

  if (Number.isNaN(productId)) {
    notFound();
  }

  return (
    <>
      <div className="relative md:h-80 h-60">
        <Image
          src="/images/portfolio/portfolio-bg.webp"
          alt="Slysol portfolio header"
          fill
          className="w-full h-auto object-cover object-top-left"
        />
        <div className="absolute inset-0 bg-black/35 z-1" />
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
          <ProductDetail productId={productId} />
        </Container>
      </Section>

      <Footer />
    </>
  );
}
