'use client';

import { Variants, motion } from 'framer-motion';
import { ReactNode } from 'react';

interface ScrollAnimationProps {
  children: ReactNode;
  startPosition?: number;
}

const ScrollAnimation = ({
  children,
  startPosition = 50,
}: ScrollAnimationProps) => {
  const scrollVariants: Variants = {
    hide: {
      y: startPosition,
      opacity: 0,
    },
    show: {
      y: 0,
      opacity: 1,
      transition: {
        type: 'spring',
        stiffness: 250,
        damping: 30,
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

export default ScrollAnimation;
