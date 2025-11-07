import { IUser, ApiResponse } from 'lib/type';
import apiClient from 'lib/client';

export const user = {
  getAll: async () => {
    const response = await apiClient.get<ApiResponse<IUser[]>>('/user');
    return response.data;
  },
  create: async (data: Partial<IUser>) => {
    const response = await apiClient.post<ApiResponse<IUser>>('/user', data);
    return response.data;
  },
  delete: async (id: number) => {
    const response = await apiClient.delete<ApiResponse<{}>>(`/user/${id}`);
    return response.data;
  },
};
