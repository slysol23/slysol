import Container from '@/components/Container';
import Footer from '@/components/Footer';
import GradientText from '@/components/GradientText';
import Header from '@/components/Header';
import HeaderInfo from '@/components/Header/HeaderInfo';
import PortfolioCard from '@/components/Portfolio/Card';
import SubTitle from '@/components/SubTitle';
import Title from '@/components/Title';
import React from 'react';
import Image from 'next/image';
import Section from '@/components/Section';
import PerfectCenter from '@/components/PerfectCenter';

const Portfolio = () => {
  return (
    <>
      <div className="relative md:h-[600px] h-[400px]">
        <Image
          src="/images/portfolio/portfolio-bg.webp"
          alt="Slysol team meeting on project"
          fill
          className="w-full h-auto object-cover object-left-top"
        />
        <div className="absolute w-full h-full bg-black top-0 opacity-30 z-[1]" />
        <div className="relative z-[2]">
          <HeaderInfo classes={{ root: 'text-white' }} />
        </div>
        <Container className="h-full z-[2]" hScreen={false}>
          <Header
            classes={{
              root: 'md:text-white',
              menuUnderline: 'md:bg-white',
              whiteLogo: true,
            }}
          />
          <PerfectCenter>
            <Title text="PORTFOLIO" className="text-center text-white" />
          </PerfectCenter>
        </Container>
      </div>
      <Section>
        <Container hScreen={false}>
          <div className="m-auto flex flex-col items-center">
            <SubTitle text="OUR PORTFOLIO" />
            <GradientText>
              <Title
                text="Slysol Create Top Notch Products"
                className="text-center"
              />
            </GradientText>
            <p className="text-mute md:w-2/3 text-center mt-5 md:mb-20 mb-10">
              Browse our portfolio to see how we have delivered innovative
              software solutions, turning challenges into opportunities for
              businesses in various industries.
            </p>
          </div>
          <PortfolioCard />
        </Container>
      </Section>
      <Footer />
    </>
  );
};

export default Portfolio;
