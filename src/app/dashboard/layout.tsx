import Sidebar from '@/components/dashboard/Sidebar';
import React from 'react';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <div className="flex h-screen text-gray-200">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <main className="flex-1 p-8 overflow-auto">{children}</main>
    </div>
  );
}
