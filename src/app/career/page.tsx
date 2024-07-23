import Tabs from '@/components/Career/Tabs';
import Container from '@/components/Container';
import GradientText from '@/components/GradientText';
import Layout from '@/components/Layout';
import MainHeading from '@/components/MainHeading';
import Section from '@/components/Section';
import Title from '@/components/Title';
import Image from 'next/image';
import React from 'react';

const Career = () => {
  const perksBenefits = [
    {
      src: '/images/career/competitive-salary.svg',
      title: 'Competitive Salary',
    },
    { src: '/images/career/provident-fund.svg', title: 'Provident Fund' },
    {
      src: '/images/career/inpatient-medical.svg',
      title: 'Inpatient Medical Facility',
    },
    { src: '/images/career/work-life.svg', title: 'Work/life Balance' },
    {
      src: '/images/career/outpatent-medical.svg',
      title: 'Outpatient Medical Facility',
    },
    { src: '/images/career/remote-work.svg', title: 'Remote Work When Needed' },
    { src: '/images/career/subzidized-lunch.svg', title: 'Subsidized Lunch' },
    {
      src: '/images/career/conference-traning.svg',
      title: 'Conferences & Training',
    },
    {
      src: '/images/career/transportation.svg',
      title: 'Transportation Allowance for Females',
    },
  ];
  return (
    <Layout>
      <div
        className="md:h-[600px] h-[450px]"
        style={{
          backgroundImage: `url('/images/career/career-bg.svg')`,
          backgroundRepeat: 'no-repeat',
          backgroundSize: 'cover',
          backgroundPosition: 'top',
        }}
      />
      <Container hScreen={false}>
        <Section>
          <GradientText className="pb-5">
            <Title
              text="We Are Looking For Taleneted People"
              className="text-center"
            />
          </GradientText>
          <div className="text-mute text-center flex flex-col gap-3">
            <p>
              {`We have an opportunity for anyone who is passionate to learn and
              implant their skills. Join SlySol and be part of a dynamic team
              that's shaping the future of technology with innovative software
              solutions.`}
            </p>
          </div>
        </Section>
      </Container>
      <Tabs />
      <Section>
        <Container hScreen={false} className="grid lg:grid-cols-2 gap-10">
          <div>
            <Title text="Perks & Benifits" />
            <div className="grid sm:grid-cols-2 gap-5 mt-10">
              {perksBenefits.map((perk, index) => (
                <div
                  key={index}
                  className="flex gap-5 px-5 py-3 rounded-md shadow-md items-center"
                >
                  <Image
                    src={perk.src}
                    alt={perk.title}
                    height={30}
                    width={50}
                  />
                  <p>{perk.title}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="grid gap-5">
            <div className="grid grid-cols-2 gap-5">
              <Image
                src="/images/career/perks-1.svg"
                alt="subsidized meals at slysol"
                height={300}
                width={400}
                className="w-full h-auto rounded-lg"
              />
              <Image
                src="/images/career/perks-3.svg"
                alt="subsidized meals at slysol"
                height={300}
                width={400}
                className="w-full h-auto rounded-lg"
              />
            </div>
            <Image
              src="/images/career/perks-2.svg"
              alt="subsidized meals at slysol"
              height={600}
              width={400}
              className="w-full h-auto rounded-lg"
            />
          </div>
        </Container>
      </Section>
    </Layout>
  );
};

export default Career;
