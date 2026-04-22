import React from 'react';
import Image from 'next/image';

interface SiteLogoProps {
  white?: boolean;
}

const SiteLogo = ({ white = false }: SiteLogoProps) => {
  return (
    <div className="relative h-[50px] sm:w-[120px] w-[100px]">
      <Image
        src={`${white ? 'https://res.cloudinary.com/dj6kzchpv/image/upload/v1776843572/slysol-white_akxphu.svg' : 'https://res.cloudinary.com/dj6kzchpv/image/upload/v1776841477/slysol_samjbc.svg'}`}
        alt="Next"
        fill
        className="object-contain aspect-square"
      />
    </div>
  );
};

export default SiteLogo;
