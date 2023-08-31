import { ReactNode } from 'react';

interface ContainerProps {
  children?: ReactNode;
  className?: string;
}

const Container = ({ children, className = '' }: ContainerProps) => {
  return (
    <div className={`max-w-6xl m-auto px-[14px] md:h-screen flex items-center`}>
      <div className={`${className} w-full`}>{children}</div>
    </div>
  );
};

export default Container;
