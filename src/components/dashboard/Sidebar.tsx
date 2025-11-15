// src/components/dashboard/Sidebar.tsx
'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { FaBlog, FaUser, FaUsers } from 'react-icons/fa';
import { useSession, signOut, getSession } from 'next-auth/react';

const Sidebar = () => {
  const pathname = usePathname();
  const { data: session, status } = useSession();

  console.log({ session });

  if (status === 'loading')
    return <div className="w-64 bg-blue p-4">Loading...</div>;

  const menu = [
    {
      label: 'Blogs',
      href: '/dashboard/blog',
      icon: <FaBlog />,
      adminOnly: false,
    },
    {
      label: 'Authors',
      href: '/dashboard/author',
      icon: <FaUser />,
      adminOnly: false,
    },
    {
      label: 'Users',
      href: '/dashboard/user',
      icon: <FaUsers />,
      adminOnly: true,
    },
  ];
  const isAdmin = session?.user && (session.user as any).isAdmin;

  // Filter menu based on admin status
  const filteredMenu = menu.filter((item) => !item.adminOnly || isAdmin);

  return (
    <div className="w-64 bg-blue flex flex-col justify-between">
      <div>
        <Link href="/">
          <Image
            height={500}
            width={500}
            src="/icons/slysol-white.svg"
            alt="icon"
            className="w-20 h-auto mx-auto my-5"
          />
        </Link>

        {/* Debug info */}
        <div className="flex flex-col gap-2 px-4">
          <p className="flex items-center px-4 py-2 rounded-lg gap-2 text-white">
            <FaUser />
            <strong className="items-center">Admin:</strong> {String(isAdmin)}
          </p>
        </div>

        <nav className="flex flex-col gap-2 px-4">
          {filteredMenu.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center px-4 py-2 rounded-lg gap-3 text-white hover:bg-gray-400 ${
                pathname === item.href ? 'bg-gray-400 font-bold' : ''
              }`}
            >
              {item.icon} <strong>{item.label}</strong>
            </Link>
          ))}
        </nav>
      </div>

      <div className="p-4">
        <button
          className="w-full bg-red-500 py-2 rounded-lg text-white hover:bg-red-600"
          onClick={() => signOut({ callbackUrl: '/login' })}
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
