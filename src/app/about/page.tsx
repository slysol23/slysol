import Banner from '@/components/Banner';
import Container from '@/components/Container';
import React from 'react';
import Image from 'next/image';
import SubTitle from '@/components/SubTitle';
import { AiFillCheckCircle } from 'react-icons/ai';
import WorkingCycle from '@/components/About/WorkingCycle';
import TeamMembers from '@/components/About/TeamMembers';
import Footer from '@/components/Footer';
import Title from '@/components/Title';
import Section from '@/components/Section';

const About = () => {
  return (
    <>
      <Banner text="ABOUT US" />
      {/* Welcome to our company */}
      <Container
        hScreen={false}
        className="grid lg:grid-cols-2 md:gap-20 gap-10 md:py-20 py-10 md:pb-20 pb-0 relative place-items-center"
      >
        <div className="grid grid-cols-[40%_60%] md:gap-5 max-w-fit place-items-center relative">
          <div className="flex flex-col md:gap-5 mr-3 md:mr-0">
            <Image
              src="/images/about/welcome-to-company1.jpg"
              alt="welcome to company"
              className="w-full rounded-md h-full mb-3 md:mb-0"
              width={200}
              height={0}
            />
            <Image
              src="/images/about/welcome-to-company2.jpg"
              alt="welcome to company"
              className="w-full rounded-md h-full"
              width={200}
              height={0}
            />
          </div>
          <div>
            <Image
              src="/images/about/welcome-to-company3.webp"
              alt="welcome to company"
              className="w-full rounded-xl h-full object-cover"
              width={200}
              height={0}
              objectFit="cover"
            />
          </div>
        </div>
        <div className="relative z-[1]">
          <SubTitle text="WELCOME TO OUR COMPANY" />
          <Title
            text="Make Your Business Great With Slysol"
            className="lg:mb-10 mb-5 font-normal lg:w-full sm:w-1/2 w-4/5"
          />
          <p className="text-gray-500 mb-3">
            {`Welcome to SlySol, your trusted partner in IT solutions. At SlySol,
            we are committed to delivering high-quality, innovative, and
            customized IT services that cater to the unique needs of your
            business. With a team of experienced professionals, we strive to
            provide top-notch solutions that help you achieve your business
            goals efficiently and effectively. Whether you're looking to
            streamline operations, enhance security, or boost productivity, we
            are here to support you every step of the way.`}
          </p>
          <p className="text-gray-500 md:mb-10 mb-5">
            Expand your business to new heights with SlySol. Our services are
            designed to empower your organization with the latest technology and
            best practices. Here’s why you should choose us:
          </p>
          <div className="flex flex-col sm:flex-row sm:gap-10 gap-5 md:mb-10 mb-5">
            <div>
              <h1 className="text-7xl font-bold text-primary2">2019</h1>
              <p className="font-bold text-sm mt-2">STARTED JOURNEY</p>
            </div>
            <div>
              <div className="flex gap-2 items-center mb-3">
                <AiFillCheckCircle className="text-primary2 text-2xl font-bold" />{' '}
                Emergency Solutions Anytime
              </div>
              <div className="flex gap-2 items-center mb-3">
                <AiFillCheckCircle className="text-primary2 text-2xl font-bold" />{' '}
                Affordable price up to 2 years
              </div>
              <div className="flex gap-2 items-center">
                <AiFillCheckCircle className="text-primary2 text-2xl font-bold" />{' '}
                Reliable & Experienced Team
              </div>
            </div>
          </div>
        </div>
        <div className="h-[80%] absolute -right-[15%] top-[10%] rounded-fancyRadius bg-primary2 w-1/2 opacity-20 lg:block hidden"></div>
      </Container>
      {/* Working Cycle */}
      <WorkingCycle />
      {/* Solution Provider */}
      <div className="w-full relative lg:bg-white bg-primary2">
        <Container hScreen={false}>
          <Section>
            <div className="grid lg:grid-cols-2 md:gap-20 gap-10 relative z-[1]">
              <div className="text-white flex flex-col lg:gap-8 gap-5 justify-center">
                <SubTitle text="TECHNOLOGY SOLUTION PROVIDER" white />
                <Title
                  text="The Best Technology Solution Provider."
                  className="font-semibold lg:w-full sm:w-2/3"
                />
                <p>
                  Our goal is to provide efficient and effective technology
                  solutions that help businesses achieve their objectives.
                </p>
              </div>
              <div>
                <Image
                  src="/images/about/solution-provider-01.webp"
                  width={600}
                  height={400}
                  alt="solution providers"
                  className="lg:w-full sm:w-2/3 w-full m-auto"
                />
              </div>
            </div>
          </Section>
        </Container>
        <Image
          src="/images/about/solution-provider.webp"
          fill
          alt="solution providers bg"
          className="lg:block hidden"
        />
      </div>
      {/* Team Members */}
      {/* <TeamMembers /> */}
      <Footer />
    </>
  );
};

export default About;
