import Sidebar from '@/components/dashboard/Sidebar';
import { UserProvider } from '../../providers/UserProvider';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <UserProvider>
      <div className="flex min-h-screen">
        <Sidebar />
        <main className="flex-1 p-8 bg-gray-100">{children}</main>
      </div>
    </UserProvider>
  );
}
