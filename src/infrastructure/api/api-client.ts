export const API_BASE_URL = "http://localhost:8080";

export interface ApiResponse<T> {
  data: T;
}

export const apiClient = {
  get: async <T>(_url: string): Promise<ApiResponse<T>> => {
    return { data: {} as T };
  },
  post: async <T>(_url: string, data?: unknown): Promise<ApiResponse<T>> => {
    return { data: data as T };
  },
  put: async <T>(_url: string, data?: unknown): Promise<ApiResponse<T>> => {
    return { data: data as T };
  },
  patch: async <T>(_url: string, data?: unknown): Promise<ApiResponse<T>> => {
    return { data: data as T };
  },
  delete: async <T>(_url: string): Promise<ApiResponse<T>> => {
    return { data: {} as T };
  },
};
