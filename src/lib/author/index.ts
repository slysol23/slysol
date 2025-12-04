import { ApiResponse, IAuthor, ICreateAuthor, IUpdateAuthor } from 'lib/type';
import apiClient from 'lib/client';

export const author = {
  // 🟢 Get all authors
  getAll: async () => {
    const response = await apiClient.get<ApiResponse<IAuthor[]>>('/author');
    return response.data;
  },

  // 🟢 Get single author by ID
  getById: async (id: number) => {
    const response = await apiClient.get<ApiResponse<IAuthor>>(`/author/${id}`);
    return response.data;
  },

  // 🟡 Create new author
  create: async (data: ICreateAuthor) => {
    const response = await apiClient.post<ApiResponse<IAuthor>>(
      '/author',
      data,
    );
    return response.data;
  },

  // 🟠 Update author by ID
  update: async (id: number, data: IUpdateAuthor) => {
    const response = await apiClient.patch<ApiResponse<IAuthor>>(
      `/author/${id}`,
      data,
    );
    return response.data;
  },

  // 🔴 Delete author by ID
  delete: async (id: number) => {
    const response = await apiClient.delete<ApiResponse<{}>>(`/author/${id}`);
    return response.data;
  },
};
