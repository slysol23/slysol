'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '../../providers/UserProvider';

interface RoleProtectedProps {
  roles: ('admin' | 'user')[];
  children: React.ReactNode;
}

const RoleProtected = ({ roles, children }: RoleProtectedProps) => {
  const { user, isAdmin, isLoading } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (isLoading) return;

    if (!user) {
      router.replace('/login');
      return;
    }

    const userRole: 'admin' | 'user' = isAdmin ? 'admin' : 'user';

    if (!roles.includes(userRole)) {
      router.replace('/dashboard/blog');
    }
  }, [user, isLoading, roles, router, isAdmin]);

  if (isLoading) return <div>Loading...</div>;

  const userRole: 'admin' | 'user' = isAdmin ? 'admin' : 'user';

  if (!user || !roles.includes(userRole)) return null;

  return <>{children}</>;
};

export default RoleProtected;
