import React from 'react';

interface SubTitleProps {
  text: string;
  white?: boolean;
}

const SubTitle = ({ text, white = false }: SubTitleProps) => {
  return (
    <h3
      className={`text-sm font-bold flex gap-3 items-center ${
        white && 'text-white'
      }`}
    >
      <div
        className={`h-[10px] w-[10px] ${
          white && 'bg-white'
        } bg-primary2 shadow-[-1px_2px_7px_-3px_black] rounded-sm`}
      ></div>{' '}
      {text}
    </h3>
  );
};

export default SubTitle;
