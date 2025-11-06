export interface IAuthor {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  createdAt: string;
  updatedAt: string;
}

export interface IBlog {
  id: number;
  title: string;
  description?: string;
  content: string;
  image?: string;
  authorId: number;
  author?: IAuthor;
  createdAt: string;
  updatedAt: string;
}

export interface ICreateBlog {
  title: string;
  description?: string;
  content: string;
  image?: string;
  authorId: number;
}

export interface IUpdateBlog {
  title?: string;
  description?: string;
  content?: string;
  image?: string;
}
