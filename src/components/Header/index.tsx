'use client';

import { MenuItems } from 'routes/menu';
import { MenuItemType } from 'types/types';
import { usePathname } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';
import { Bars3Icon } from '@heroicons/react/20/solid';

export default function Header() {
  const [isOpen, setOpen] = React.useState<boolean>(false);
  const pathname = usePathname();
  const pageTitle = pathname.split('/')[1];

  const MenuItem = ({
    item,
    className = `md:ms-8 border-b md:border-0 block
      uppercase py-3 md:p-0 group transition
      duration-300 text-black`,
  }: {
    item: MenuItemType;
    className?: string;
  }) => {
    const isActive =
      pageTitle === item.path.split('/')[1]
        ? `${className} font-bold decoration-2`
        : className;
    return (
      <Link
        className={isActive}
        href={item.path}
        onClick={() => setOpen(false)}
      >
        {item.name}
        <span className="block max-w-0 group-hover:max-w-full transition-all duration-500 h-0.5 bg-black"></span>
      </Link>
    );
  };

  return (
    <div className="border-b shadow-md fixed top-0 w-full z-10 bg-white">
      <div className="max-w-6xl m-auto px-[14px]">
        <nav
          className="
              flex flex-wrap
              items-center
              justify-between
              w-full font-neue
              py-4
              text-lg text-gray-700
            "
        >
          <div>
            <Link href="/">
              <Image
                src="/icons/slysol-logo.png"
                alt="Next"
                width={100}
                height={100}
              />
            </Link>
          </div>
          <Bars3Icon
            className="cursor-pointer md:hidden"
            width={30}
            height={30}
            onClick={() => setOpen(!isOpen)}
          />
          <div
            className={`
              w-full
              md:flex md:items-center md:w-auto
              ${!isOpen && 'hidden'}
            `}
          >
            <ul
              className="
                text-base text-gray-700 dark:text-white
                pt-4
                md:flex
                md:justify-between
                md:pt-0
              "
            >
              {MenuItems.map((item, index) => (
                <li key={`MenuRoute-${index}`}>
                  <MenuItem item={item} />
                </li>
              ))}
            </ul>
          </div>
        </nav>
      </div>
    </div>
  );
}
