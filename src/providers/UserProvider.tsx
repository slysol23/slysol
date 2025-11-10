'use client';
import { IUser } from 'lib/type';
import React, { createContext, ReactNode } from 'react';
import * as api from 'lib';
import { useQuery } from '@tanstack/react-query';
import { AxiosError } from 'axios';

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

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const { data, isError, refetch, isLoading } = useQuery({
    queryKey: ['session'],
    queryFn: async () => {
      const res = await api.auth.getSession();
      return res.data;
    },
    retry: (failureCount, error: AxiosError) => {
      if (error?.response?.status === 401) {
        return false;
      }
      return failureCount < 3;
    },
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
