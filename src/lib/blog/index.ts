import {
  IBlog,
  ICreateBlog,
  IUpdateBlog,
  BlogApiResponse,
  ApiResponse,
} from 'lib/type';
import apiClient from 'lib/client';

async function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        resolve(reader.result);
      } else {
        reject(new Error('Failed to read file'));
      }
    };
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
}

/** Map backend response to IBlog */
function mapBlog(b: any): IBlog {
  return {
    id: b.id ?? 0,
    authorId: b.authorId ?? 0,
    authors: Array.isArray(b.authors) ? b.authors : [],
    title: b.title ?? '',
    description: b.description ?? '',
    content: b.content ?? '',
    image: b.image ?? '',
    tags: Array.isArray(b.tags) ? b.tags : [],
    meta: b.meta ?? { title: '', description: '', keywords: [] },
    slug: b.slug ?? '',
    createdAt: b.createdAt ?? new Date().toISOString(),
    updatedAt: b.updatedAt ?? new Date().toISOString(),
    createdBy:
      typeof b.createdBy === 'string'
        ? { name: b.createdBy }
        : b.createdBy?.name
        ? b.createdBy
        : { name: '—' },
    updatedBy:
      typeof b.updatedBy === 'string'
        ? { name: b.updatedBy }
        : b.updatedBy?.name
        ? b.updatedBy
        : { name: '—' },
    is_published: !!b.is_published,
    status: b.is_published ? 'Published' : 'Draft',
  };
}

/** Get base URL for API calls - works on both server and client */
function getBaseURL(): string {
  if (typeof window === 'undefined') {
    return (
      process.env.API_URL ||
      process.env.NEXT_PUBLIC_API_URL ||
      'http://localhost:3000/api'
    );
  }
  return process.env.NEXT_PUBLIC_API_URL || '/api';
}

/** Fetch wrapper that works on both server and client */
async function apiFetch<T>(
  endpoint: string,
  options?: RequestInit,
): Promise<T> {
  const baseURL = getBaseURL();
  const url = `${baseURL}${endpoint}`;

  const response = await fetch(url, {
    ...options,
    headers: {
      ...options?.headers,
    },
    // Important for server-side: disable caching for dynamic data
    cache: typeof window === 'undefined' ? 'no-store' : 'default',
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error(`❌ API Error [${response.status}]:`, errorText);
    throw new Error(`API Error: ${response.status} - ${errorText}`);
  }

  return response.json();
}

export const blog = {
  /** Fetch blogs with pagination */
  getAll: async (
    page = 1,
    limit = 10,
    p0: boolean,
  ): Promise<BlogApiResponse> => {
    try {
      const response = await apiFetch<BlogApiResponse>(
        `/blog?page=${page}&limit=${limit}${p0 ? '&published=true' : ''}`,
      );
      return {
        ...response,
        data: (response.data ?? []).map(mapBlog),
      };
    } catch (error) {
      console.error('Error in blog.getAll:', error);
      throw error;
    }
  },

  /** Fetch blog by ID */
  getById: async (id: number): Promise<ApiResponse<IBlog>> => {
    try {
      const response = await apiFetch<ApiResponse<IBlog>>(`/blog/id/${id}`);
      return {
        ...response,
        data: mapBlog(response.data),
      };
    } catch (error) {
      console.error('Error in blog.getById:', error);
      throw error;
    }
  },

  /** Fetch blog by slug - NOW WORKS SERVER-SIDE! */
  getBySlug: async (slug: string): Promise<ApiResponse<IBlog>> => {
    if (!slug) {
      console.error('❌ No slug provided');
      throw new Error('Slug is required');
    }

    const cleanSlug = encodeURIComponent(slug.trim());

    try {
      const response = await apiFetch<ApiResponse<IBlog>>(`/blog/${cleanSlug}`);
      return {
        ...response,
        data: mapBlog(response.data),
      };
    } catch (error) {
      console.error('❌ Error in blog.getBySlug:', error);
      throw error;
    }
  },

  /** Create a new blog - Client-side only (uses FormData) */
  create: async (data: ICreateBlog): Promise<ApiResponse<IBlog>> => {
    const formData = new FormData();
    formData.append('title', data.title);
    formData.append('description', data.description);
    formData.append('content', data.content);

    if (data.authorIds?.length) {
      data.authorIds.forEach((id) => formData.append('authorId', String(id)));
    } else if (data.authorId) {
      formData.append('authorId', String(data.authorId));
    }

    if (data.image instanceof File) formData.append('image', data.image);
    if (data.tags) formData.append('tags', JSON.stringify(data.tags));
    if (data.meta) formData.append('meta', JSON.stringify(data.meta));

    const response = await apiClient.post<ApiResponse<IBlog>>(
      '/blog',
      formData,
      {
        headers: { 'Content-Type': 'multipart/form-data' },
      },
    );

    return {
      ...response.data,
      data: mapBlog(response.data.data),
    };
  },

  /** Update a blog by ID - Client-side only (uses FormData) */
  update: async (
    id: number,
    data: IUpdateBlog,
  ): Promise<ApiResponse<IBlog>> => {
    const formData = new FormData();
    if (data.title) formData.append('title', data.title);
    if (data.description) formData.append('description', data.description);
    if (data.content) formData.append('content', data.content);

    if (data.authorIds?.length) {
      data.authorIds.forEach((id) => formData.append('authorId', String(id)));
    } else if (data.authorId) {
      formData.append('authorId', String(data.authorId));
    }

    if (data.image instanceof File) formData.append('image', data.image);
    else if (
      typeof data.image === 'string' &&
      data.image.startsWith('data:image/')
    ) {
      formData.append('existingImage', data.image);
    } else if (!data.image) {
      formData.append('removeImage', 'true');
    }

    if (data.tags) formData.append('tags', JSON.stringify(data.tags));
    if (data.meta) formData.append('meta', JSON.stringify(data.meta));

    const response = await apiClient.put<ApiResponse<IBlog>>(
      `/blog/id/${id}`,
      formData,
      {
        headers: { 'Content-Type': 'multipart/form-data' },
      },
    );

    return {
      ...response.data,
      data: mapBlog(response.data.data),
    };
  },

  /** Publish / Unpublish */
  publish: async (
    id: number,
    isPublished: boolean,
  ): Promise<ApiResponse<IBlog>> => {
    const response = await apiClient.patch<ApiResponse<IBlog>>(
      `/blog/id/${id}`,
      { isPublished },
    );
    return {
      ...response.data,
      data: mapBlog(response.data.data),
    };
  },

  /** Delete a blog */
  delete: async (id: number): Promise<void> => {
    await apiClient.delete(`/blog/id/${id}`);
  },
};

export { fileToBase64 };
