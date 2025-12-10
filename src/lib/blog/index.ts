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

/**
 * Map backend response to IBlog
 */
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
        : b.createdBy && b.createdBy.name
        ? b.createdBy
        : { name: '—' },
    updatedBy:
      typeof b.updatedBy === 'string'
        ? { name: b.updatedBy }
        : b.updatedBy && b.updatedBy.name
        ? b.updatedBy
        : { name: '—' },
    is_published: !!b.is_published,
    status: b.is_published ? 'Published' : 'Draft',
  };
}

export const blog = {
  /** Fetch blogs with pagination */
  getAll: async (page = 1, limit = 10): Promise<BlogApiResponse> => {
    const response = await apiClient.get<BlogApiResponse>(
      `/blog?page=${page}&limit=${limit}`,
    );
    return {
      ...response.data,
      data: (response.data.data ?? []).map(mapBlog),
    };
  },

  /** Fetch blog by ID */
  getById: async (id: number): Promise<ApiResponse<IBlog>> => {
    const response = await apiClient.get<ApiResponse<IBlog>>(`/blog/id/${id}`);
    return {
      ...response.data,
      data: mapBlog(response.data.data),
    };
  },

  /** Fetch blog by slug */
  getBySlug: async (slug: string): Promise<ApiResponse<IBlog>> => {
    const response = await apiClient.get<ApiResponse<IBlog>>(`/blog/${slug}`);
    return {
      ...response.data,
      data: mapBlog(response.data.data),
    };
  },

  /** Create a new blog */
  create: async (data: ICreateBlog): Promise<ApiResponse<IBlog>> => {
    const formData = new FormData();
    formData.append('title', data.title);
    formData.append('description', data.description);
    formData.append('content', data.content);
    if (data.authorIds && data.authorIds.length > 0) {
      data.authorIds.forEach((id) => formData.append('authorId', String(id)));
    } else if (data.authorId) {
      // Fallback to single authorId if authorIds not provided
      formData.append('authorId', String(data.authorId));
    }
    if (data.image instanceof File) {
      formData.append('image', data.image);
    }
    if (data.tags) {
      formData.append('tags', JSON.stringify(data.tags));
    }
    if (data.meta) {
      formData.append('meta', JSON.stringify(data.meta));
    }

    const response = await apiClient.post<ApiResponse<IBlog>>(
      '/blog',
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      },
    );

    return {
      ...response.data,
      data: mapBlog(response.data.data),
    };
  },

  /** Update a blog by ID */
  update: async (
    id: number,
    data: IUpdateBlog,
  ): Promise<ApiResponse<IBlog>> => {
    const formData = new FormData();

    // Add fields only if they exist
    if (data.title) formData.append('title', data.title);
    if (data.description) formData.append('description', data.description);
    if (data.content) formData.append('content', data.content);
    if (data.authorIds && data.authorIds.length > 0) {
      data.authorIds.forEach((id) => formData.append('authorId', String(id)));
    } else if (data.authorId) {
      formData.append('authorId', String(data.authorId));
    }
    if (data.image instanceof File) {
      formData.append('image', data.image);
    } else if (
      typeof data.image === 'string' &&
      data.image.startsWith('data:image/')
    ) {
      formData.append('existingImage', data.image);
    } else if (data.image === null || data.image === '') {
      formData.append('removeImage', 'true');
    }

    if (data.tags) {
      formData.append('tags', JSON.stringify(data.tags));
    }
    if (data.meta) {
      formData.append('meta', JSON.stringify(data.meta));
    }

    const response = await apiClient.put<ApiResponse<IBlog>>(
      `/blog/id/${id}`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      },
    );

    return {
      ...response.data,
      data: mapBlog(response.data.data),
    };
  },
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

  /** Delete a blog by ID */
  delete: async (id: number): Promise<void> => {
    await apiClient.delete(`/blog/id/${id}`);
  },
};

export { fileToBase64 };
