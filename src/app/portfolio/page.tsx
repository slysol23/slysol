import Container from '@/components/Container';
import Footer from '@/components/Footer';
import GradientText from '@/components/GradientText';
import Header from '@/components/Header';
import HeaderInfo from '@/components/Header/HeaderInfo';
import PortfolioCards from '@/components/Portfolio/PortfolioCards';
import SubTitle from '@/components/SubTitle';
import Title from '@/components/Title';
import React from 'react';
import Image from 'next/image';
import Section from '@/components/Section';
import PerfectCenter from '@/components/PerfectCenter';

const Portfolio = () => {
  return (
    <>
      <div className="relative md:h-150 h-100">
        <Image
          src="https://res.cloudinary.com/dj6kzchpv/image/upload/v1776839982/portfolio-bg_11zon_gm9zte.png"
          alt="Slysol team meeting on project"
          fill
          className="w-full h-auto object-cover object-top-left"
        />
        <div className="absolute w-full h-full bg-black top-0 opacity-30 z-1" />
        <div className="relative z-2">
          <HeaderInfo classes={{ root: 'text-white' }} />
        </div>
        <Container className="h-full z-2" hScreen={false}>
          <Header
            classes={{
              root: 'md:text-white',
              menuUnderline: 'md:bg-white',
              whiteLogo: true,
            }}
          />
          <div className="absolute left-[10%] top-1/2 ">
            <Title text="PORTFOLIO" className=" text-white" />
          </div>
        </Container>
      </div>
      <Section>
        <Container hScreen={false}>
          <div className="m-auto flex flex-col items-center">
            <SubTitle text="OUR PORTFOLIO" />
            <GradientText>
              <Title
                text="Slysol Creates Top Notch Products"
                className="text-center md:mb-20 mb-10"
              />
            </GradientText>
          </div>
          <PortfolioCards />
        </Container>
      </Section>
      <Footer />
    </>
  );
};

export default Portfolio;
