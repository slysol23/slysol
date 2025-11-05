'use client';

import dynamic from 'next/dynamic';
import 'owl.carousel/dist/assets/owl.carousel.css';
import 'owl.carousel/dist/assets/owl.theme.default.css';
import React, { ReactNode, useEffect } from 'react';

interface OwlCarouselProps {
  autoplay?: boolean;
  autoplayTimeout?: number | undefined;
  autoplaySpeed?: number;
  children: ReactNode;
  className?: string;
  responsive?: {};
  items?: number;
  margin?: number;
  nav?: boolean;
  dots?: boolean;
  loop?: boolean;
  navText?: Array<string> | undefined;
}

const OwlCarousel = dynamic(() => import('react-owl-carousel'), {
  ssr: false,
});

export default function Carousal({
  autoplay = false,
  autoplayTimeout = undefined,
  autoplaySpeed = 5000,
  children,
  className = '',
  responsive = {},
  items,
  margin = 20,
  nav = false,
  dots = false,
  loop = true,
  navText = undefined,
}: OwlCarouselProps) {
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const $ = require('jquery');
      window.$ = window.jQuery = $;
    }
  }, []);

  return (
    <OwlCarousel
      autoplay={autoplay}
      autoplayTimeout={autoplayTimeout}
      autoplaySpeed={autoplaySpeed}
      items={items}
      margin={margin}
      responsive={responsive}
      nav={nav}
      dots={dots}
      loop={loop}
      navText={navText}
      className={className}
    >
      {children}
    </OwlCarousel>
  );
}
