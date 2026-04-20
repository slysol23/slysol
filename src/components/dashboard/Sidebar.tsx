'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useRouter } from 'next/navigation';
import {
  FaBlog,
  FaCommentDots,
  FaUser,
  FaUsers,
  FaChevronLeft,
  FaChevronRight,
  FaSignOutAlt,
  FaBars,
  FaTimes,
} from 'react-icons/fa';
import { BsBoxSeam } from 'react-icons/bs';
import { useUser } from '../../providers/UserProvider';
import { useQueryClient } from '@tanstack/react-query';

const Sidebar = () => {
  const pathname = usePathname();
  const router = useRouter();
  const { user, isAdmin, isLoading } = useUser();
  const [hovered, setHovered] = useState<string | null>(null);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const queryClient = useQueryClient();

  // Close mobile menu when resizing to desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setIsMobileOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMobileOpen]);

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

  if (isLoading || !user) {
    return null;
  }

  return (
    <>
      {/* Mobile Header - Fixed at top */}
      <header className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-blue z-30 flex items-center justify-between px-4 shadow-md border-b border-white/10">
        <Link href="/" className="flex items-center gap-2">
          <Image
            height={32}
            width={32}
            src="/icons/slysol-white.svg"
            alt="Slysol"
            priority
            className="h-8 w-auto"
          />
        </Link>
        <button
          onClick={() => setIsMobileOpen(!isMobileOpen)}
          className="p-2 text-white hover:bg-white/10 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-white/50"
          aria-label="Toggle menu"
        >
          {isMobileOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
        </button>
      </header>

      {/* Mobile Backdrop */}
      {isMobileOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-40 transition-opacity duration-300"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed right-0 lg:sticky lg:top-0 lg:left-0 lg:right-auto z-50 lg:z-auto
          bg-blue flex flex-col h-screen shadow-2xl
          transition-all duration-300 ease-in-out border-r border-white/10
                    ${isMobileOpen ? 'translate-x-0' : 'translate-x-full lg:translate-x-0'}

        ${isCollapsed ? 'w-20' : 'w-64'}
      `}
      >
        {/* Collapse Toggle Button */}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="absolute -right-3 top-8 bg-white text-blue-600 p-1.5 rounded-full shadow-lg border border-blue-100 hover:scale-110 hover:shadow-xl transition-all duration-200 z-50 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 hidden lg:block"
          aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {isCollapsed ? (
            <FaChevronRight size={14} />
          ) : (
            <FaChevronLeft size={14} />
          )}
        </button>

        {/* Logo Section */}
        <div
          className={`
    flex flex-col items-center justify-center border-b border-white/10
    ${isCollapsed ? 'lg:py-4' : 'py-6'}
    pt-16 lg:pt-6 px-4
  `}
        >
          <Link href="/" className="relative w-full flex justify-center">
            <Image
              height={80}
              width={80}
              src={
                isCollapsed ? '/icons/S-logo.png' : '/icons/slysol-white.svg'
              }
              alt="Slysol"
              priority
              className={`h-auto transition-all duration-300 drop-shadow-md w-20 lg:w-32
                ${isCollapsed ? 'lg:w-7' : ''}
        hover:scale-110 hover:drop-shadow-lg
      `}
            />
          </Link>
        </div>

        {/* Navigation - Scrollable if needed */}
        <nav className="flex-1 overflow-y-auto overflow-x-hidden py-4 px-3 scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent">
          <div className="flex flex-col gap-1">
            {filteredMenu.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`
                    group relative flex items-center rounded-xl text-white/90 
                    transition-all duration-200 ease-out
                    ${isActive ? 'bg-white/20 text-white font-semibold shadow-inner' : 'hover:bg-white/10 hover:text-white hover:translate-x-1'}
                    ${isCollapsed ? 'lg:justify-center lg:px-0 px-4' : 'px-4'}
                    py-3 gap-3
                  `}
                  onMouseEnter={() => setHovered(item.href)}
                  onMouseLeave={() => setHovered(null)}
                >
                  {/* Active Indicator */}
                  {isActive && (
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 h-6 w-1 bg-white rounded-r-full shadow-lg" />
                  )}

                  {/* Icon */}
                  <span
                    className={`
                    shrink-0 transition-transform duration-200
                    ${isActive ? 'scale-110 drop-shadow-md' : 'group-hover:scale-110'}
                  `}
                  >
                    {item.icon}
                  </span>

                  {/* Label - Hidden when collapsed on desktop */}
                  <span
                    className={`
                    font-medium whitespace-nowrap transition-all duration-300
                    ${isCollapsed ? 'lg:hidden opacity-0 w-0' : 'opacity-100'}
                  `}
                  >
                    {item.label}
                  </span>

                  {/* Desktop Tooltip */}
                  {isCollapsed && (
                    <div className="hidden lg:block absolute left-full ml-4 px-3 py-1.5 bg-gray-900 text-white text-sm rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 whitespace-nowrap z-50 shadow-xl pointer-events-none">
                      {item.label}
                      <div className="absolute left-0 top-1/2 -translate-x-1 -translate-y-1/2 border-4 border-transparent border-r-gray-900" />
                    </div>
                  )}
                </Link>
              );
            })}
          </div>
        </nav>

        {/* Bottom Section - Logout */}
        <div className="border-t border-white/10 p-4 shrink-0">
          <button
            onClick={handleLogout}
            disabled={isLoggingOut}
            className={`
              flex items-center justify-center gap-2 
              bg-linear-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 
              text-white rounded-xl transition-all duration-200 
              active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed 
              shadow-lg hover:shadow-xl w-full
              ${isCollapsed ? 'lg:px-0 px-4' : 'px-4'}
              py-3
            `}
            title={isCollapsed ? 'Logout' : undefined}
          >
            {isLoggingOut ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin shrink-0" />
            ) : (
              <>
                <FaSignOutAlt size={18} className="shrink-0" />
                <span
                  className={`
                  font-medium transition-all duration-300
                  ${isCollapsed ? 'lg:hidden' : 'block'}
                `}
                >
                  Logout
                </span>
              </>
            )}
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
