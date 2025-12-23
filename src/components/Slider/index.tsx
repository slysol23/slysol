'use client';

import dynamic from 'next/dynamic';
import 'owl.carousel/dist/assets/owl.carousel.css';
import 'owl.carousel/dist/assets/owl.theme.default.css';
import React, { ReactNode } from 'react';

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

var $ = require('jquery');
if (typeof window !== 'undefined') {
  window.$ = window.jQuery = require('jquery');
}

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
