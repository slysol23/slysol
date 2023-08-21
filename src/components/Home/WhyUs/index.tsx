import ContainerLayout from '@/components/ContainerLayout';
import ScrollAnimation from '@/components/ScrollAnimation';
import Image from 'next/image';
import React from 'react';

const WhyUs = () => {
  const whyUsContent = [
    {
      imageSrc: '/images/home/why-us1.png',
      heading: 'Lorem ipsum dolor',
      description: 'sit amet consectetur adipisicing elit. dolor sit amet',
    },
    {
      imageSrc: '/images/home/why-us2.png',
      heading: 'Lorem ipsum dolor',
      description: 'sit amet consectetur adipisicing elit. dolor sit amet',
    },
    {
      imageSrc: '/images/home/why-us3.png',
      heading: 'Lorem ipsum dolor',
      description: 'sit amet consectetur adipisicing elit. dolor sit amet',
    },
  ];

  return (
    <ContainerLayout className="md:py-20 py-10">
      <h1 className="text-center md:text-4xl text-3xl">Why Us</h1>
      <div
        className="grid lg:grid-cols-[12.5%_25%_25%_25%_12.5%]
       md:grid-cols-3 gap-10 justify-center sm:pt-10 pt-5"
      >
        <div className="hidden lg:block"></div>
        {whyUsContent.map((content, index) => (
          <div key={`whyUsContent-${index}`} className="text-center">
            <ScrollAnimation>
              <Image
                src={content.imageSrc}
                alt={content.heading}
                width={200}
                height={200}
                className="mx-auto mb-5"
              />
            </ScrollAnimation>
            <h3 className="font-bold mb-2">{content.heading}</h3>
            <p className="text-sm">{content.description}</p>
          </div>
        ))}
      </div>
    </ContainerLayout>
  );
};

export default WhyUs;
