import Banner from '@/components/Banner';
import Container from '@/components/Container';
import Layout from '@/components/Layout';
import React from 'react';
import Image from 'next/image';
import SubTitle from '@/components/SubTitle';
import { AiFillCheckCircle } from 'react-icons/ai';
import WorkingCycle from '@/components/About/WorkingCycle';
import TeamMembers from '@/components/About/TeamMembers';

const About = () => {
  return (
    <Layout>
      <Banner text="ABOUT US" />
      {/* Welcome to our company */}
      <Container
        hScreen={false}
        className="grid lg:grid-cols-2 md:gap-20 gap-10 md:py-20 py-10 relative place-items-center"
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
              src="/images/about/welcome-to-company3.jpg"
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
          <h1 className="md:text-5xl text-3xl md:my-10 my-5">
            Make Your Business Great With Slysol
          </h1>
          <p className="text-gray-500 md:my-10 my-5">
            An IT solution service company may serve clients from various
            industries such as healthcare, finance, education, and
            manufacturing. They may work on a project basis...
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
        <Container className="lg:py-[100px] md:py-20 py-10" hScreen={false}>
          <div className="grid lg:grid-cols-2 gap-20 relative z-[1]">
            <div className="text-white flex flex-col gap-8 justify-center">
              <SubTitle text="TECHNOLOGY SOLUTION PROVIDER" white />
              <h1 className="md:text-5xl text-3xl">
                The Best Technology Solution Provider.
              </h1>
              <p>
                The goal of IT services is to provide efficient and effective
                technology solutions that help businesses achieve their
                objectives.{' '}
              </p>
            </div>
            <div>
              <Image
                src="/images/about/solution-provider-01.png"
                width={600}
                height={400}
                alt="solution providers"
                className="lg:w-full w-2/3 m-auto"
              />
            </div>
          </div>
        </Container>
        <Image
          src="/images/about/solution-provider.png"
          fill
          alt="solution providers bg"
          className="lg:block hidden"
        />
      </div>
      {/* Team Members */}
      <TeamMembers />
    </Layout>
  );
};

export default About;
