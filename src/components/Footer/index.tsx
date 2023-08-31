import React from 'react';
import Container from '../Container';
import Button from '../Button';
import AnimatedStar from '../Home/AnimatedStar';
import Image from 'next/image';
import { BsFacebook, BsInstagram, BsLinkedin } from 'react-icons/bs';
import Link from 'next/link';

const Footer = () => {
  const socialIcons = [
    { name: 'facebook', icon: <BsFacebook />, link: '#' },
    { name: 'instagram', icon: <BsInstagram />, link: '#' },
    { name: 'linkedin', icon: <BsLinkedin />, link: '#' },
  ];

  return (
    <div className="bg-blue md:py-10 pb-5 pt-10">
      <Container className="grid md:grid-cols-[40%_60%] gap-5">
        <div className="text-white my-auto">
          <h1 className="lg:text-4xl text-2xl font-bold lg:mb-4 mb-3 font-neue">
            Let us help you.
          </h1>
          <p className="lg:mb-4 mb-3">
            Reach out for an exploratory conversation.
          </p>
          <Button
            text="CONTACT US"
            className="py-3 bg-gradient-to-r from-[#b9ffcb] to-[#6fa2ff]"
          />
          <p className="font-bold md:mt-10 mt-5 mb-1 font-neue">PHONE</p>
          <p className="text-sm">123-456789</p>
          <p className="font-bold mt-5 mb-1 font-neue">EMAIL</p>
          <p className="text-sm">{`sheikh.haris.zahid@slysol.com`}</p>
          <p className="font-bold mt-5 mb-1 font-neue">SOCIAL MEDIA</p>
          <div className="flex">
            {socialIcons.map((socialIcon) => (
              <Link
                href={socialIcon.link}
                key={socialIcon.name}
                className="mr-3"
              >
                {socialIcon.icon}
              </Link>
            ))}
          </div>
        </div>
        <div className="flex items-center md:justify-end justify-center md:-translate-x-0 -translate-x-[5%]">
          <AnimatedStar>
            <Image
              src="/images/footer/star-vector.png"
              alt="united hands"
              width={120}
              height={120}
            />
          </AnimatedStar>
          <div>
            <Image
              src="/images/footer/footer.png"
              alt="united hands"
              width={600}
              height={600}
            />
          </div>
        </div>
      </Container>
    </div>
  );
};

export default Footer;
