import React from 'react';
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

const page = () => {
  const headerData = [
    {
      src: '/images/services/service-bg-1.svg',
      alt: 'era of ai',
      title: 'A New Era Of Digital Business Platforms',
      subTitle: 'MODERN TECHNOLOGY SOLUTION',
      description:
        'Lorem ipsum dolor sit amet consectetur adipisicing elit. Eveniet aut accusantium quas sapiente vitae ducimus praesentium dolor nam porro laborum ad, minus delectus temporibus, quisquam recusandae, minima voluptas autem facilis.',
    },
    {
      src: '/images/services/service-bg-2.svg',
      alt: 'integrating needs',
      title: 'Seamless Integration for Scalable Growth',
      subTitle: 'INTEGRATING YOUR NEEDS',
      description:
        'Lorem ipsum dolor sit amet consectetur adipisicing elit. Eveniet aut accusantium quas sapiente vitae ducimus praesentium dolor nam porro laborum ad, minus delectus temporibus, quisquam recusandae, minima voluptas autem facilis.',
    },
    {
      src: '/images/services/service-bg-3.svg',
      alt: 'developing softwares',
      title: 'Empowering Through Cutting-Edge Solutions',
      subTitle: 'INNOVATIVE APPROACH',
      description:
        'Lorem ipsum dolor sit amet consectetur adipisicing elit. Eveniet aut accusantium quas sapiente vitae ducimus praesentium dolor nam porro laborum ad, minus delectus temporibus, quisquam recusandae, minima voluptas autem facilis.',
    },
  ];

  const servicesData = [
    {
      title: 'Software Development',
      description:
        'Lorem ipsum dolor sit, amet consectetur adipisicing elit.Quisquam fugiat quaerat, recusandae nesciunt, exercitationem error labore, beatae perspiciatis provident cumque facere nobis nemo quibusdam similique? Soluta esse dolorum odio earum similique accusantium ea suscipit blanditiis.',
      src: '/images/services/service-1.svg',
    },
    {
      title: 'Application Development',
      description:
        'Lorem ipsum dolor sit, amet consectetur adipisicing elit.Quisquam fugiat quaerat, recusandae nesciunt, exercitationem error labore, beatae perspiciatis provident cumque facere nobis nemo quibusdam similique? Soluta esse dolorum odio earum similique accusantium ea suscipit blanditiis.',
      src: '/images/services/service-2.svg',
    },
    {
      title: 'AI Integration',
      description:
        'Lorem ipsum dolor sit, amet consectetur adipisicing elit.Quisquam fugiat quaerat, recusandae nesciunt, exercitationem error labore, beatae perspiciatis provident cumque facere nobis nemo quibusdam similique? Soluta esse dolorum odio earum similique accusantium ea suscipit blanditiis.',
      src: '/images/services/service-3.svg',
    },
    {
      title: 'UI / UX',
      description:
        'Lorem ipsum dolor sit, amet consectetur adipisicing elit.Quisquam fugiat quaerat, recusandae nesciunt, exercitationem error labore, beatae perspiciatis provident cumque facere nobis nemo quibusdam similique? Soluta esse dolorum odio earum similique accusantium ea suscipit blanditiis.',
      src: '/images/services/service-4.svg',
    },
    {
      title: 'Digital Marketing',
      description:
        'Lorem ipsum dolor sit, amet consectetur adipisicing elit.Quisquam fugiat quaerat, recusandae nesciunt, exercitationem error labore, beatae perspiciatis provident cumque facere nobis nemo quibusdam similique? Soluta esse dolorum odio earum similique accusantium ea suscipit blanditiis.',
      src: '/images/services/service-5.svg',
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
        autoplay={true}
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
                className="object-cover animate-bgZoom"
              />
              <div className="absolute w-full h-full bg-white md:hidden opacity-20"></div>
              <Container hScreen={false} className="relative">
                <div className="lg:w-[60%] md:w-[70%] sm:w-[80%] w-[90%] relative">
                  <SubTitle text={data.subTitle} />
                  <GradientText className="mt-2">
                    <Title text={data.title} className="lg:text-6xl" />
                  </GradientText>
                  <p className="sm:w-2/3 sm:py-8 py-5 text-mute">
                    {data.description}
                  </p>
                  <button className="btn-outline md:px-10 md:py-3 px-7 py-2 md:text-base text-sm">
                    VIEW MORE
                  </button>
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
                Lorem, ipsum dolor sit amet consectetur adipisicing elit. Sint a
                cumque, minima perspiciatis aliquid doloribus, et earum sunt eos
                alias deserunt tenetur exercitationem aspernatur, nostrum esse
                commodi dolor error beatae.
              </p>
            </div>
          </div>
          {servicesData.map((service, index) => {
            const even = (index + 1) % 2 === 0;
            return (
              <>
                <div
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

export default page;
