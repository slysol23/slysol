// src/components/Role/RoleProtected.tsx
'use client';

import React from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

interface RoleProtectedProps {
  roles: ('admin' | 'user')[];
  children: React.ReactNode;
}

const RoleProtected = ({ roles, children }: RoleProtectedProps) => {
  const { data: session, status } = useSession();
  const router = useRouter();

  if (status === 'loading') return <div>Loading...</div>;

  if (!session?.user) {
    router.replace('/login');
    return null;
  }

  const userRole: 'admin' | 'user' = session.user.isAdmin ? 'admin' : 'user';

  if (!roles.includes(userRole)) {
    router.replace('/dashboard'); // redirect non-admins
    return null;
  }

  return <>{children}</>;
};

export default RoleProtected;
