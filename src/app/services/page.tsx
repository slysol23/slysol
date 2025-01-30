'use client';
import React, { useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import Image from 'next/image';
import SubTitle from '@/components/SubTitle';
import Title from '@/components/Title';
import GradientText from '@/components/GradientText';
import Container from '@/components/Container';
import Carousal from '@/components/Slider';
import HeaderInfo from '@/components/Header/HeaderInfo';
import Header from '@/components/Header';
import Section from '@/components/Section';
import MainHeading from '@/components/MainHeading';
import GradientBg from '@/components/GradientBg';
import PerfectCenter from '@/components/PerfectCenter';
import Footer from '@/components/Footer';
import { idText } from 'typescript';

const ServicesPage = () => {
  const searchParams = useSearchParams();

  useEffect(() => {
    const section = searchParams.get('section');
    if (section) {
      const element = document.getElementById(section);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  }, [searchParams]);

  const headerData = [
    {
      src: '/images/services/service-bg-1.svg',
      alt: 'era of ai',
      title: 'A New Era Of Digital Business Platforms',
      subTitle: 'MODERN TECHNOLOGY SOLUTION',
      description:
        'Our solutions streamline operations and enhance efficiency. With customizable and intuitive platforms. Transform your  business and stay ahead of market demands. Join us to achieve sustainable growth with ease.',
    },
    {
      src: '/images/services/service-bg-2.svg',
      alt: 'integrating needs',
      title: 'Seamless Integration for Scalable Growth',
      subTitle: 'INTEGRATING YOUR NEEDS',
      description:
        'Achieve scalable growth with our seamless integration solutions. Connect your systems and processes for a unified workflow. Enhance productivity and drive performance with our tailored solutions. Partner with us for a connected, efficient operation and sustainable growth.',
    },
    {
      src: '/images/services/service-bg-3.svg',
      alt: 'developing softwares',
      title: 'Empowering Through Cutting-Edge Solutions',
      subTitle: 'INNOVATIVE APPROACH',
      description:
        'Empower your business with our cutting edge solution. We offer AI integrated solutions with current market trends, advanced cloud services and more to enhance efficiency and foster growth. Partner with us for new opportunities and achieve your business goals through innovation.',
    },
  ];

  const servicesData = [
    {
      title: 'Software Development',
      description:
        'We deliver high-quality, custom software solutions tailored to your business needs. Our team of experts ensures seamless integration, scalability, and performance, enabling you to achieve your goals efficiently and effectively.',
      src: '/images/services/service-1.webp',
      id: 'software-development',
    },
    {
      title: 'Application Development',
      description:
        'We create robust and user-friendly applications for various platforms. From initial concept to final deployment, we ensure your app meets the highest standards of functionality, security, and usability.',
      src: '/images/services/service-2.webp',
      id: 'application-development',
    },
    {
      title: 'AI Integration',
      description:
        'We integrate advanced AI technologies to enhance your business processes. Our AI solutions streamline operations, improve decision-making, and drive innovation, giving you a competitive edge in the market.',
      src: '/images/services/service-3.webp',
      id: 'ai-integration',
    },
    {
      title: 'UI / UX',
      description:
        'We design intuitive and engaging user interfaces and experiences. Our focus is on creating visually appealing and user-centric designs that enhance user satisfaction and drive business success.',
      src: '/images/services/service-4.webp',
      id: 'ui-ux',
    },
    {
      title: 'Digital Marketing',
      description:
        'We offer comprehensive digital marketing services to boost your online presence. Our strategies include SEO, social media, and content marketing, designed to attract and engage your target audience effectively.',
      src: '/images/services/service-5.webp',
      id: 'digital-marketing',
    },
  ];

  return (
    // Header
    <>
      <HeaderInfo />
      <Container hScreen={false}>
        <Header />
      </Container>
      <Carousal
        // autoplay={true}
        autoplayTimeout={8000}
        autoplaySpeed={2000}
        items={1}
        margin={0}
        nav
        navText={[
          `<img src='/icons/arrow-left.svg' class='md:mr-5 mr-2 ml-5 md:w-12 w-8'>`,
          `<img src='/icons/arrow-right.svg' class='md:w-12 mr-5 w-8 text-end'>`,
        ]}
        className="md:pb-0 pb-5"
      >
        {headerData.map((data) => (
          <div className="item" key={data.alt}>
            <div className="relative lg:h-screen h-[400px] flex items-center">
              <Image
                src={data.src}
                alt={data.alt}
                fill
                className="object-cover animate-bgZoom md:opacity-100 opacity-0"
              />
              {/* <div className="absolute w-full h-full bg-white md:hidden opacity-50"></div> */}
              <Container hScreen={false} className="relative">
                <div className="lg:w-[60%] md:w-[70%] md:block flex flex-col items-center relative">
                  <SubTitle text={data.subTitle} />
                  <GradientText className="mt-2">
                    <Title
                      text={data.title}
                      className="lg:text-6xl md:text-start text-center"
                    />
                  </GradientText>
                  <p className="sm:w-2/3 sm:py-8 py-5 text-mute md:text-start text-center">
                    {data.description}
                  </p>
                </div>
              </Container>
            </div>
          </div>
        ))}
      </Carousal>
      <Container hScreen={false}>
        <Section className="md:py-20 py-0">
          <div className="text-center flex flex-col items-center">
            <SubTitle text="OUR SERVICES" />
            <Title
              text="Our Business Focus"
              className="font-normal my-5 md:mt-5 mt-0"
            />
            <div className="flex justify-center">
              <p className="text-mute md:w-2/3">
                {`We focus on creating innovative software solutions that drive
                success and transform industries. We specialize in software
                development, understanding our clients' unique challenges, and
                delivering customized technology to meet their needs.`}
              </p>
            </div>
          </div>
          {servicesData.map((service, index) => {
            const even = (index + 1) % 2 === 0;
            const sectionId = service.id;
            return (
              <>
                <div
                  id={sectionId}
                  className={`grid md:grid-cols-2 md:gap-0 gap-10 md:mb-0 mb-10 ${
                    index === 0 && 'md:pt-20 pt-10'
                  } ${index === servicesData.length - 1 && 'mb-0'}`}
                >
                  <div
                    className={`gradient-border relative ${
                      even
                        ? 'order-2 md:border-l-[1px]'
                        : 'md:order-1 order-2 md:border-r-[1px]'
                    }`}
                  >
                    <PerfectCenter
                      className={`w-full ${
                        even ? 'justify-start' : 'justify-end'
                      } md:flex hidden`}
                    >
                      <GradientBg
                        className={`p-2 rounded-full w-fit ${
                          even ? '-translate-x-[9px]' : 'translate-x-[9px]'
                        } opacity-70 relative`}
                      />
                    </PerfectCenter>
                    <Image
                      src={service.src}
                      alt={service.title}
                      width={1000}
                      height={1000}
                      className="md:w-full sm:w-2/3 w-full h-auto m-auto"
                    />
                  </div>
                  <div
                    className={`flex items-center ${
                      even ? 'order-1' : 'md:order-2 order-1'
                    }`}
                  >
                    <div
                      className={`relative lg:px-20 md:px-14 md:py-14 pt-14 ${
                        even ? '!pl-0' : '!pr-0'
                      }`}
                    >
                      <GradientText className="opacity-20 absolute top-0">
                        <h1 className="font-neue text-9xl font-bold">
                          0{index + 1}
                        </h1>
                      </GradientText>
                      <MainHeading text={service.title} className="mb-3 pt-5" />
                      <p className="text-mute">{service.description}</p>
                    </div>
                  </div>
                </div>
              </>
            );
          })}
        </Section>
      </Container>
      <Footer />
    </>
  );
};

export default ServicesPage;
