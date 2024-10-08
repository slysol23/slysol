import React, { ReactNode } from 'react';

const PerfectCenter = ({
  children,
  className = '',
}: {
  children: ReactNode;
  className?: string;
}) => {
  return (
    <div
      className={`absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 ${className}`}
    >
      {children}
    </div>
  );
};

export default PerfectCenter;
