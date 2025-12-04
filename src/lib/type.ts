export interface ApiResponse<T> {
  data?: T;
  message?: string;
  error?: string;
  count: number;
  success: boolean;
}

export * from './auth/type';
export * from './blog/type';
export * from './author/type';
export * from './comments/type';
