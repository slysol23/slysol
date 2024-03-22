import React, { ReactNode } from 'react';

const Section = ({ children }: { children: ReactNode }) => {
  return <div className="md:py-20 sm:py-10 py-5">{children}</div>;
};

export default Section;
