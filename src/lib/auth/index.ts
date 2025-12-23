import { ApiResponse, IUser, LoginCredentials, RegisterData } from 'lib/type';
import apiClient from '../client';

export const auth = {
  login: async (credentials: LoginCredentials) => {
    const response = await apiClient.post<ApiResponse<boolean>>(
      '/login',
      credentials,
    );
    return response.data;
  },

  register: async (userData: RegisterData) => {
    const response = await apiClient.post<ApiResponse<IUser>>(
      '/user',
      userData,
    );
    return response.data;
  },

  getSession: async () => {
    const response = await apiClient.get<ApiResponse<IUser>>('/session');
    return response.data;
  },

  logout: async () => {
    const response = await apiClient.post<ApiResponse<{}>>('/logout');
    return response.data;
  },
};
