import { ReactNode } from 'react';

interface ContainerProps {
  children?: ReactNode;
  className?: string;
  hScreen?: boolean;
}

const Container = ({
  children,
  className = '',
  hScreen = true,
}: ContainerProps) => {
  return (
    <div
      className={`lg:max-w-6xl md:max-w-3xl m-auto px-[14px] ${
        hScreen && 'md:h-[90vh]'
      } flex items-center`}
    >
      <div className={`${className} w-full`}>{children}</div>
    </div>
  );
};

export default Container;
