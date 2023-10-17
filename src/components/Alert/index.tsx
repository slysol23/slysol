import React from 'react';
import { XCircleIcon } from '@heroicons/react/24/solid';

interface AlertProps {
  category: string;
  onClick: () => void;
  text: string;
}

const Alert = ({ category, onClick, text }: AlertProps) => {
  return (
    <div
      className={`p-4 mb-4 text-sm ${
        category === 'success'
          ? 'text-green-800 bg-green-300 top-[20%]'
          : 'text-red-800 bg-red-300 bottom-0'
      } rounded-lg fixed flex justify-between w-[300px] z-20 animate-left-to-right`}
      role="alert"
    >
      <span className="font-medium">{text}</span>
      <span onClick={onClick} className="cursor-pointer text-red-800">
        <XCircleIcon color="error" width={25} height={25} />
      </span>
    </div>
  );
};

export default Alert;
