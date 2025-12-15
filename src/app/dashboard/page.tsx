'use client';

import { useUser } from '../../providers/UserProvider';

const DashboardPage = () => {
  const { isAdmin } = useUser();

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
