'use client';
import React, { useState } from 'react';
import Section from '../Section';
import Container from '../Container';
import MainHeading from '../MainHeading';
import Title from '../Title';
import Image from 'next/image';

interface TabsData {
  tab: string;
  title: string;
  imageSrc: string;
  description: string;
}

const tabsData: TabsData[] = [
  {
    tab: 'WHY',
    title: 'Why Slysol',
    imageSrc: '/images/career/why-us.svg',
    description: `<p>
    Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolorum,
    veniam harum reprehenderit, quaerat deleniti repudiandae amet,
    alias doloribus ullam recusandae temporibus nesciunt beatae. Rem
    error et beatae! Porro, voluptatem similique!
  </p>
  <p>
    Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolorum,
    veniam harum reprehenderit, quaerat deleniti repudiandae amet,
    alias doloribus ullam recusandae temporibus nesciunt beatae. Rem
    error et beatae! Porro, voluptatem similique!
  </p>
  <p>
    Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolorum,
    veniam harum reprehenderit, quaerat deleniti repudiandae amet,
    alias doloribus ullam recusandae temporibus nesciunt beatae. Rem
    error et beatae! Porro, voluptatem similique!
  </p>`,
  },
  {
    tab: 'HOW',
    title: 'How We Hire',
    imageSrc: '/images/career/why-us.svg',
    description: `<p>
    Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolorum,
    veniam harum reprehenderit, quaerat deleniti repudiandae amet,
    alias doloribus ullam recusandae temporibus nesciunt beatae. Rem
    error et beatae! Porro, voluptatem similique!
  </p>
  <p>
    Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolorum,
    veniam harum reprehenderit, quaerat deleniti repudiandae amet,
    alias doloribus ullam recusandae temporibus nesciunt beatae. Rem
    error et beatae! Porro, voluptatem similique!
  </p>
  <p>
    Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolorum,
    veniam harum reprehenderit, quaerat deleniti repudiandae amet,
    alias doloribus ullam recusandae temporibus nesciunt beatae. Rem
    error et beatae! Porro, voluptatem similique!
  </p>`,
  },
  {
    tab: 'WHAT',
    title: 'What To Do',
    imageSrc: '/images/career/why-us.svg',
    description: `<p>
    Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolorum,
    veniam harum reprehenderit, quaerat deleniti repudiandae amet,
    alias doloribus ullam recusandae temporibus nesciunt beatae. Rem
    error et beatae! Porro, voluptatem similique!
  </p>
  <p>
    Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolorum,
    veniam harum reprehenderit, quaerat deleniti repudiandae amet,
    alias doloribus ullam recusandae temporibus nesciunt beatae. Rem
    error et beatae! Porro, voluptatem similique!
  </p>
  <p>
    Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolorum,
    veniam harum reprehenderit, quaerat deleniti repudiandae amet,
    alias doloribus ullam recusandae temporibus nesciunt beatae. Rem
    error et beatae! Porro, voluptatem similique!
  </p>`,
  },
];

const tabs = ['WHY', 'HOW', 'WHAT'];

const Tabs = () => {
  const [active, setActive] = useState('WHY');

  return (
    <Section className="bg-slate">
      <Container hScreen={false}>
        <div className="grid grid-cols-3 bg-white rounded-lg mb-10 overflow-hidden items-center md:h-[100px] h-[60px]">
          {tabs.map((tab) => (
            <div
              onClick={() => setActive(tab)}
              key={tab}
              className="h-full cursor-pointer"
            >
              <MainHeading
                text={tab}
                className={`${
                  tab === active ? 'bg-primary2 text-white' : ''
                } h-full flex items-center justify-center !font-normal`}
              />
            </div>
          ))}
        </div>
        {tabsData.map((tabData) => {
          if (tabData.tab === active) {
            return (
              <>
                <Title
                  text={tabData.title}
                  className="text-center md:mb-10 mb-5"
                />
                <div className="grid lg:grid-cols-2 gap-10">
                  <Image
                    src={tabData.imageSrc}
                    alt={tabData.tab}
                    height={600}
                    width={1000}
                    className="md:w-full sm:w-2/3 m-auto h-auto rounded-lg"
                  />
                  <div
                    className="flex flex-col gap-3 text-dark md:text-start sm:text-center"
                    dangerouslySetInnerHTML={{ __html: tabData.description }}
                  />
                </div>
              </>
            );
          }
        })}
      </Container>
    </Section>
  );
};

export default Tabs;
