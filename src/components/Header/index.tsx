'use client';

import { MenuItems } from 'routes/menu';
import { MenuItemType } from 'types/types';
import { usePathname } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import React, { useEffect, useRef } from 'react';
import { Bars3Icon, XCircleIcon } from '@heroicons/react/20/solid';
import SiteLogo from '../SiteLogo';
// import { useUser } from 'hooks/useUser';

interface HeaderProps {
  classes?: { root?: string; menuUnderline?: string; whiteLogo?: boolean };
}

export default function Header({ classes }: HeaderProps) {
  const [isOpen, setOpen] = React.useState<boolean | null>(null);
  // const { user } = useUser();

  const pathname = usePathname();
  const pageTitle = pathname.split('/')[1];
  const navRef = useRef<HTMLDivElement>(null);
  const Bar3Ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    // Function to handle click events
    const handleClick = (event: MouseEvent) => {
      // Update the state when clicked anywhere on the DOM
      if (
        navRef.current &&
        !navRef.current.contains(event.target as Node) &&
        Bar3Ref.current &&
        !Bar3Ref.current.contains(event.target as Node)
      ) {
        isOpen && setOpen(false);
      }
    };

    // Add event listener when component mounts
    document.addEventListener('click', handleClick);

    // Clean up function to remove event listener when component unmounts
    return () => {
      document.removeEventListener('click', handleClick);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const MenuItem = ({
    item,
    className = `md:ms-8 border-b md:border-0 block
      py-3 md:p-0 group transition
      duration-300`,
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
        <span
          className={`md:block hidden max-w-0 group-hover:max-w-full transition-all duration-500 h-0.5 bg-black ${classes?.menuUnderline}`}
        ></span>
      </Link>
    );
  };

  return (
    <nav
      className={`
                flex flex-wrap
                items-center
                justify-between
                w-full md:h-[100px] h-[70px]
                text-lg text-black ${classes?.root}
              `}
    >
      <Link href="/">
        <SiteLogo white={classes?.whiteLogo} />
      </Link>
      <div ref={Bar3Ref}>
        <Bars3Icon
          className="cursor-pointer md:hidden"
          width={30}
          height={30}
          color={classes?.whiteLogo ? 'white' : ''}
          onClick={() => setOpen(!isOpen)}
        />
      </div>
      <div
        ref={navRef}
        className={`
                sm:w-1/2 md:bg-transparent bg-white md:h-auto h-screen z-20
                md:flex md:items-center md:w-auto md:animate-none
                w-3/4 md:relative absolute top-0 left-0 
                ${isOpen === null && 'hidden'} ${
          isOpen
            ? 'animate-left-to-right'
            : 'animate-right-to-left md:translate-x-0 -translate-x-[100%]'
        }
              `}
      >
        <div className="relative">
          <Image
            src="/icons/slysol.svg"
            height={50}
            width={100}
            alt="slysol logo"
            className="m-auto pt-5 md:hidden block"
          />
          <XCircleIcon
            width={25}
            color="#1c1c25"
            className="absolute top-2 right-2 md:hidden"
            onClick={() => setOpen(false)}
          />
          <ul
            className="
                    text-base
                    p-4
                    md:flex
                    md:justify-between
                    md:p-0
                  "
          >
            {MenuItems.map((item, index) => (
              <li key={`MenuRoute-${index}`}>
                <MenuItem item={item} />
              </li>
            ))}
            {/* {!!user && (
              <li key={`MenuRoute-Dashboard`}>
                <MenuItem
                  item={{
                    name: 'Dashboard',
                    path: '/dashboard',
                    slug: 'dashboard',
                    description: 'Slysol dashboard',
                    title: 'Dashboard | Slysol',
                  }}
                />
              </li>
            )} */}
          </ul>
        </div>
      </div>
    </nav>
  );
}
