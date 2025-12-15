import {
  IComment,
  ICreateComment,
  IUpdateComment,
  CommentApiResponse,
  ApiResponse,
} from './type';
import apiClient from 'lib/client';

/** Map backend response to IComment */
function mapComment(c: any): IComment {
  return {
    id: c.id ?? 0,
    blogId: c.blogId ?? 0,
    parentId: c.parentId ?? null,
    blogSlug: c.blogSlug ?? '',
    name: c.name ?? '',
    email: c.email ?? null,
    comment: c.comment ?? '',
    replies: Array.isArray(c.replies)
      ? c.replies.map(mapComment)
      : Array.isArray(c.reply)
      ? c.reply.map(mapComment)
      : [],
    is_published: !!c.is_published,
    createdAt: c.createdAt ?? new Date().toISOString(),
    updatedAt: c.updatedAt ?? new Date().toISOString(),
  };
}

export const comments = {
  getCounts: async (
    blogIds?: number[],
  ): Promise<{ blogId: number; count: number }[]> => {
    const url =
      blogIds && blogIds.length > 0
        ? `/comments/count?blogIds=${blogIds.join(',')}`
        : '/comments/count';

    const response = await apiClient.get<{ blogId: number; count: number }[]>(
      url,
    );
    return response.data;
  },

  getAll: async (params?: {
    blogId?: number;
    published?: boolean;
    page?: number;
    limit?: number;
  }): Promise<CommentApiResponse> => {
    const queryParams = new URLSearchParams();

    if (params?.blogId) queryParams.append('blogId', String(params.blogId));
    if (params?.published !== undefined)
      queryParams.append('published', String(params.published));
    if (params?.page) queryParams.append('page', String(params.page));
    if (params?.limit) queryParams.append('limit', String(params.limit));

    const url = `/comments${
      queryParams.toString() ? `?${queryParams.toString()}` : ''
    }`;
    const response = await apiClient.get<CommentApiResponse>(url);

    return {
      ...response.data,
      data: (response.data.data ?? []).map(mapComment),
    };
  },

  getById: async (id: number): Promise<ApiResponse<IComment>> => {
    const response = await apiClient.get<ApiResponse<IComment>>(
      `/comments/${id}`,
    );
    return {
      ...response.data,
      data: mapComment(response.data.data),
    };
  },

  /** Create a new comment */
  create: async (data: ICreateComment): Promise<ApiResponse<IComment>> => {
    const response = await apiClient.post<ApiResponse<IComment>>(
      '/comments',
      data,
      {
        headers: {
          'Content-Type': 'application/json',
        },
      },
    );
    return {
      ...response.data,
      data: mapComment(response.data.data),
    };
  },

  createWithFormData: async (
    data: ICreateComment,
  ): Promise<ApiResponse<IComment>> => {
    const formData = new FormData();
    formData.append('blogId', String(data.blogId));
    if (data.parentId) formData.append('parentId', String(data.parentId));
    formData.append('name', data.name);
    if (data.email) formData.append('email', data.email);
    formData.append('comment', data.comment);

    const response = await apiClient.post<ApiResponse<IComment>>(
      '/comments',
      formData,
    );
    return {
      ...response.data,
      data: mapComment(response.data.data),
    };
  },

  update: async (
    id: number,
    data: IUpdateComment,
  ): Promise<ApiResponse<IComment>> => {
    const response = await apiClient.patch<ApiResponse<IComment>>(
      `/comments/${id}`,
      data,
      {
        headers: {
          'Content-Type': 'application/json',
        },
      },
    );
    return {
      ...response.data,
      data: mapComment(response.data.data),
    };
  },

  togglePublish: async (
    id: number,
    is_published: boolean,
  ): Promise<ApiResponse<IComment>> => {
    const response = await apiClient.patch<ApiResponse<IComment>>(
      `/comments/${id}`,
      { is_published },
      {
        headers: {
          'Content-Type': 'application/json',
        },
      },
    );
    return {
      ...response.data,
      data: mapComment(response.data.data),
    };
  },

  /** Delete comment by ID */
  delete: async (id: number): Promise<void> => {
    await apiClient.delete(`/comments/${id}`);
  },
};
