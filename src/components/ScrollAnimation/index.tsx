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
    },
    show: {
      y: 0,
      transition: {
        type: 'spring',
        stiffness: 200,
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
