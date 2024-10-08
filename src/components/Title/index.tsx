import React, { ReactNode } from 'react';

interface TitleProps {
  text?: string;
  className?: string;
  children?: ReactNode;
}

const Title = ({ text, className, children }: TitleProps) => {
  return (
    <div
      className={`lg:text-5xl md:text-4xl sm:text-3xl text-2xl font-bold tracking-wide line leading-tight ${className}`}
    >
      {text || children}
    </div>
  );
};

export default Title;
