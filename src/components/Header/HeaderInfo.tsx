import React from 'react';
import Container from '../Container';
import { CiMail, CiPhone } from 'react-icons/ci';

interface HeaderInfoProps {
  classes?: { root?: string };
}

const HeaderInfo = ({ classes }: HeaderInfoProps) => {
  return (
    <div
      className={`border-b-[1px] md:text-sm text-xs sm:py-0 py-1 ${classes?.root}`}
    >
      <Container
        hScreen={false}
        className="sm:h-[50px] flex sm:flex-row flex-col justify-between items-center gap-1"
      >
        <p>Mon-Fri: 11:00 AM - 8:00 PM</p>
        <div className="flex sm:flex-row flex-col sm:gap-5 gap-1 items-center">
          <div className="flex gap-1 items-center">
            <CiPhone />
            <p>+92-3104150111</p>
          </div>
          <div className="flex gap-1 items-center">
            <CiMail />
            <p>mohammadbuksh.slysol@gmail.com</p>
          </div>
        </div>
      </Container>
    </div>
  );
};

export default HeaderInfo;
