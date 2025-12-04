export interface IBlog {
  id: number;
  title: string;
  slug: string;
  description: string;
  content: string;
  image?: string | null;
  tags?: string[];
  meta?: any;
  authorId: number;
  authors: {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
  }[];
  is_published: boolean;
  createdAt: string | Date;
  updatedAt: string | Date;
  createdBy?: string | { name: string };
  updatedBy?: string | { name: string };
  status?: string;
}
export interface IAuthor {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  createdAt: string;
  updatedAt: string;
}

export interface ICreateBlog {
  title: string;
  description: string;
  content: string;
  authorId: number; // Primary author
  authorIds: number[]; // multiple authors
  image?: File | string;
  tags?: string[];
  meta?: any;
  createdBy?: { name: string };
  updatedBy?: { name: string };
}

export interface IUpdateBlog {
  title?: string;
  description?: string;
  content?: string;
  authorId?: number;
  authorIds?: number[];
  image?: File | string;
  tags?: string[];
  meta?: any;
  updatedBy?: { name: string };
  is_published?: boolean;
}
export interface BlogApiResponse {
  message: string;
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  data: IBlog[];
}
