import React, { ReactNode } from 'react';

const GradientText = ({
  children,
  className = '',
}: {
  children: ReactNode;
  className?: string;
}) => {
  return (
    <div
      className={`bg-clip-text text-transparent bg-gradient-to-r from-[#0FABF6] via-[#455AB5] to-[#EB577B] ${className}`}
    >
      {children}
    </div>
  );
};

export default GradientText;
