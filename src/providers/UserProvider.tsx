'use client';
import { IUser } from 'lib/type';
import React, { createContext, ReactNode, useContext } from 'react';
import { useQuery } from '@tanstack/react-query';

export interface UserContextType {
  user: IUser | null | undefined;
  isAdmin: boolean;
  isLoading: boolean;
  isError: boolean;
  refetch: () => void;
}

export const UserContext = createContext<UserContextType | undefined>(
  undefined,
);

const fetchSession = async (): Promise<IUser> => {
  const res = await fetch('/api/session', { cache: 'no-store' });
  if (!res.ok) {
    throw new Error('Not authenticated');
  }
  const data = await res.json();
  return data.data;
};

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const { data, isError, refetch, isLoading } = useQuery({
    queryKey: ['session'],
    queryFn: fetchSession,
    retry: false,
    staleTime: 5 * 60 * 1000,
  });

  return (
    <UserContext.Provider
      value={{
        user: data ?? null,
        isAdmin: data?.isAdmin ?? false,
        isLoading,
        isError,
        refetch,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

// Custom hook to use the UserContext
export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};
