import { IBlog, ICreateBlog, IUpdateBlog, ApiResponse } from 'lib/type';
import apiClient from 'lib/client';

export const blog = {
  // 🟢 Get all blogs
  getAll: async (page?: number, limit?: number) => {
    const params = new URLSearchParams();

    if (page) params.append('page', page.toString());
    if (limit) params.append('limit', limit.toString());

    const response = await apiClient.get<ApiResponse<IBlog[]>>(
      `/blog${params.toString() ? `?${params.toString()}` : ''}`,
    );
    return response.data;
  },

  // 🟢 Get single blog by ID
  getById: async (id: number) => {
    const response = await apiClient.get<ApiResponse<IBlog>>(`/blog/${id}`);
    return response.data;
  },

  // 🟡 Create new blog
  create: async (data: ICreateBlog) => {
    const response = await apiClient.post<ApiResponse<IBlog>>('/blog', data);
    return response.data;
  },

  // 🟠 Update blog by ID
  update: async (id: number, data: IUpdateBlog) => {
    const response = await apiClient.patch<ApiResponse<IBlog>>(
      `/blog/${id}`,
      data,
    );
    return response.data;
  },

  // 🔴 Delete blog by ID
  delete: async (id: number) => {
    const response = await apiClient.delete<ApiResponse<{}>>(`/blog/${id}`);
    return response.data;
  },
};
