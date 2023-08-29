'use client';

import dynamic from 'next/dynamic';
import 'owl.carousel/dist/assets/owl.carousel.css';
import 'owl.carousel/dist/assets/owl.theme.default.css';
import React from 'react';

import SliderCard from './sliderCard';
import ContainerLayout from '@/components/ContainerLayout';

const OwlCarousel = dynamic(() => import('react-owl-carousel'), {
  ssr: false,
});

var $ = require('jquery');
if (typeof window !== 'undefined') {
  window.$ = window.jQuery = require('jquery');
}

export default function Slider() {
  const images = [
    {
      src: '/images/home/client1.png',
      alt: 'alignerbase',
      text: `Great company to work with! They helped us to integrate our client's external feature and code quality, the work was perfect and we appreciate to their help on this project Will hire him again for the future projects.`,
      name: 'Alignerbase',
    },
    {
      src: '/images/home/client2.png',
      alt: 'orange-shine',
      text: `Great company to work with! They helped us to integrate our client's external feature and code quality, the work was perfect and we appreciate to their help on this project Will hire him again for the future projects.`,
      name: 'Orange Shine',
    },
    {
      src: '/images/home/client3.png',
      alt: 'cubed-software',
      text: `Great company to work with! They helped us to integrate our client's external feature and code quality, the work was perfect and we appreciate to their help on this project Will hire him again for the future projects.`,
      name: 'Cubed Software',
    },
    {
      src: '/images/home/client4.png',
      alt: 'mk-eng',
      text: `Great company to work with! They helped us to integrate our client's external feature and code quality, the work was perfect and we appreciate to their help on this project Will hire him again for the future projects.`,
      name: 'MK Engineering',
    },
  ];

  return (
    <ContainerLayout className="py-10">
      <h2 className="md:text-4xl text-3xl text-center md:mb-10 mb-5">
        {`Client's Feedback`}
      </h2>
      <OwlCarousel
        items={1}
        margin={20}
        loop={true}
        center={true}
        autoplay={true}
        autoplayTimeout={10000}
        autoplaySpeed={5000}
        smartSpeed={2500}
        dots={false}
        autoplayHoverPause
      >
        {images.map((image, index) => (
          <div className="item" key={`slider-card-${index}`}>
            <SliderCard
              src={image.src}
              alt={image.alt}
              text={image.text}
              companyName={image.name}
            />
          </div>
        ))}
      </OwlCarousel>
    </ContainerLayout>
  );
}
