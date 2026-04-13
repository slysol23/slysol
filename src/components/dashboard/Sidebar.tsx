'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import {
  FaBlog,
  FaCommentDots,
  FaUser,
  FaUsers,
  FaChevronLeft,
  FaChevronRight,
  FaSignOutAlt,
} from 'react-icons/fa';
import { BsBoxSeam } from 'react-icons/bs';
import { useUser } from '../../providers/UserProvider';
import { useQueryClient } from '@tanstack/react-query';
import router from 'next/router';

const Sidebar = () => {
  const pathname = usePathname();
  const { user, isAdmin, isLoading } = useUser();
  const [hovered, setHovered] = useState<string | null>(null);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const queryClient = useQueryClient();

  const menu = [
    {
      label: 'Products',
      href: '/dashboard/product',
      icon: <BsBoxSeam size={20} />,
      adminOnly: false,
    },
    {
      label: 'Blogs',
      href: '/dashboard/blog',
      icon: <FaBlog size={20} />,
      adminOnly: false,
    },
    {
      label: 'Comments',
      href: '/dashboard/comments',
      icon: <FaCommentDots size={20} />,
      adminOnly: false,
    },
    {
      label: 'Authors',
      href: '/dashboard/author',
      icon: <FaUser size={20} />,
      adminOnly: false,
    },
    {
      label: 'Users',
      href: '/dashboard/user',
      icon: <FaUsers size={20} />,
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
    <div
      className={`
        relative bg-blue flex flex-col justify-between h-screen shadow-2xl 
        transition-all duration-300 ease-in-out border-r border-white/10
        ${isCollapsed ? 'w-20' : 'w-64'}
      `}
    >
      {/* Collapse Toggle Button */}
      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="absolute -right-3 top-8 bg-white text-blue-600 p-1.5 rounded-full shadow-lg border border-blue-100 hover:scale-110 hover:shadow-xl transition-all duration-200 z-50 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2"
        aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
      >
        {isCollapsed ? (
          <FaChevronRight size={14} />
        ) : (
          <FaChevronLeft size={14} />
        )}
      </button>

      {/* Top Section */}
      <div className="flex flex-col">
        {/* Logo */}
        <Link
          href="/"
          className={`
            flex items-center justify-center transition-all duration-300
            ${isCollapsed ? 'py-6 px-2' : 'py-6 px-4'}
          `}
        >
          <Image
            height={500}
            width={500}
            src="/icons/slysol-white.svg"
            alt="Slysol"
            priority
            className={`
              h-auto transition-all duration-300 drop-shadow-md
              ${isCollapsed ? 'w-10' : 'w-20'}
              hover:scale-110 hover:drop-shadow-lg
            `}
          />
        </Link>

        {/* Navigation */}
        <nav className="flex flex-col gap-1 px-3 mt-2">
          {filteredMenu.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`
                  group relative flex items-center rounded-xl text-white/90 
                  transition-all duration-200 ease-out
                  ${isCollapsed ? 'justify-center p-3' : 'px-4 py-3 gap-3'}
                  ${
                    isActive
                      ? 'bg-white/20 text-white font-semibold shadow-inner'
                      : 'hover:bg-white/10 hover:text-white hover:translate-x-1'
                  }
                `}
                onMouseEnter={() => setHovered(item.href)}
                onMouseLeave={() => setHovered(null)}
              >
                {/* Active Indicator Bar */}
                {isActive && (
                  <div
                    className={`
                    absolute left-0 top-1/2 -translate-y-1/2 h-6 w-1 bg-white rounded-r-full shadow-lg
                    transition-all duration-300
                    ${isCollapsed ? 'opacity-0' : 'opacity-100'}
                  `}
                  />
                )}

                {/* Icon Container */}
                <span
                  className={`
                  transition-all duration-200 flex-shrink-0
                  ${isActive ? 'scale-110 drop-shadow-md' : 'group-hover:scale-110'}
                `}
                >
                  {item.icon}
                </span>

                {/* Label */}
                <span
                  className={`
                  whitespace-nowrap overflow-hidden transition-all duration-300 font-medium
                  ${isCollapsed ? 'w-0 opacity-0' : 'w-auto opacity-100 flex-1'}
                `}
                >
                  {item.label}
                </span>

                {/* Tooltip for Collapsed Mode */}
                {isCollapsed && (
                  <div className="absolute left-full ml-4 px-3 py-1.5 bg-gray-900 text-white text-sm rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 whitespace-nowrap z-50 shadow-xl pointer-events-none">
                    {item.label}
                    <div className="absolute left-0 top-1/2 -translate-x-1 -translate-y-1/2 border-4 border-transparent border-r-gray-900" />
                  </div>
                )}

                {/* Hover Glow Effect */}
                {!isCollapsed && hovered === item.href && !isActive && (
                  <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-white/5 to-transparent pointer-events-none" />
                )}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Bottom Section */}
      <div
        className={`
        border-t border-white/10 transition-all duration-300
        ${isCollapsed ? 'p-3 flex justify-center' : 'p-4'}
      `}
      >
        <button
          onClick={handleLogout}
          disabled={isLoggingOut}
          className={`
            flex items-center justify-center gap-2 
            bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 
            text-white rounded-xl transition-all duration-200 
            active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed 
            shadow-lg hover:shadow-xl hover:-translate-y-0.5
            ${isCollapsed ? 'w-10 h-10 p-0' : 'w-full py-3 px-4'}
          `}
          title={isCollapsed ? 'Logout' : undefined}
        >
          {isLoggingOut ? (
            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            <>
              <FaSignOutAlt
                size={18}
                className={`${isCollapsed ? '' : 'ml-1'}`}
              />
              <span
                className={`
                font-medium transition-all duration-300
                ${isCollapsed ? 'w-0 opacity-0 absolute' : 'w-auto opacity-100 relative'}
              `}
              >
                Logout
              </span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
