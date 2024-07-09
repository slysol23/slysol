import React from 'react';

const MainHeading = ({
  text,
  className = '',
}: {
  text: string;
  className?: string;
}) => {
  return (
    <div className={`md:text-2xl text-xl font-semibold ${className}`}>
      {text}
    </div>
  );
};

export default MainHeading;
