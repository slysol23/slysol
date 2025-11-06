export interface ApiResponse<T> {
  data?: T;
  message?: string;
  error?: string;
  count: number;
}

export * from './auth/type';
export * from './blog/type';
