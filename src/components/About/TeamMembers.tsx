import React from 'react';
import Container from '@/components/Container';
import SubTitle from '@/components/SubTitle';
import Image from 'next/image';
import Section from '../Section';
import Title from '../Title';

const teamMembers = [
  {
    imageSrc: '/images/about/team-member-01.jpg',
    name: 'Muhammad Buksh',
    designation: 'Marketing & Sales Manager',
  },
  {
    imageSrc: '/images/about/team-member-02.jpg',
    name: 'Umer Riaz',
    designation: 'Software Engineer',
  },
  {
    imageSrc: '/images/about/team-member-03.jpg',
    name: 'Ahsan Ali',
    designation: 'Backend Engineer',
  },
  {
    imageSrc: '/images/about/team-member-04.jpg',
    name: 'Maryam Aamir',
    designation: 'Content Writer',
  },
];

const TeamMembers = () => {
  return (
    <Container hScreen={false}>
      <Section>
        <div className="flex flex-col items-center md:pb-10 sm:pb-5">
          <SubTitle text="TEAM MEMBERS" />
          <Title text="Our Top Skilled Experts" className="py-5 font-normal" />
        </div>
        <div className="grid lg:grid-cols-4 sm:grid-cols-2 gap-5">
          {teamMembers.map((member, index) => (
            <div className="relative overflow-hidden group" key={index}>
              <Image
                src={member.imageSrc}
                width={300}
                height={400}
                alt="team member"
                className="sm:w-full h-[90%] w-2/3 rounded-lg m-auto"
              />
              <div className="absolute w-full h-full top-0 transition-transform duration-1000 translate-y-full group-hover:translate-y-0 flex items-end justify-center pb-3">
                <div className="bg-white rounded-2xl h-[40%] sm:w-[90%] w-[60%] p-7 text-center flex flex-col justify-center">
                  <h2 className="text-lg font-bold mb-2">{member.name}</h2>
                  <h3 className="text-primary2 mb-2">{member.designation}</h3>
                  <hr />
                </div>
              </div>
            </div>
          ))}
        </div>
      </Section>
    </Container>
  );
};

export default TeamMembers;
