import ContainerLayout from '@/components/ContainerLayout';
import Button from '@/components/Button';
import Image from 'next/image';
import AnimatedStar from '@/components/Home/AnimatedStar';
import WhyUs from '@/components/Home/WhyUs';
import ScrollAnimation from '@/components/ScrollAnimation';
import WhatWeDo from '@/components/Home/WhatWeDo';
import Slider from '@/components/Home/ClientFeedback/Slider';

export default function Home() {
  return (
    <>
      <ContainerLayout className="py-5 pt-10 md:pt-5">
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
              <Button text="REQUEST A CONSULTATION" className="md:mt-10 mt-5" />
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
      </ContainerLayout>

      {/* CUSTOM SOFTWARE SOLUTIONS */}
      <div
        className="bg-gradient-to-r from-[#CBFCD8] via-[#B9E6E6] to-[#96BCFD]
        md:py-20 py-10"
      >
        <ContainerLayout className="grid md:grid-cols-2 gap-10">
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
              Lorem ipsum dolor, sit amet consectetur adipisicing elit. Delectus
              consectetur, saepe laudantium sint ab aliquid reiciendis enim
              similique distinctio animi sed obcaecati nam vero magnam commodi.
              Et, vel. At cum maxime perferendis nesciunt impedit nulla
              doloribus placeat incidunt culpa distinctio?
            </p>
          </div>
        </ContainerLayout>
      </div>

      {/* WHAT WE DO SECTION */}
      <WhatWeDo />

      {/* WHY US SECTION */}
      <WhyUs />

      {/* Faciltating the formation */}
      <div className="bg-blue">
        <ContainerLayout className="md:py-20 py-10">
          <h1
            className="md:leading-[60px] lg:text-[48px] md:text-4xl text-3xl text-center
           text-white lg:px-40 md:px-32 font-neue"
          >
            Faciltating the formation of more robust teams, we empower both
            businesses and individuals to swiftly cultivate improved software
            and quality systems.
          </h1>
        </ContainerLayout>
      </div>

      {/* Clients Feedback */}
      <Slider />
    </>
  );
}
