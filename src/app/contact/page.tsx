import Layout from '@/components/Layout';
import React from 'react';
import Image from 'next/image';
import Form from '@/components/Contact/Form';
import Container from '@/components/Container';
import { socialIcons } from '@/components/Footer';
import Link from 'next/link';
import Calendly from '@/components/Contact/Calendly';

const Contact = () => {
  return (
    <Layout>
      <div className="relative">
        <Image
          src="/images/contact/header.png"
          width={1300}
          height={300}
          alt="contact header"
          className="w-full md:h-auto h-[150px]"
        />
        <button
          className="rounded-lg md:w-[150px] w-[100px] md:py-3 py-2 absolute 
        md:left-[calc(50%-75px)] left-[calc(50%-50px)] md:top-[65%] top-[65%]
        translate-[-50%_-50%] bg-white shadow-lg md:text-base text-sm font-neue"
        >
          Contact Us
        </button>
      </div>
      <Container hScreen={false}>
        <p className="md:w-1/2 sm:w-2/3 m-auto text-center md:py-20 py-10 ">
          Please leave a brief information about yourself, your company and your
          goals and we will get back to you on our first priority.
        </p>
      </Container>
      <Container
        hScreen={false}
        className="grid md:grid-cols-2 lg:gap-20 md:gap-10 gap-5"
      >
        <Form />
        <div className="pt-3">
          <h2 className="text-pink text-xl lg:mb-3 md:mb-2 mb-1">Address</h2>
          <p>Office # 2, 2nd Floor, Icon Center, Beside Panorama Center</p>
          <p>48 Mall Road, Lahore, Pakistan</p>
          <hr className="border-t-2 border-dashed border-gray-200 my-5" />
          <h2 className="text-pink text-xl lg:mb-3 md:mb-2 mb-1">Phone</h2>
          <Link href="tel:+923104150111">+92-3104150111</Link>
          <hr className="border-t-2 border-dashed border-gray-200 my-5" />
          <h2 className="text-pink text-xl lg:mb-3 md:mb-2 mb-1">Email</h2>
          <Link href={'mailto:sheikh.haris.zahid@slysol.com'}>
            sheikh.haris.zahid@slysol.com
          </Link>
          <hr className="border-t-2 border-dashed border-gray-200 my-5" />
          <h2 className="text-pink text-xl lg:mb-3 md:mb-2 mb-2">
            Social Media
          </h2>
          <div className="flex gap-5 text-3xl text-primary2">
            {socialIcons.map((socialIcon) => (
              <Link href={socialIcon.link} key={socialIcon.name}>
                {socialIcon.icon}
              </Link>
            ))}
          </div>
        </div>
      </Container>
      <Container
        hScreen={false}
        className="flex flex-col lg:gap-20 md:gap-10 gap-5 md:pb-20 pb-10 pt-10"
      >
        <Calendly />
        <div className="w-full">
          <iframe
            width="100%"
            height="400"
            src="https://maps.google.com/maps?width=100%25&amp;height=400&amp;hl=en&amp;q=Icon%20shopping%20center+(Slysol)&amp;t=&amp;z=14&amp;ie=UTF8&amp;iwloc=B&amp;output=embed"
          ></iframe>
        </div>
      </Container>
    </Layout>
  );
};

export default Contact;
