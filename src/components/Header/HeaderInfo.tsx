import React from 'react';
import Container from '../Container';
import { CiMail, CiPhone } from 'react-icons/ci';
import Link from 'next/link';

interface HeaderInfoProps {
  classes?: { root?: string };
}

const HeaderInfo = ({ classes }: HeaderInfoProps) => {
  return (
    <div
      className={`border-b-[1px] md:text-sm text-xs sm:py-0 py-1 ${classes?.root} hidden md:block`}
    >
      <Container
        hScreen={false}
        className="sm:h-[50px] flex sm:flex-row flex-col justify-between items-center gap-1"
      >
        <p>Mon-Fri: 10:00 AM - 7:00 PM</p>
        <div className="flex sm:flex-row flex-col sm:gap-5 gap-1 items-center">
          <div className="flex gap-1 items-center">
            <CiPhone />
            <Link href={'tel:+92-3104150111'}>+92-3104150111</Link>
          </div>
          <div className="flex gap-1 items-center">
            <CiMail />
            <Link href={'mailto:info@slysol.com'}>info@slysol.com</Link>
          </div>
        </div>
      </Container>
    </div>
  );
};

export default HeaderInfo;
