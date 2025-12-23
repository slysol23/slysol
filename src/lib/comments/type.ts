export interface IComment {
  id: number;
  blogId: number;
  parentId: number | null;
  name: string;
  email?: string | null;
  comment: string;
  blogSlug: string;
  replies: IComment[];
  is_published: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ICreateComment {
  blogId: number;
  parentId?: number | null;
  name: string;
  email?: string | null;
  comment: string;
}

export interface IUpdateComment {
  name?: string;
  email?: string | null;
  comment?: string;
  is_published?: boolean;
}

export interface ApiResponse<T> {
  data: T;
  message?: string;
  total?: number;
  page?: number;
  limit?: number;
}

export interface CommentApiResponse {
  data: IComment[];
  message?: string;
  total?: number;
  page?: number;
  limit?: number;
}
