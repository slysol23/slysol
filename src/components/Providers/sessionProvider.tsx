// components/Providers/sessionProvider.tsx
'use client';

import { SessionProvider } from 'next-auth/react';

export default function NextAuthSessionProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return <SessionProvider basePath="/api/auth">{children}</SessionProvider>;
}
