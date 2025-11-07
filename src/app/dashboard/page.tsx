'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { FaBlog, FaUser, FaUsers } from 'react-icons/fa';
interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const pathname = usePathname();

  const menu = [
    { label: 'Blogs', icon: <FaBlog />, href: '/dashboard/blog' },
    { label: 'Authors', icon: <FaUser />, href: '/dashboard/author' },
    { label: 'Users', icon: <FaUsers />, href: '/dashboard/user' },
  ];

  return (
    <div className="flex h-screen text-gray-200">
      {/* Sidebar */}
      <aside className="w-64 bg-blue flex flex-col justify-between">
        <div>
          <Link href={'/'}>
            <img
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
              // logout logic here
              console.log('Logout clicked');
            }}
          >
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8 overflow-auto">{children}</main>
    </div>
  );
}
