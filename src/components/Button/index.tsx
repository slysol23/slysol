import React from 'react';

interface ButtonProps {
  text: string;
  className?: string;
}
const Button = ({ text, className = '' }: ButtonProps) => {
  return (
    <button
      className={`bg-primary text-white text-sm lg:text-base
       py-2 px-8 rounded-full font-neue ${className}`}
    >
      {text}
    </button>
  );
};

export default Button;
