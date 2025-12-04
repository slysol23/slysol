'use client';

import { useRouter } from 'next/navigation';
import { useUser } from '../../providers/UserProvider';

const DashboardPage = () => {
  const router = useRouter();
  const { user, isAdmin, isLoading } = useUser();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    router.push('/login');
    return null;
  }

  return (
    <div className="text-black font-bold text-5xl text-center">
      <h1>Dashboard For</h1>
      {isAdmin ? (
        <p className="text-pink">Admin</p>
      ) : (
        <p className="text-pink">User</p>
      )}
    </div>
  );
};

export default DashboardPage;
