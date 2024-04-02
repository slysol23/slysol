import React, { ReactNode } from 'react';

const GradientBg = ({
  children = null,
  className = '',
}: {
  children?: ReactNode;
  className?: string;
}) => {
  return (
    <div
      className={`bg-gradient-to-b from-[#0FABF6] via-[#455AB5] to-[#EB577B] ${className}`}
    >
      {children}
    </div>
  );
};

export default GradientBg;
