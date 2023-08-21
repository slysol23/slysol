import Image from 'next/image';
import React from 'react';

interface FullWidthImageProps {
  src: string;
  alt: string;
  className?: string;
}

const FullWidthImage = ({ src, alt, className = '' }: FullWidthImageProps) => {
  return (
    <Image
      src={src}
      alt={alt}
      className={`w-full ${className}`}
      width={0}
      height={0}
      sizes="100vw"
      objectFit="scale-down"
    />
  );
};

export default FullWidthImage;
