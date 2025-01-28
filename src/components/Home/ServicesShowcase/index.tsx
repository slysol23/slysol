'use client';
import React from 'react';
import Image from 'next/image';
import GradientText from '@/components/GradientText';

const data = [
  {
    title: 'Software Development',
    imagePath: '/images/home/software-development.webp',
  },
  { title: 'AI Integration', imagePath: '/images/home/ai-integration.webp' },
  { title: 'Cloud Computing', imagePath: '/images/home/cloud-computing.webp' },
  { title: 'IT Consultant', imagePath: '/images/home/it-consultant.webp' },
  {
    title: 'Digital Marketing',
    imagePath: '/images/home/digital-marketing.webp',
  },
];

const ServicesShowcase = () => {
  const [currentImage, setCurrentImage] = React.useState(data[0].imagePath);
  const [active, setActive] = React.useState(data[0].title);
  const [opacity, setOpacity] = React.useState('100');

  const changeImage = (imagePath: string, title: string) => {
    setOpacity('20');
    setActive(title);
    setTimeout(() => {
      setCurrentImage(imagePath);
      setOpacity('100');
    }, 300);
  };

  return (
    <div className="lg:grid md:flex grid-cols-[1.5fr_1fr] lg:gap-20 md:gap-10 gap-5 sm:mt-10 mt-5">
      <div className="flex sm:flex-nowrap flex-wrap md:flex-col justify-center lg:order-2 order-1">
        {data.map((item, index) => (
          <h2
            className={`group relative md:py-3 md:ps-3 sm:p-2 p-1 lg:text-2xl md:text-lg sm:text-md text-xs font-semibold md:bg-inherit md:text-inherit md:border-r-0 border-mute ${
              active === item.title ? 'bg-primary2 text-white' : 'bg-slate'
            } ${index !== data.length - 1 ? 'border-r-[1px]' : ''}`}
            key={index}
            onMouseOver={() => changeImage(item.imagePath, item.title)}
          >
            <GradientText className="md:block hidden">
              {item.title}
            </GradientText>
            <div className="md:hidden block">{item.title}</div>
            <div className="absolute left-0 top-0 w-0.5 h-0 group-hover:h-full transition-all duration-500  bg-primary2 md:block hidden" />
          </h2>
        ))}
      </div>
      <div
        className={`w-full lg:h-[500px] md:h-[450px] sm:h-[550px] h-[330px] relative lg:order-1 order-2 transition-opacity opacity-${opacity} duration-1000 flex justify-center`}
      >
        <Image
          src="/images/home/service-bg.png"
          fill
          alt="bg"
          className="-translate-x-[50%] object-contain lg:block hidden"
        />
        <Image src={currentImage} alt="services showcase" fill />
      </div>
    </div>
  );
};

export default ServicesShowcase;
