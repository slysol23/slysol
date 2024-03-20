import React, { ReactNode } from 'react';

const GradientText = ({ children }: { children: ReactNode }) => {
  return (
    <div className="bg-clip-text text-transparent bg-gradient-to-r from-[#0FABF6] via-[#455AB5] to-[#EB577B]">
      {children}
    </div>
  );
};

export default GradientText;
