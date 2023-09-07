import Container from '@/components/Container';
import Button from '@/components/Button';
import Image from 'next/image';
import AnimatedStar from '@/components/Home/AnimatedStar';
import WhyUs from '@/components/Home/WhyUs';
import ScrollAnimation from '@/components/ScrollAnimation';
import WhatWeDo from '@/components/Home/WhatWeDo';
import Slider from '@/components/Home/ClientFeedback/Slider';
import { Metadata } from 'next';
import Layout from '@/components/Layout';

export const metadata: Metadata = {
  description:
    'Welcome to SlySol - Your Ultimate IT Solution Provider. Elevate your business with our expert Web Development, Application Development, and Internal App Development services. Unlock innovative solutions tailored to your needs and drive digital transformation with SlySol by your side.',
};

export default function Home() {
  return (
    <Layout>
      <Container className="py-5 pt-10 md:pt-5">
        <div className="grid md:grid-cols-[40%_60%] gap-5">
          <div className="md:my-auto">
            <h1
              className="lg:text-5xl md:text-4xl text-3xl font-bold
             text-[#6F83DC] font-neue"
            >
              Your <br /> <span className="text-[#EB577B]">Gateway</span> <br />{' '}
              To Clever <br /> IT Solutions
            </h1>
            <ScrollAnimation>
              <a href="mailto:sheikh.haris.zahid@slysol.com">
                <Button
                  text="REQUEST A CONSULTATION"
                  className="md:mt-10 mt-5"
                />
              </a>
            </ScrollAnimation>
          </div>
          <div className="flex items-center md:justify-end justify-center            md:-translate-x-0 -translate-x-[5%]">
            <AnimatedStar>
              <Image
                src="/images/home/star-vector.png"
                alt="united hands"
                width={120}
                height={120}
              />
            </AnimatedStar>
            <div>
              <Image
                src="/images/home/header.png"
                alt="united hands"
                width={600}
                height={600}
              />
            </div>
          </div>
        </div>
      </Container>

      {/* CUSTOM SOFTWARE SOLUTIONS */}
      <div
        className="bg-gradient-to-r from-[#CBFCD8] via-[#B9E6E6] to-[#96BCFD]
        md:py-20 py-10"
      >
        <Container className="grid md:grid-cols-2 gap-10">
          <ScrollAnimation startPosition={100}>
            <Image
              src="/images/home/custom-software.png"
              alt="custom software creation"
              height={400}
              width={400}
              className="md:mx-0 mx-auto"
            />
          </ScrollAnimation>
          <div className="my-auto">
            <ScrollAnimation>
              <h1 className="md:text-4xl text-3xl font-bold">
                Custom Software Solution? Count on us.
              </h1>
            </ScrollAnimation>
            <p className="mt-5 sm:text-base text-sm">
              {`When it comes to custom software solutions, look no further. Slysol is your dedicated partner in turning your unique ideas into reality. With a proven track record of delivering innovative and efficient software tailored to your specific needs, we take pride in our ability to transform challenges into opportunities. Our team of experts is committed to understanding your vision and crafting a bespoke software solution that not only meets but exceeds your expectations. Experience the power of personalized software with us, and let's embark on a journey to reshape the way you do business. Your aspirations, our expertise – together, we build the extraordinary.`}
            </p>
          </div>
        </Container>
      </div>

      {/* WHAT WE DO SECTION */}
      <WhatWeDo />

      {/* WHY US SECTION */}
      <WhyUs />

      {/* Faciltating the formation */}
      <div className="bg-blue">
        <Container className="md:py-20 py-10">
          <h1
            className="md:leading-[60px] lg:text-[48px] md:text-4xl text-3xl text-center
           text-white lg:px-40 md:px-32 font-neue"
          >
            Faciltating the formation of more robust teams, Slysol empower both
            businesses and individuals to swiftly cultivate improved software
            and quality systems.
          </h1>
        </Container>
      </div>

      {/* Clients Feedback */}
      <Slider />
    </Layout>
  );
}
