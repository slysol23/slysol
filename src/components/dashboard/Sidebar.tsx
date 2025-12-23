'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { FaBlog, FaCommentDots, FaUser, FaUsers } from 'react-icons/fa';
import { useUser } from '../../providers/UserProvider';
import { useQueryClient } from '@tanstack/react-query';
import router from 'next/router';

const Sidebar = () => {
  const pathname = usePathname();
  const { user, isAdmin, isLoading } = useUser();
  const [hovered, setHovered] = useState<string | null>(null);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const queryClient = useQueryClient();

  const menu = [
    {
      label: 'Blogs',
      href: '/dashboard/blog',
      icon: <FaBlog />,
      adminOnly: false,
    },
    {
      label: 'Comments',
      href: '/dashboard/comments',
      icon: <FaCommentDots />,
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

  const filteredMenu = menu.filter((item) => !item.adminOnly || isAdmin);

  const handleLogout = async () => {
    try {
      setIsLoggingOut(true);
      queryClient.setQueryData(['session'], null);
      queryClient.cancelQueries({ queryKey: ['session'] });
      await fetch('/api/logout', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Cache-Control': 'no-cache',
          Pragma: 'no-cache',
        },
        cache: 'no-store',
      });

      queryClient.clear();
      await new Promise((resolve) => setTimeout(resolve, 400));
      router.push('/login');
    } catch (error) {
      console.error('Logout error:', error);
      window.location.replace('/login');
    }
  };
  if (isLoading) {
    return null;
  }

  if (!user) {
    return null;
  }

  return (
    <div className="w-64 bg-blue flex flex-col justify-between min-h-screen shadow-lg">
      <div>
        <Link href="/">
          <Image
            height={500}
            width={500}
            src="/icons/slysol-white.svg"
            alt="icon"
            className="w-20 h-auto mx-auto my-5 transition-transform duration-300 hover:scale-110"
          />
        </Link>
        <nav className="flex flex-col gap-2 px-4">
          {filteredMenu.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`
              flex items-center px-4 py-2 rounded-lg gap-3 text-white transition-all duration-200
              ${isActive ? 'bg-gray-400 font-bold scale-105' : ''}
              ${hovered === item.href ? 'bg-gray-500 scale-105' : ''}
            `}
                onMouseEnter={() => setHovered(item.href)}
                onMouseLeave={() => setHovered(null)}
              >
                <span className="text-xl">{item.icon}</span>
                <span className="flex-1">{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>
      <div className="p-4">
        <button
          className="w-full bg-red-500 py-2 rounded-lg text-white hover:bg-red-600 transition-colors duration-200 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
          onClick={handleLogout}
          disabled={isLoggingOut}
        >
          {isLoggingOut ? 'Logging out...' : 'Logout'}
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
