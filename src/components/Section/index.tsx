import React, { ReactNode } from 'react';

const Section = ({
  children,
  className = '',
}: {
  children: ReactNode;
  className?: string;
}) => {
  return (
    <div className={`md:py-20 sm:py-10 py-5 ${className}`}>{children}</div>
  );
};

export default Section;
