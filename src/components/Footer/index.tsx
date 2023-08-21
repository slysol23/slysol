import React from 'react';
import ContainerLayout from '../ContainerLayout';
import Button from '../Button';
import AnimatedStar from '../Home/AnimatedStar';
import Image from 'next/image';

const Footer = () => {
  return (
    <div className="bg-blue md:py-10 py-5">
      <ContainerLayout className="grid md:grid-cols-[40%_60%] gap-5">
        <div className="text-white my-auto">
          <h1 className="lg:text-4xl text-2xl font-bold lg:mb-4 mb-3">
            Let us help you.
          </h1>
          <p className="lg:mb-4 mb-3">
            Reach out for an exploratory conversation.
          </p>
          <Button
            text="CONTACT US"
            className="py-3 bg-gradient-to-r from-[#CBFFD8] to-[#94B9FF]"
          />
          <p className="font-bold md:mt-10 mt-5 mb-2">PHONE</p>
          <p className="text-sm">{`(123) 456-7890`}</p>
          <p className="font-bold mt-3 mb-2">EMAIL</p>
          <p className="text-sm">{`sheikhhariszahid@slysol.com`}</p>
          <p className="font-bold mt-3 mb-2">PHONE</p>
          <p className="text-sm">{`(123) 456-7890`}</p>
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
      </ContainerLayout>
    </div>
  );
};

export default Footer;
