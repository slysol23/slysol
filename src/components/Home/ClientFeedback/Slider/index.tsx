'use client';

import dynamic from 'next/dynamic';
import 'owl.carousel/dist/assets/owl.carousel.css';
import 'owl.carousel/dist/assets/owl.theme.default.css';
import React, { useEffect } from 'react';

import SliderCard from './sliderCard';
import Container from '@/components/Container';
import Title from '@/components/Title';
import Section from '@/components/Section';

const OwlCarousel = dynamic(() => import('react-owl-carousel'), {
  ssr: false,
});

export default function Slider() {
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const $ = require('jquery');
      window.$ = window.jQuery = $;
    }
  }, []);

  const images = [
    {
      src: '/images/home/client1.webp',
      alt: 'alignerbase',
      text: `What an amazing experience working with this company! Their expertise in integrating our client's external features and ensuring top-notch code quality was truly impressive. The outcome of the project was flawless, and we are genuinely grateful for their invaluable assistance. Without a doubt, we'll be reaching out to them for our upcoming projects.`,
      name: 'Alignerbase',
    },
    {
      src: '/images/home/client2.png',
      alt: 'orange-shine',
      text: `Working alongside this company was an absolute pleasure! Their adeptness at seamlessly incorporating our client's external feature while upholding impeccable code standards was remarkable. We extend our heartfelt gratitude for their pivotal role in making this project a success. We're eagerly looking forward to collaborating with them again in our future endeavors.`,
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
      text: `We're extremely pleased with the services provided by this company! Their exceptional work speaks volumes about their commitment to excellence. The project was executed flawlessly, and their assistance was invaluable. Without a doubt, we'll be reaching out to collaborate on future projects.`,
      name: 'MK Engineering',
    },
  ];

  return (
    <Section>
      <Container hScreen={false}>
        <Title
          text={`Client's Feedback`}
          className="text-center md:mb-10 mb-5 font-normal"
        />
        <OwlCarousel
          items={3}
          responsive={{
            0: {
              items: 1,
            },
            768: {
              items: 2,
            },
            1024: {
              items: 3,
            },
          }}
          margin={20}
          loop={true}
          center={true}
          autoplay={true}
          autoplayTimeout={10000}
          autoplaySpeed={5000}
          smartSpeed={2500}
          dots={false}
          slideBy={1}
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
      </Container>
    </Section>
  );
}
