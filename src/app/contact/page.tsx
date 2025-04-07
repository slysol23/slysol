import Layout from '@/components/Layout';
import React from 'react';
import Image from 'next/image';
import Form from '@/components/Contact/Form';
import Container from '@/components/Container';
import Link from 'next/link';
import { socialIcons } from '@/components/Footer';

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
          <p>H98J+3F6, Shalimar Link Road, Gunj Bazar</p>
          <p>Shalimar Link Road, Lahore, Pakistan</p>
          <hr className="border-t-2 border-dashed border-gray-200 my-5" />
          <h2 className="text-pink text-xl lg:mb-3 md:mb-2 mb-1">Phone</h2>
          <Link href="tel:+923104150111">+92-3104150111</Link>
          <hr className="border-t-2 border-dashed border-gray-200 my-5" />
          <h2 className="text-pink text-xl lg:mb-3 md:mb-2 mb-1">Email</h2>
          <Link href={'mailto:info@slysol.com'}>info@slysol.com</Link>
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
        {/* <Calendly /> */}
        <div className="w-full">
          <iframe
            width="100%"
            height="400"
            src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d3399.5062228161296!2d74.3811857!3d31.5651632!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x391905172e6d6b89%3A0x16b17ef1ce5eb1da!2sSlySol!5e0!3m2!1sen!2s!4v1743954854307!5m2!1sen!2s"
          ></iframe>
        </div>
      </Container>
    </Layout>
  );
};

export default Contact;
