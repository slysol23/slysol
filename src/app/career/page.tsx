import Tabs from '@/components/Career/Tabs';
import Container from '@/components/Container';
import Footer from '@/components/Footer';
import GradientText from '@/components/GradientText';
import Header from '@/components/Header';
import HeaderInfo from '@/components/Header/HeaderInfo';
import Layout from '@/components/Layout';
import Section from '@/components/Section';
import Title from '@/components/Title';
import Image from 'next/image';
import React from 'react';

const Career = () => {
  const perksBenefits = [
    {
      src: 'https://res.cloudinary.com/dj6kzchpv/image/upload/v1776779974/competitive-salary_ehuser.svg',
      title: 'Competitive Salary',
    },
    {
      src: 'https://res.cloudinary.com/dj6kzchpv/image/upload/v1776780953/provident-fund_t8r6sw.svg',
      title: 'Provident Fund',
    },
    {
      src: 'https://res.cloudinary.com/dj6kzchpv/image/upload/v1776780038/inpatient-medical_fzhmiu.svg',
      title: 'Inpatient Medical Facility',
    },
    {
      src: 'https://res.cloudinary.com/dj6kzchpv/image/upload/v1776780962/work-life_hfa7t4.svg',
      title: 'Work/life Balance',
    },
    {
      src: 'https://res.cloudinary.com/dj6kzchpv/image/upload/v1776781055/outpatent-medical_usc2ws.svg',
      title: 'Outpatient Medical Facility',
    },
    {
      src: 'https://res.cloudinary.com/dj6kzchpv/image/upload/v1776780956/remote-work_ps4tiq.svg',
      title: 'Remote Work When Needed',
    },
    {
      src: 'https://res.cloudinary.com/dj6kzchpv/image/upload/v1776780957/subzidized-lunch_j4wwnl.svg',
      title: 'Subsidized Lunch',
    },
    {
      src: 'https://res.cloudinary.com/dj6kzchpv/image/upload/v1776780163/conference-traning_twwfa8.svg',
      title: 'Conferences & Training',
    },
    {
      src: 'https://res.cloudinary.com/dj6kzchpv/image/upload/v1776780959/transportation_l6nofq.svg',
      title: 'Transportation Allowance for Females',
    },
  ];
  return (
    <>
      <div className="relative md:h-[600px] h-[400px]">
        <Image
          src="https://res.cloudinary.com/dj6kzchpv/image/upload/v1776779325/career-bg_11zon_ug3bo4.webp"
          alt="Slysol team meeting on project"
          fill
          className="w-full h-auto object-cover object-top"
        />
        <div className="absolute w-full h-full bg-black top-0 opacity-30 z-[1]" />
        <div className="relative z-[2]">
          <HeaderInfo classes={{ root: 'text-white' }} />
        </div>
        <Container className="h-full z-[2]" hScreen={false}>
          <Header
            classes={{
              root: 'md:text-white',
              menuUnderline: 'md:bg-white',
              whiteLogo: true,
            }}
          />
        </Container>
      </div>
      <Container hScreen={false}>
        <Section>
          <GradientText className="pb-5">
            <Title
              text="We Are Looking For Talented People"
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
            <Title text="Perks & Benefits" />
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
                src="https://res.cloudinary.com/dj6kzchpv/image/upload/v1776779895/perks-1_11zon_atcy30.webp"
                alt="subsidized meals at slysol"
                height={300}
                width={400}
                className="w-full h-auto rounded-lg"
              />
              <Image
                src="https://res.cloudinary.com/dj6kzchpv/image/upload/v1776779924/perks-3_tpnafg.webp"
                alt="subsidized meals at slysol"
                height={300}
                width={400}
                className="w-full h-auto rounded-lg"
              />
            </div>
            <Image
              src="https://res.cloudinary.com/dj6kzchpv/image/upload/v1776779922/perks-2_huyasw.webp"
              alt="subsidized meals at slysol"
              height={600}
              width={400}
              className="w-full h-auto rounded-lg"
            />
          </div>
        </Container>
      </Section>
      <Footer />
    </>
  );
};

export default Career;
