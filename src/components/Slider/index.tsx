'use client';

import dynamic from 'next/dynamic';
import 'owl.carousel/dist/assets/owl.carousel.css';
import 'owl.carousel/dist/assets/owl.theme.default.css';
import React, { ReactNode } from 'react';

interface OwlCarouselProps {
  children: ReactNode;
  className?: string;
}

const OwlCarousel = dynamic(() => import('react-owl-carousel'), {
  ssr: false,
});

var $ = require('jquery');
if (typeof window !== 'undefined') {
  window.$ = window.jQuery = require('jquery');
}

export default function Carousal({
  children,
  className = '',
}: OwlCarouselProps) {
  const Responsive = {
    0: {
      items: 1,
    },
    768: {
      items: 2,
    },
    1024: {
      items: 3,
    },
  };

  return (
    <OwlCarousel
      items={3}
      margin={20}
      responsive={Responsive}
      nav={true}
      dots={false}
      loop
      navText={[
        `<img src='/images/home/arrow-left.png' class='md:mr-5 mr-2 md:w-12 w-8'>`,
        `<img src='/images/home/arrow-right.png' class='md:w-12 w-8 text-end'>`,
      ]}
      className={className}
    >
      {children}
    </OwlCarousel>
  );
}
