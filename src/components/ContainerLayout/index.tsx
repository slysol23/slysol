import { ReactNode } from 'react';

interface ContainerLayoutProps {
  children?: ReactNode;
  className?: string;
}

const ContainerLayout = ({ children, className }: ContainerLayoutProps) => {
  return (
    <div className={`max-w-6xl mx-auto px-[14px] ${className}`}>{children}</div>
  );
};

export default ContainerLayout;
