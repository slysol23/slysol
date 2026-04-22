'use client';
import Container from '@/components/Container';
import React from 'react';
import Card from './card';
import Slider from '@/components/Slider';

const WhatWeDo = () => {
  const cardsData = [
    {
      imageSrc:
        'https://res.cloudinary.com/dj6kzchpv/image/upload/v1776837340/card1_11zon_ck35zv.webp',
      heading: 'Mobile App Development',
      description:
        'Experience our user-centric mobile apps, perfect for boosting your brand.',
    },
    {
      imageSrc:
        'https://res.cloudinary.com/dj6kzchpv/image/upload/v1776837511/card2_11zon_juxsgc.webp',
      heading: 'Web App Development',
      description:
        'From concept to reality, we create engaging web apps that captivate audiences.',
    },
    {
      imageSrc:
        'https://res.cloudinary.com/dj6kzchpv/image/upload/v1776837511/card3_11zon_sy1ml4.webp',
      heading: 'Internal App Development',
      description:
        'Tailored apps that optimize workflows, enhancing business efficiency.',
    },
  ];

  return (
    <div className="bg-blue md:py-20 py-10 text-white">
      <Container>
        <h2 className="text-center md:text-4xl text-3xl md:mb-10 mb-5 font-neue">
          What We Can <br className="md:hidden" /> Do For You
        </h2>
        <Slider className="md:px-20">
          {cardsData.map((data, index) => (
            <Card
              imageSrc={data.imageSrc}
              heading={data.heading}
              description={data.description}
              key={`slider-card-${index}`}
            />
          ))}
        </Slider>
      </Container>
    </div>
  );
};

export default WhatWeDo;
