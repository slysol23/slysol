'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { FaBlog, FaUser, FaUsers } from 'react-icons/fa';

const Sidebar = () => {
  const pathname = usePathname();

  const menu = [
    { label: 'Blogs', icon: <FaBlog />, href: '/dashboard/blog' },
    { label: 'Authors', icon: <FaUser />, href: '/dashboard/author' },
    { label: 'Users', icon: <FaUsers />, href: '/dashboard/user' },
  ];

  return (
    <div className="w-64 bg-blue flex flex-col justify-between">
      <div>
        <Link href={'/'}>
          <Image
            height={500}
            width={500}
            src="/icons/slysol-white.svg"
            alt="icon"
            className="w-20 h-auto mx-auto my-5 "
          />
        </Link>

        <nav className="flex flex-col gap-2 px-4">
          {menu.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={` flex items-center px-4 py-2 rounded-lg gap-3 hover:bg-gray-400 ${
                pathname === item.href ? 'bg-gray-400 font-bold' : ''
              }`}
            >
              {item.icon} <span>{item.label}</span>
            </Link>
          ))}
        </nav>
      </div>

      <div className="p-4">
        <button
          className="w-full bg-red-600 py-2 rounded-lg hover:bg-red-500"
          onClick={() => {
            localStorage.removeItem('token'); // or whatever key you use
            window.location.href = '/login'; // redirect to login page
          }}
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
