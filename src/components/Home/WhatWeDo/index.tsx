'use client';
import ContainerLayout from '@/components/ContainerLayout';
import React from 'react';
import Card from './card';
import Slider from '@/components/Slider';

const WhatWeDo = () => {
  const cardsData = [
    {
      imageSrc: '/images/home/card1.png',
      heading: 'Mobile App Development',
      description:
        'Lorem ipsum dolor sit amet consectetur adipisicing elit. Nisi, excepturi.',
    },
    {
      imageSrc: '/images/home/card2.png',
      heading: 'Web App Development',
      description:
        'Lorem ipsum dolor sit amet consectetur adipisicing elit. Nisi, excepturi.',
    },
    {
      imageSrc: '/images/home/card3.png',
      heading: 'Internal App Development',
      description:
        'Lorem ipsum dolor sit amet consectetur adipisicing elit. Nisi, excepturi.',
    },
  ];

  return (
    <div className="bg-blue md:py-20 py-10 text-white">
      <ContainerLayout>
        <h2 className="text-center md:text-4xl text-3xl md:mb-10 mb-5">
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
      </ContainerLayout>
    </div>
  );
};

export default WhatWeDo;
