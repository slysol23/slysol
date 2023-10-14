'use client';

import { Variants, motion } from 'framer-motion';
import { ReactNode } from 'react';

interface BannerAnimationProps {
  children: ReactNode;
  startPosition?: number;
  endPosition?: number;
  duration?: number;
}

const BannerAnimation = ({
  children,
  startPosition = 450,
  endPosition = -10,
  duration = 10,
}: BannerAnimationProps) => {
  const scrollVariants: Variants = {
    hide: {
      y: startPosition,
      opacity: 1,
    },
    show: {
      y: endPosition,
      opacity: 0,
      transition: {
        duration: duration,
        repeat: Infinity,
      },
    },
  };

  return (
    <motion.div
      initial="hide"
      whileInView="show"
      exit="hide"
      variants={scrollVariants}
    >
      {children}
    </motion.div>
  );
};

export default BannerAnimation;
