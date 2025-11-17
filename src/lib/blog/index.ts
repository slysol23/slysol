import {
  IBlog,
  ICreateBlog,
  IUpdateBlog,
  ApiResponse,
  BlogApiResponse,
} from 'lib/type';
import apiClient from 'lib/client';

export const blog = {
  getAll: async (page = 1, limit = 6): Promise<BlogApiResponse> => {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
    });
    const response = await apiClient.get<BlogApiResponse>(
      `/blog?${params.toString()}`,
    );
    const rawData = response.data.data ?? [];

    const data: IBlog[] = rawData.map((b) => ({
      id: b.id ?? 0,
      authorId: b.authorId ?? 0,
      title: b.title ?? '',
      description: b.description ?? '',
      content: b.content ?? '',
      image: b.image ?? '',
      tags: b.tags ?? [],
      meta: b.meta ?? { title: '', description: '', keywords: [] },
      createdAt: b.createdAt ?? new Date().toISOString(),
      updatedAt: b.updatedAt ?? new Date().toISOString(),
      author: b.author ?? undefined,
    }));

    return {
      message: response.data.message ?? '',
      page,
      limit,
      total: response.data.total ?? data.length,
      totalPages: response.data.totalPages ?? Math.ceil(data.length / limit),
      data,
    };
  },

  getById: async (id: number): Promise<ApiResponse<IBlog>> => {
    const response = await apiClient.get<ApiResponse<IBlog>>(`/blog/${id}`);
    const b = response.data.data;
    if (!b) throw new Error('Blog not found');

    return {
      ...response.data,
      data: {
        id: b.id ?? 0,
        authorId: b.authorId ?? 0,
        title: b.title ?? '',
        description: b.description ?? '',
        content: b.content ?? '',
        image: b.image ?? '',
        tags: Array.isArray(b.tags) ? b.tags : [], // convert string to array if needed
        meta: b.meta ?? { title: '', description: '', keywords: [] },
        createdAt: b.createdAt ?? new Date().toISOString(),
        updatedAt: b.updatedAt ?? new Date().toISOString(),
        author: b.author ?? undefined,
      },
    };
  },

  create: async (data: ICreateBlog): Promise<ApiResponse<IBlog>> => {
    const response = await apiClient.post<ApiResponse<IBlog>>('/blog', data);
    const b = response.data.data;
    if (!b) throw new Error('Failed to create blog');

    return {
      ...response.data,
      data: {
        id: b.id ?? 0,
        authorId: b.authorId ?? 0,
        title: b.title ?? '',
        description: b.description ?? '',
        content: b.content ?? '',
        image: b.image ?? '',
        tags: Array.isArray(b.tags) ? b.tags : [],
        meta: b.meta ?? { title: '', description: '', keywords: [] },
        createdAt: b.createdAt ?? new Date().toISOString(),
        updatedAt: b.updatedAt ?? new Date().toISOString(),
        author: b.author ?? undefined,
      },
    };
  },

  update: async (
    id: number,
    data: IUpdateBlog,
  ): Promise<ApiResponse<IBlog>> => {
    const response = await apiClient.patch<ApiResponse<IBlog>>(
      `/blog/${id}`,
      data,
    );
    const b = response.data.data;
    if (!b) throw new Error('Failed to update blog');

    return {
      ...response.data,
      data: {
        id: b.id ?? 0,
        authorId: b.authorId ?? 0,
        title: b.title ?? '',
        description: b.description ?? '',
        content: b.content ?? '',
        image: b.image ?? '',
        tags: Array.isArray(b.tags) ? b.tags : [],
        meta: b.meta ?? { title: '', description: '', keywords: [] },
        createdAt: b.createdAt ?? new Date().toISOString(),
        updatedAt: b.updatedAt ?? new Date().toISOString(),
        author: b.author ?? undefined,
      },
    };
  },

  delete: async (id: number): Promise<ApiResponse<{}>> => {
    const response = await apiClient.delete<ApiResponse<{}>>(`/blog/${id}`);
    return response.data;
  },
};
