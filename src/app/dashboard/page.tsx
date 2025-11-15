import { auth } from 'auth';
import { redirect } from 'next/navigation';
import React from 'react';

const DashboardPage = async () => {
  const session = await auth();

  if (!session?.user) {
    redirect('/login');
  }

  const isAdmin = (session.user as any).isAdmin;

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
