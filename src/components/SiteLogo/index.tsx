import React from 'react';
import Image from 'next/image';

interface SiteLogoProps {
  white?: boolean;
}

const SiteLogo = ({ white = false }: SiteLogoProps) => {
  return (
    <div className="relative h-[50px] sm:w-[120px] w-[100px]">
      <Image
        src={`${white ? '/icons/slysol-white.svg' : '/icons/slysol.svg'}`}
        alt="Next"
        fill
        className="object-contain aspect-square"
      />
    </div>
  );
};

export default SiteLogo;
