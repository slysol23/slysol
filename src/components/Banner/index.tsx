import React from 'react';
import Image from 'next/image';
import BannerAnimation from './BannerAnimation';

interface BannerProps {
  text: string;
}

const Banner = ({ text }: BannerProps) => {
  return (
    <>
      <div className="flex h-[400px] bg-primary2 items-center justify-center relative">
        <h1 className="md:text-5xl text-3xl text-white font-neue font-bold relative">
          {text}
        </h1>
        <Image
          src="/images/banner/banner-wave-line.svg"
          className="w-full h-auto bottom-0 z-[1] hidden xl:block text-primary2"
          fill
          alt="banner-wave"
        />
        <div className="md:block hidden w-full absolute h-full">
          <BannerAnimation>
            <div className="p-2 bg-secondary rounded-full absolute top-1/2 -left-1"></div>
          </BannerAnimation>
          <BannerAnimation startPosition={450} duration={9}>
            <div className="p-2 bg-secondary rounded-full absolute bottom-0 left-1/3 opacity-50"></div>
          </BannerAnimation>
          <BannerAnimation startPosition={400} duration={8}>
            <div className="p-3 bg-secondary rounded-full absolute bottom-1/4 left-1/2 opacity-50"></div>
          </BannerAnimation>
          <BannerAnimation startPosition={300} duration={5}>
            <div className="p-1 bg-secondary rounded-full absolute bottom-1/2 right-1/4"></div>
          </BannerAnimation>
          <BannerAnimation duration={11}>
            <div className="p-4 bg-secondary rounded-full absolute bottom-1/2 right-[10%] opacity-50 z-[1]"></div>
          </BannerAnimation>
        </div>
      </div>
      <div className="relative md:block hidden">
        <Image
          src="/images/banner/banner-wave.svg"
          className="w-full relative -translate-y-1"
          width={0}
          height={0}
          alt="banner-wave"
        />
      </div>
    </>
  );
};

export default Banner;
