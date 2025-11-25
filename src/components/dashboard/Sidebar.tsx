'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { FaBlog, FaUser, FaUsers } from 'react-icons/fa';
import { useUser } from '../../providers/UserProvider';

const Sidebar = () => {
  const pathname = usePathname();
  const router = useRouter();
  const { user, isAdmin, isLoading } = useUser();

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

  if (isLoading) {
    return (
      <div className="w-64 bg-blue p-4 text-white">Loading Sidebar...</div>
    );
  }

  if (!user) {
    return <div className="w-64 bg-blue p-4 text-white">No session found</div>;
  }

  // Filter menu based on admin status
  const filteredMenu = menu.filter((item) => !item.adminOnly || isAdmin);

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/login');
  };
  if (isLoading) {
    return (
      <div className="min-h-screen text-black flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
          <p className="text-xl">Loading...</p>
        </div>
      </div>
    );
  }

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
          onClick={handleLogout}
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
