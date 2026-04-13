'use client';

export const dynamic = 'force-dynamic';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useUser } from '../../providers/UserProvider';
import Sidebar from '@/components/dashboard/Sidebar';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { user, isLoading } = useUser();

  useEffect(() => {
    if (!isLoading && !user) {
      router.replace('/login');
    }
  }, [isLoading, user, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin h-8 w-8 border-b-2 border-gray-900 rounded-full" />
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="flex h-[100dvh] bg-gray-50">
      <Sidebar />
      <main className="flex-1 bg-gray-50 max-h-[100dvh] overflow-y-auto overflow-x-hidden">
        <div className="lg:hidden h-16 flex-shrink-0 flex-row-reverse" />
        <div className="flex-1 overflow-y-auto p-4 lg:p-8">{children}</div>
      </main>
    </div>
  );
}
