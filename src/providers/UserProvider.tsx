'use client';
import { IUser } from 'lib/type';
import React, { createContext, ReactNode, useContext } from 'react';
import { useQuery } from '@tanstack/react-query';

export interface UserContextType {
  user: IUser | null;
  isAdmin: boolean;
  isLoading: boolean;
  isError: boolean;
  refetch: () => void;
}

export const UserContext = createContext<UserContextType | undefined>(
  undefined,
);

const fetchSession = async (): Promise<IUser | null> => {
  try {
    const res = await fetch(`/api/session`, {
      cache: 'no-store',
      credentials: 'include',
    });
    if (!res.ok) return null;

    const data = await res.json();
    return data.data ?? null;
  } catch (error) {
    return null;
  }
};

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const query = useQuery({
    queryKey: ['session'],
    queryFn: fetchSession,
    retry: false,
    refetchOnMount: true,
    refetchOnWindowFocus: true,
    staleTime: 0,
  });

  return (
    <UserContext.Provider
      value={{
        user: query.data ?? null,
        isAdmin: query.data?.isAdmin ?? false,
        isLoading: query.isLoading,
        isError: query.isError,
        refetch: query.refetch,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) throw new Error('useUser must be used within a UserProvider');
  return context;
};
