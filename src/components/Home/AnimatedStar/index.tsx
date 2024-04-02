'use client';

import React, { ReactNode, useEffect, useState } from 'react';
import { Variants, motion } from 'framer-motion';

interface AnimatedStarProps {
  children: ReactNode;
}
const AnimatedStar = ({ children }: AnimatedStarProps) => {
  const [screenSize, setScreenSize] = useState<number>(0);

  useEffect(() => {
    function handleResize() {
      setScreenSize(window.innerWidth);
    }

    handleResize();

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

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
        duration: 1,
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
      {children}
    </motion.div>
  );
};

export default AnimatedStar;
