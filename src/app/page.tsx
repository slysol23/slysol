import Container from '@/components/Container';
import Button from '@/components/Button';
import Image from 'next/image';
import AnimatedStar from '@/components/Home/AnimatedStar';
import WhyUs from '@/components/Home/WhyUs';
import ScrollAnimation from '@/components/ScrollAnimation';
import WhatWeDo from '@/components/Home/WhatWeDo';
import Slider from '@/components/Home/ClientFeedback/Slider';
import { Metadata } from 'next';
import { CiMail, CiPhone } from 'react-icons/ci';
import Layout from '@/components/Layout';
import Header from '@/components/Header';
import SubTitle from '@/components/SubTitle';
import Section from '@/components/Section';
import MainHeading from '@/components/MainHeading';
import ServicesShowcase from '@/components/Home/ServicesShowcase';
import Title from '@/components/Title';
import GradientText from '@/components/GradientText';
import PerfectCenter from '@/components/PerfectCenter';

export const metadata: Metadata = {
  description:
    'Welcome to SlySol - Your Ultimate IT Solution Provider. Elevate your business with our expert Web Development, Application Development, and Internal App Development services. Unlock innovative solutions tailored to your needs and drive digital transformation with SlySol by your side.',
};

export default function Home() {
  return (
    <>
      {/* Header Section */}
      <div className="bg-gradient-to-r from-[#CBFCD8] via-[#B9E6E6] to-[#96BCFD]">
        <div className="border-b-[1px] md:text-sm text-xs sm:py-0 py-1">
          <Container
            hScreen={false}
            className="sm:h-[50px] flex sm:flex-row flex-col justify-between items-center gap-1"
          >
            <p>Mon-Fri: 11:00 AM - 8:00 PM</p>
            <div className="flex sm:flex-row flex-col sm:gap-5 gap-1 items-center">
              <div className="flex gap-1 items-center">
                <CiPhone />
                <p>+92-3104150111</p>
              </div>
              <div className="flex gap-1 items-center">
                <CiMail />
                <p>sheikh.haris.zahid@slysol.com</p>
              </div>
            </div>
          </Container>
        </div>
        <Container className="h-full" hScreen={false}>
          <Header />
          <Section>
            <div className="grid lg:grid-cols-2 md:gap-20 gap-10 items-center">
              <div>
                <SubTitle text="WELCOME TO OUR COMPANY" />
                <Title className="xl:w-2/3 lg:w-3/4 sm:w-1/2 w-2/3">
                  Clear Thinking Makes{' '}
                  <span className="text-primary2 font-semibold">
                    Bright Future!
                  </span>
                </Title>
                <p className="text-mute md:py-8 py-5">
                  The website design should be user-friendly, easy to navigate,
                  and aesthetically pleasing. It should be optimized for fast
                  loading times, and the layout should be consistent across all
                  pages.
                </p>
                <Button text="Discover More" className="py-3" />
              </div>
              <div className="relative lg:w-full sm:w-3/4 w-full m-auto">
                <div className="border-[2px] animate-fancyBorder2 py-3 absolute w-full h-full -translate-x-6 translate-y-10 border-slate" />
                <div className="border-[2px] animate-fancyBorder absolute w-full h-full border-secondary sm:translate-y-0 -translate-y-9" />
                <div className="sm:rounded-fancyRadius2 rounded-lg sm:h-[500px] h-[400px] relative overflow-hidden">
                  <Image
                    src="/images/home/header.png"
                    alt="company header"
                    fill
                    className="object-cover"
                  />
                </div>
              </div>
            </div>
          </Section>
        </Container>
      </div>

      {/* Who are we */}
      <Container hScreen={false}>
        <Section>
          <div className="grid lg:grid-cols-2 md:gap-20 gap-10 items-center">
            <Image
              src="/images/home/who-are-we.png"
              alt="team"
              width={1000}
              height={800}
              className="w-full h-auto rounded-lg lg:order-1 order-2"
            />
            <div className="lg:order-2 order-1">
              <SubTitle text="WHO ARE WE" />
              <Title text="Slysol" />
              <p className="md:mt-8 mt-5 text-mute">
                Lorem ipsum, dolor sit amet consectetur adipisicing elit. Veniam
                numquam dolor incidunt, vero quasi voluptas rerum voluptatibus
                quisquam. Commodi exercitationem nam eaque ratione distinctio
                fugiat officia incidunt vero! Harum reiciendis alias doloribus
                accusamus beatae. Laudantium quasi odio dolorum dicta culpa
                tenetur dolorem illum ipsum recusandae repellendus, quibusdam
                nesciunt sunt nam.
              </p>
              <button className="btn-outline md:py-3 mdpx-8 py-2 px-5 md:text-base text-sm md:mt-8 mt-5">
                LEARN MORE
              </button>
            </div>
          </div>
        </Section>
      </Container>

      {/* Modern Tech Section */}
      <div className="relative w-full h-screen bg-fixed bg-center bg-no-repeat bg-cover bg-modern-tech">
        <div className="absolute xl:left-1/4 lg:left-1/3 left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
          <SubTitle text="MODERN" white />
          <Title className="text-white xl:w-2/3 lg:w-3/4 sm:w-1/2 w-2/3">
            <h1>Tech & Software Design</h1>
          </Title>
        </div>
      </div>

      {/* Services Section */}
      <Container hScreen={false}>
        <Section>
          <div className="flex flex-col gap-3 justify-center items-center">
            <SubTitle text="OUR SERVICES" />
            <MainHeading text="Services We Provide" />
            <p className="text-mute sm:w-1/2 text-center">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi
              obortis ligula euismod sededesty am augue nisl.
            </p>
          </div>
          <ServicesShowcase />
        </Section>
      </Container>

      {/* Developing Better Future */}
      <div className="relative h-screen w-full">
        <Image
          src="/images/home/better-future.jpg"
          alt="white wave background"
          fill
        />
        <PerfectCenter className="text-center">
          <GradientText>
            <Title
              className="text-center font-semibold !leading-tight"
              text="Developing a Better Future for All Our Users."
            />
          </GradientText>
          <button className="btn-outline py-3 px-10 mt-8">VIEW MORE</button>
        </PerfectCenter>
      </div>

      {/* Innovative design approach */}
      <div className="relative">
        <div className="absolute w-full h-full bg-black opacity-40" />
        <video
          width="100%"
          height="100vh"
          autoPlay
          loop
          muted
          playsInline
          preload="none"
        >
          <source src="/videos/innovative-design.mp4" type="video/mp4" />
        </video>
        <PerfectCenter>
          <Title
            text="A Innovative & Futuristic Approach To Make Your Product Grow"
            className="text-white text-center font-semibold"
          />
        </PerfectCenter>
      </div>

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
    </>
  );
}
