import React from 'react';
import Container from '@/components/Container';
import SubTitle from '@/components/SubTitle';
import WorkingCycle1 from '@/images/about/working-cycle-01';
import WorkingCycle2 from '@/images/about/working-cycle-02';
import WorkingCycle3 from '@/images/about/working-cycle-03';
import WorkingCycle4 from '@/images/about/working-cycle-04';
import Image from 'next/image';

const workingCycle = [
  {
    logo: <WorkingCycle1 />,
    title: 'Project Discussion',
    description:
      'Extensible for web iterate process before meta services impact with olisticly enable client.',
  },
  {
    logo: <WorkingCycle2 />,
    title: 'Testing & Trying ',
    description:
      'Extensible for web iterate process before meta services impact with olisticly enable client.',
  },
  {
    logo: <WorkingCycle3 />,
    title: 'Execute & install ',
    description:
      'Extensible for web iterate process before meta services impact with olisticly enable client.',
  },
  {
    logo: <WorkingCycle4 />,
    title: 'We Care About ',
    description:
      'Extensible for web iterate process before meta services impact with olisticly enable client.',
  },
];

const WorkingCycle = () => {
  return (
    <Container hScreen={false} className="md:py-20 py-10">
      <div className="flex flex-col items-center pb-10">
        <SubTitle text="WORKING CYCLE" />
        <h1 className="md:text-5xl text-3xl py-5">Our Working Cycle</h1>
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
              <h1 className="md:text-2xl text-xl font-bold mb-3">
                {data.title}
              </h1>
              <p>{data.description}</p>
            </div>
          </div>
        ))}
      </div>
    </Container>
  );
};

export default WorkingCycle;
