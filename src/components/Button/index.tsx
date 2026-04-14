import Link from 'next/link';
import React from 'react';

type ButtonProps = {
  text?: React.ReactNode;
  href?: string;
  className?: string;
  gray?: boolean;
} & React.ButtonHTMLAttributes<HTMLButtonElement>;

const Button = ({
  text,
  children,
  href,
  className = '',
  gray,
  type = 'button',
  ...rest
}: ButtonProps) => {
  const content = children ?? text;

  const baseClasses =
    'inline-flex items-center justify-center gap-2 transition-colors duration-200 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2';

  const variantClasses = gray
    ? 'bg-gray-200 text-black hover:bg-green-300 focus-visible:ring-gray-500/40'
    : 'bg-primary2 text-white hover:bg-green-600 focus-visible:ring-green-500/40';

  const classes = `${baseClasses} ${variantClasses} ${className}`.trim();

  if (href) {
    const anchorProps = rest as React.AnchorHTMLAttributes<HTMLAnchorElement>;

    return (
      <Link href={href} className={classes} {...anchorProps}>
        {content}
      </Link>
    );
  }

  return (
    <button type={type} className={classes} {...rest}>
      {content}
    </button>
  );
};

export default Button;
