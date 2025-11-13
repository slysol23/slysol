import { IBlog, ICreateBlog, IUpdateBlog, ApiResponse } from 'lib/type';
import apiClient from 'lib/client';

export interface BlogApiResponse {
  message: string;
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  data: IBlog[];
}

export const blog = {
  // 🟢 Get all blogs with pagination
  getAll: async (page = 1, limit = 6): Promise<BlogApiResponse> => {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
    });

    const response = await apiClient.get(`/blog?${params.toString()}`);
    const resData = response.data;

    return {
      message: resData.message,
      page: resData.page ?? page,
      limit: resData.limit ?? limit,
      total: resData.total ?? resData.data.length,
      totalPages:
        resData.totalPages ??
        Math.ceil((resData.total ?? resData.data.length) / limit),
      data: resData.data,
    };
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
