import React from 'react';
import Image from 'next/image';
import BannerAnimation from './BannerAnimation';
import Title from '../Title';
import GradientText from '../GradientText';
import Header from '../Header';
import Container from '../Container';
import HeaderInfo from '../Header/HeaderInfo';

interface BannerProps {
  text: string;
}

const Banner = ({ text }: BannerProps) => {
  return (
    <>
      <div className="md:h-auto h-[400px] bg-gradient-to-r from-[#CBFCD8] via-[#B9E6E6] to-[#96BCFD] relative">
        <HeaderInfo />
        <Container hScreen={false}>
          <Header />
        </Container>
        <div className="md:h-[500px] h-[300px] flex items-center justify-center relative">
          <GradientText className="mb-[100px]">
            <Title text={text} />
          </GradientText>
          <div className="md:block hidden w-full absolute h-full bottom-0">
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
          <Image
            src="/images/banner/banner-wave-line.svg"
            className="w-full h-full bottom-0 z-[1] hidden xl:block text-primary2"
            fill
            alt="banner-wave"
          />
        </div>
      </div>
    </>
  );
};

export default Banner;
