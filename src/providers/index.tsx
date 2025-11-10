'use client';
import React, { ReactNode, Suspense } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { UserProvider } from './UserProvider';

const queryClient = new QueryClient();

export const AppContextsProvider = ({ children }: { children: ReactNode }) => {
  return (
    <QueryClientProvider client={queryClient}>
      <UserProvider>{children}</UserProvider>
    </QueryClientProvider>
  );
};
