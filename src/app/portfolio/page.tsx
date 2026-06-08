import type { Metadata } from 'next';
import Footer from '@/components/Footer';
import Header from '@/components/Header';
import HeaderInfo from '@/components/Header/HeaderInfo';
import React from 'react';
import Container from '@/components/Container';
import Showcase from '@/components/Portfolio/Showcase';
import Banner from '@/components/Banner';

const Portfolio = () => {
  return (
    <>
      <div className="relative z-2 mb-10">
        <Banner text="PORTROLIO" empty />
      </div>
      <Showcase />
      <Footer />
    </>
  );
};

export default Portfolio;
