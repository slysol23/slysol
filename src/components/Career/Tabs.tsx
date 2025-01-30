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
    imageSrc: '/images/career/why-us.webp',
    description: `<p>
    In 2023, we laid the foundation of SlySol with the vision of uniting technology enthusiasts under one umbrella. Since then, we have grown into a thriving community of passionate professionals committed to pushing the boundaries of innovation. 
  </p>
  <p>
    At SlySol, we foster a culture of collaboration, where creativity and initiative are celebrated. Join us to be part of a dynamic team where your ideas make a difference, and shape the future of technology.
  </p>
  `,
  },
  {
    tab: 'HOW',
    title: 'How We Hire',
    imageSrc: '/images/career/how-we-hire.webp',
    description: `<p>
    Our hiring process is designed to identify the best and brightest talent. It begins with an initial application review, followed by interviews to understand your skills, experiences, and fit with our company culture.
  </p>
  <p>
    We prioritize transparency and open communication throughout the process, ensuring you know what to expect at every step. We seek individuals who are not only skilled but also share our values and enthusiasm for technology and innovation.
  </p>`,
  },
  {
    tab: 'WHAT',
    title: 'What To Do',
    imageSrc: '/images/career/what-to-do.webp',
    description: `<p>
    Ready to take the next step in your career with SlySol? Send us your resume and a cover letter detailing your experience and why you want to join our team. Please email your application to <a class="underline" href="mailto:m.buksh@slysol.com">m.buksh@slysol.com</a> and include the position you’re applying for in the subject line. We look forward to learning more about you and potentially welcoming you to the SlySol family!
  </p>
  `,
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
                <div className="grid lg:grid-cols-2 gap-10 items-center">
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
