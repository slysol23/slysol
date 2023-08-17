'use client';

import React, { useEffect, useState } from 'react';
import { Variants, motion } from 'framer-motion';
import Image from 'next/image';

const AnimatedStar = () => {
  const [screenSize, setScreenSize] = useState<number>(window.innerWidth);
  useEffect(() => {
    function handleResize() {
      setScreenSize(window.innerWidth);
    }
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  });
  const introPictureVariants: Variants = {
    hide: {
      opacity: 0,
      y: 200,
      x: 80,
    },
    show: {
      opacity: 1,
      y: 15,
      x:
        screenSize < 478
          ? 80
          : screenSize < 768
          ? 140
          : screenSize < 920
          ? 115
          : screenSize < 1024
          ? 135
          : 160,
      transition: {
        duration: 2,
      },
    },
  };

  return (
    <motion.div
      initial="hide"
      whileInView="show"
      exit="hide"
      variants={introPictureVariants}
    >
      <Image
        src="/images/home/star-vector.png"
        alt="united hands"
        width={120}
        height={120}
      />
    </motion.div>
  );
};

export default AnimatedStar;
