import Link from 'next/link';
import React from 'react';
import { FaPlus } from 'react-icons/fa';

type ButtonProps = {
  text?: React.ReactNode;
  href?: string;
  className?: string;
  success?: boolean;
} & React.ButtonHTMLAttributes<HTMLButtonElement>;

const DashboardButton = ({
  text,
  children,
  href,
  className = '',
  success,
  type = 'button',

  ...rest
}: ButtonProps) => {
  const content = children ?? text;

  const baseClasses =
    'inline-flex items-center justify-center gap-2 transition-colors duration-200 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2';

  const variantClasses = href
    ? 'px-2 sm:px-4 py-1 sm:py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition text-sm sm:text-base whitespace-nowrap'
    : success
      ? 'px-2 sm:px-4 py-1 sm:py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition text-sm sm:text-base whitespace-nowrap'
      : 'px-2 sm:px-4 py-1 sm:py-2 border border-blue-500 text-blue-500 rounded-lg hover:bg-blue-500 hover:text-white transition text-sm sm:text-base whitespace-nowrap';

  const classes = `${baseClasses} ${variantClasses} ${className}`.trim();

  if (href) {
    const anchorProps = rest as React.AnchorHTMLAttributes<HTMLAnchorElement>;

    return (
      <Link href={href} className={classes} {...anchorProps}>
        <FaPlus /> Add {content}
      </Link>
    );
  }

  return (
    <button type={type} className={classes} {...rest}>
      {content}
    </button>
  );
};

export default DashboardButton;
