'use client';
import React from 'react';
import Image from 'next/image';

const data = [
  {
    title: 'Software Development',
    imagePath: '/images/home/software-development.png',
  },
  { title: 'AI Integration', imagePath: '/images/home/ai-integration.png' },
  { title: 'Cloud Computing', imagePath: '/images/home/cloud-services.png' },
  { title: 'IT Consultant', imagePath: '/images/home/it-consultancy.png' },
  {
    title: 'Digital Marketing',
    imagePath: '/images/home/digital-marketing.png',
  },
];

const ServicesShowcase = () => {
  const [currentImage, setCurrentImage] = React.useState(data[0].imagePath);
  const [opacity, setOpacity] = React.useState('100');

  const changeImage = (imagePath: string) => {
    setOpacity('20');
    setTimeout(() => {
      setCurrentImage(imagePath);
      setOpacity('100');
    }, 300);
  };

  return (
    <div className="grid grid-cols-2 md:gap-20 gap-10">
      <div
        className={`w-full h-[500px] relative transition-opacity opacity-${opacity} duration-1000`}
      >
        <Image
          src="/images/home/service-bg.png"
          fill
          alt="bg"
          className="-translate-x-28 h-[500px]"
        />
        <Image
          src={currentImage}
          alt="Dynamic"
          fill
          className="object-contain"
        />
      </div>
      <div className="flex flex-col justify-center">
        {data.map((item, index) => (
          <h2
            className="group relative py-3 ps-3 md:text-2xl sm:text-xl text-lg font-semibold"
            key={index}
            onMouseOver={() => changeImage(item.imagePath)}
          >
            {item.title}
            <div className="absolute left-0 top-0 w-0.5 h-0 group-hover:h-full transition-all duration-500  bg-primary2"></div>
          </h2>
        ))}
      </div>
    </div>
  );
};

export default ServicesShowcase;
