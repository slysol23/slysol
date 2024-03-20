import React, { ReactNode } from 'react';

interface TitleProps {
  text?: string;
  className?: string;
  children?: ReactNode;
}

const Title = ({ text, className, children }: TitleProps) => {
  return (
    <div
      className={`lg:text-5xl md:text-4xl sm:text-3xl text-2xl font-bold tracking-wide line leading-tight xl:w-2/3 lg:w-3/4 sm:w-1/2 w-2/3 ${className}`}
    >
      {text || children}
    </div>
  );
};

export default Title;
