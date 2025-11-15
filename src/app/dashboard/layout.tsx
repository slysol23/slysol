// src/app/dashboard/layout.tsx
import Sidebar from '@/components/dashboard/Sidebar';
import NextAuthSessionProvider from '@/components/Providers/sessionProvider';
import { auth } from 'auth';
import { redirect } from 'next/navigation';

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session?.user) {
    redirect('/login');
  }

  return (
    <NextAuthSessionProvider>
      <div className="flex min-h-screen">
        <Sidebar />
        <main className="flex-1 p-8 bg-gray-100">{children}</main>
      </div>
    </NextAuthSessionProvider>
  );
}
