/**
 * Instância da API (atualmente desativada para uso de dados mockados).
 * Quando a nova API for implementada futuramente, configure o baseURL e os interceptors aqui.
 */

export const API_BASE_URL = "http://localhost:8080";

export const api = {
  get: async <T = unknown>(url: string): Promise<{ data: T }> => {
    console.warn(`[API MOCK] Requisição GET para '${url}' interceptada.`);
    return { data: {} as T };
  },
  post: async <T = unknown>(url: string, data?: unknown): Promise<{ data: T }> => {
    console.warn(`[API MOCK] Requisição POST para '${url}' interceptada.`, data);
    return { data: {} as T };
  },
  put: async <T = unknown>(url: string, data?: unknown): Promise<{ data: T }> => {
    console.warn(`[API MOCK] Requisição PUT para '${url}' interceptada.`, data);
    return { data: {} as T };
  },
  patch: async <T = unknown>(url: string, data?: unknown): Promise<{ data: T }> => {
    console.warn(`[API MOCK] Requisição PATCH para '${url}' interceptada.`, data);
    return { data: {} as T };
  },
  delete: async <T = unknown>(url: string): Promise<{ data: T }> => {
    console.warn(`[API MOCK] Requisição DELETE para '${url}' interceptada.`);
    return { data: {} as T };
  },
};
