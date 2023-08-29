import { ReactNode } from 'react';

interface ContainerLayoutProps {
  children?: ReactNode;
  className?: string;
}

const ContainerLayout = ({
  children,
  className = '',
}: ContainerLayoutProps) => {
  return (
    <div className={`max-w-6xl m-auto px-[14px] md:h-screen flex items-center`}>
      <div className={`${className} w-full`}>{children}</div>
    </div>
  );
};

export default ContainerLayout;
