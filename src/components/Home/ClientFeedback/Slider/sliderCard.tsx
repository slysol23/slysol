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
    <div className=" text-white text-justify p-5 rounded-xl shadow-[0px_0px_9px_-5px_black] transform transition-all duration-300 flex flex-col items-center gap-7 justify-between mb-5 mt-[60px]">
      <div className="h-[100px] w-[100px] absolute flex items-center justify-center shadow-[0px_0px_9px_-5px_black] rounded-full bg-white overflow-hidden p-2 -top-[50px] left-1/2 -translate-x-1/2">
        <Image
          src={src}
          alt={alt}
          width={100}
          height={100}
          className="max-h-full max-w-full h-auto w-auto object-cover"
        />
      </div>
      <h3 className="mt-[50px] italic font-serif md:text-lg text-dark h-[170px] overflow-hidden text-ellipsis line-clamp-6">
        “{text}”
      </h3>
      <p className="font-bold md:text-lg text-dark">{companyName}</p>
    </div>
  );
};

export default SliderCard;
