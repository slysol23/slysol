import React from 'react';
import FullWidthImage from '@/components/FullWidthImage';
import ScrollAnimation from '@/components/ScrollAnimation';

interface CardProps {
  imageSrc: string;
  heading: string;
  description: string;
}

const Card = ({ imageSrc, heading, description }: CardProps) => {
  return (
    <div className="bg-slate">
      <div className="h-[200px]">
        <ScrollAnimation>
          <FullWidthImage
            src={imageSrc}
            alt={heading}
            className="h-[200px] object-cover"
          />
        </ScrollAnimation>
      </div>
      <div className="h-[200px] text-center p-5 text-black">
        <h3 className="font-bold mb-3">{heading}</h3>
        <p>{description}</p>
      </div>
    </div>
  );
};

export default Card;
