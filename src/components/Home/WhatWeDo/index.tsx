import ContainerLayout from '@/components/ContainerLayout';
import React from 'react';
import Card from './card';
// import SlickSlider from '@/components/Slider';

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
    <div className="bg-blue md:py-20 py-10">
      <ContainerLayout className="grid grid-cols-3 gap-10">
        {/* <SlickSlider>
          {cardsData.map((data, index) => (
            <Card
              key={`cardsData-${index}`}
              imageSrc={data.imageSrc}
              heading={data.heading}
              description={data.description}
            />
          ))}
        </SlickSlider> */}
      </ContainerLayout>
    </div>
  );
};

export default WhatWeDo;
