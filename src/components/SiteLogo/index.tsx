import React from 'react';
import Image from 'next/image';

const SiteLogo = () => {
  return (
    <div className="relative h-[50px] sm:w-[120px] w-[100px]">
      <Image
        src="/icons/slysol-logo.png"
        alt="Next"
        fill
        className="object-contain aspect-square"
      />
    </div>
  );
};

export default SiteLogo;
