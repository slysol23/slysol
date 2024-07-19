import React, { ReactNode } from 'react';
import Container from '../Container';
import {
  BsFacebook,
  BsInstagram,
  BsLinkedin,
  BsSend,
  BsTelephoneFill,
} from 'react-icons/bs';
import { TbMailFilled } from 'react-icons/tb';
import { ImLocation2 } from 'react-icons/im';
import Link from 'next/link';
import Section from '../Section';
import SiteLogo from '../SiteLogo';
import GradientText from '../GradientText';
import { GoogleTranslate } from '../GoogleTranslate';
import { getPrefLangCookie } from 'utils/cookies';

interface Links {
  name: string;
  link: string;
  icon?: ReactNode;
}

export const socialIcons = [
  {
    name: 'facebook',
    icon: <BsFacebook />,
    link: 'https://www.facebook.com/profile.php?id=100094073880444',
  },
  {
    name: 'instagram',
    icon: <BsInstagram />,
    link: 'https://www.instagram.com/slysol23/',
  },
  {
    name: 'linkedin',
    icon: <BsLinkedin />,
    link: 'https://www.linkedin.com/company/slysol/',
  },
];

const siteLinks = [
  {
    title: 'COMPANY',
    links: [
      { name: 'About Us', link: '/about' },
      { name: 'Career', link: '/career' },
      { name: 'Contact Us', link: '/contact' },
    ],
  },
  {
    title: 'DISCOVER',
    links: [
      { name: 'Home', link: '/' },
      { name: 'About', link: '/about' },
      { name: 'Services', link: '/services' },
      { name: 'Portfolio', link: '/portfolio' },
      { name: 'Blog', link: '/blog' },
      { name: 'Career', link: '/career' },
      { name: 'Contact', link: '/contact' },
    ],
  },
  {
    title: 'SERVICES',
    links: [
      { name: 'Software Development', link: '/services' },
      { name: 'Artificial Intelligence', link: '/services' },
      { name: 'IT Consultant', link: '/services' },
      { name: 'Digital Marketing', link: '/services' },
      { name: 'Cloud Computing', link: '/services' },
      { name: 'Content Creation', link: '/services' },
      { name: 'Sofware Designing', link: '/services' },
    ],
  },
  {
    title: 'CONTACT',
    links: [
      {
        icon: <BsTelephoneFill />,
        name: `03104150111`,
        link: 'tel:+92-3104150111',
      },
      {
        icon: <TbMailFilled />,
        name: 'mohammadbuksh.slysol@gmail.com',
        link: 'mailto:mohammadbuksh.slysol@gmail.com',
      },
      {
        icon: <ImLocation2 />,
        name: 'Office # 2, 2nd Floor, Icon Center, Beside Panorama Center 48 Mall Road, Lahore, Pakistan',
        link: 'https://www.google.com/maps/dir//Icon+shopping+center+H86C%2BP8H+Shahrah-e-Quaid-e-Azam+Garhi+Shahu,+Lahore,+Punjab+54000/@31.5618226,74.3208612,14z/data=!4m5!4m4!1m0!1m2!1m1!1s0x39191bcfa3aaa041:0x2507b8f020014662',
      },
    ],
  },
  {
    title: 'HELP',
    links: [
      { name: 'FAQ', link: '#faq' },
      { name: 'Support', link: '/contact' },
    ],
  },
];

const Footer = () => {
  const prefLangCookie = getPrefLangCookie();

  return (
    <div className="bg-gradient-to-r from-[#CBFCD8] via-[#B9E6E6] to-[#96BCFD]">
      <Container hScreen={false}>
        <Section>
          <div className="flex justify-between items-center border-b-[1px] pb-5">
            <div>
              <SiteLogo />
              <p className="text-xs font-bold">IT SOLUTION PROVIDER</p>
            </div>
            <div className="flex md:gap-5 gap-3 items-center">
              {socialIcons.map((icon) => (
                <Link
                  href={icon.link}
                  key={icon.name}
                  className="text-primary2 md:text-xl text-sm md:p-2 p-1 border-[1px] rounded-full border-primary2"
                >
                  {icon.icon}
                </Link>
              ))}
            </div>
          </div>
          <div className="grid xl:grid-cols-5 md:grid-cols-3 sm:grid-cols-2 md:py-10 py-5 xl:gap-10 gap-5 border-b-[1px]">
            {siteLinks.map((link, index) => (
              <>
                <div key={link.title} className="flex flex-col gap-2">
                  <div>
                    <GradientText className="md:text-base text-md font-bold mb-2">
                      {link.title}
                    </GradientText>
                    {link.links.map((item: Links) => (
                      <Link
                        key={item.name}
                        href={item.link}
                        className="flex md:gap-2 gap-1 text-sm font-semibold mb-1 items-baseline"
                      >
                        {item?.icon && <p>{item.icon}</p>}
                        <p>{item.name}</p>
                      </Link>
                    ))}
                  </div>
                  {index === 4 && (
                    <div>
                      <GradientText className="md:text-base text-md font-bold mb-2">
                        SUBSCRIBE
                      </GradientText>
                      <div className="flex">
                        <input
                          type="text"
                          placeholder="Enter email address"
                          className="text-sm focus:outline-none p-2 bg-[#cbdfff]"
                        />
                        <button className="bg-primary2 p-2 flex justify-center items-center text-white">
                          <BsSend />
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </>
            ))}
          </div>
          <div className="sm:flex justify-between text-sm pt-5 text-center">
            <p>Copyright © 2024, Slysol. All Rights Reserved.</p>
            <div className="flex gap-2 sm:mt-0 mt-1 justify-center">
              <GoogleTranslate prefLangCookie={prefLangCookie} />
              <Link href={'/privacy-policy'} className="font-semibold">
                | Privacy Policy
              </Link>
              |
              <Link href={'/terms-conditions'} className="font-semibold">
                Terms & Conditions
              </Link>
            </div>
          </div>
        </Section>
      </Container>
    </div>
  );
};

export default Footer;
