import React from 'react';

const MainHeading = ({ text }: { text: string }) => {
  return (
    <div className="md:text-3xl sm:text-2xl text-xl font-bold">{text}</div>
  );
};

export default MainHeading;
