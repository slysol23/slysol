import Image from 'next/image';
import React from 'react';

interface SliderCardProps {
  src: string;
  alt: string;
  text: string;
  companyName: string;
}

const SliderCard = ({ src, alt, text, companyName }: SliderCardProps) => {
  return (
    <>
      <div className="grid md:grid-cols-[70%_30%] gap-10 bg-blue text-white text-justify md:p-20 p-10 rounded-xl">
        <div className="md:order-1 order-2">
          <h3 className="pb-4 italic">“{text}”</h3>
          <p className="mt-1 font-bold">{companyName}</p>
        </div>
        <div className="md:order-2 order-1">
          <div
            className="w-[130px] h-[130px] m-auto bg-white rounded-full
          flex items-center p-3"
          >
            <Image
              src={src}
              alt={alt}
              width={100}
              height={100}
              className="object-scale-down h-[100px]"
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default SliderCard;
