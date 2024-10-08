import React from 'react';
import Container from '@/components/Container';
import SubTitle from '@/components/SubTitle';
import WorkingCycle1 from '@/images/about/working-cycle-01';
import WorkingCycle2 from '@/images/about/working-cycle-02';
import WorkingCycle3 from '@/images/about/working-cycle-03';
import WorkingCycle4 from '@/images/about/working-cycle-04';
import Image from 'next/image';
import Section from '../Section';
import Title from '../Title';
import MainHeading from '../MainHeading';

const workingCycle = [
  {
    logo: <WorkingCycle1 />,
    title: 'Project Discussion',
    description:
      'We start by understanding your needs and goals through detailed discussions.',
  },
  {
    logo: <WorkingCycle2 />,
    title: 'Testing & Trying ',
    description:
      'We rigorously test and refine our solutions to ensure they meet your requirements.',
  },
  {
    logo: <WorkingCycle3 />,
    title: 'Execute & install ',
    description:
      'We implement and install the solution seamlessly, ensuring minimal disruption to your operations.',
  },
  {
    logo: <WorkingCycle4 />,
    title: 'We Care About ',
    description:
      'We provide ongoing support and maintenance, ensuring your systems run smoothly and efficiently.',
  },
];

const WorkingCycle = () => {
  return (
    <Container hScreen={false}>
      <Section>
        <div className="flex flex-col items-center pb-10">
          <SubTitle text="WORKING CYCLE" />
          <Title text="Our Working Cycle" className="py-5 font-normal" />
        </div>
        <div className="grid lg:grid-cols-4 sm:grid-cols-2 md:gap-20 gap-10">
          {workingCycle.map((data, index) => (
            <div
              key={index}
              className={`flex relative flex-col gap-5 items-center lg:even:pt-12 group`}
            >
              <div className="rounded-full shadow-[0px_9px_75px_rgba(8,20,44,0.09)] flex items-center justify-center h-[130px] w-[130px] text-[5rem] text-primary2  group-hover:text-white group-hover:bg-primary2 relative">
                {data.logo}
                <div
                  className="flex items-center justify-center h-[45px] w-[45px] border-[5px] border-white absolute 
          top-0 right-0 text-sm font bold rounded-full bg-primary2 text-white"
                >
                  0{index + 1}
                </div>
              </div>
              {index <= 2 && (
                <Image
                  src="/images/about/working-cycle-arrow.png"
                  width={100}
                  height={100}
                  alt="arrow"
                  className={`lg:block hidden absolute -xl:right-[30%] -right-[40%] ${
                    index === 1 ? 'bottom-[50%] -scale-y-100' : 'top-0'
                  }`}
                />
              )}
              <div className="text-center">
                <MainHeading text={data.title} className="mb-3" />
                <p>{data.description}</p>
              </div>
            </div>
          ))}
        </div>
      </Section>
    </Container>
  );
};

export default WorkingCycle;
