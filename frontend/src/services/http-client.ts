import { env } from "@/config/env";
import { ApiError } from "./api-error";
import { expireSession, readSession } from "./session-storage";

type Method = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

interface RequestOptions {
  body?: unknown;
  query?: Record<string, string>;
}

const NETWORK_ERROR = "Não foi possível conectar ao servidor. Verifique sua internet e tente novamente.";

function buildUrl(path: string, query?: Record<string, string>) {
  const url = `${env.apiUrl}${path}`;
  return query ? `${url}?${new URLSearchParams(query)}` : url;
}

async function parseBody(response: Response) {
  if (response.status === 204) return undefined;
  const text = await response.text();
  return text ? JSON.parse(text) : undefined;
}

async function request<T>(method: Method, path: string, { body, query }: RequestOptions = {}): Promise<T> {
  const session = readSession();
  const headers = new Headers({ Accept: "application/json" });
  if (session) headers.set("Authorization", `Bearer ${session.token}`);

  const isForm = body instanceof FormData;
  if (body !== undefined && !isForm) headers.set("Content-Type", "application/json");

  let response: Response;
  try {
    response = await fetch(buildUrl(path, query), {
      method,
      headers,
      body: body === undefined ? undefined : isForm ? body : JSON.stringify(body),
    });
  } catch {
    throw new ApiError(NETWORK_ERROR, 0);
  }

  const data = await parseBody(response).catch(() => undefined);
  if (response.ok) return data as T;

  if (response.status === 401 && session) expireSession();
  throw new ApiError(data?.message ?? "Algo deu errado. Tente novamente.", response.status);
}

export const http = {
  get: <T>(path: string, query?: Record<string, string>) => request<T>("GET", path, { query }),
  post: <T>(path: string, body?: unknown) => request<T>("POST", path, { body }),
  put: <T>(path: string, body?: unknown) => request<T>("PUT", path, { body }),
  patch: <T>(path: string, body?: unknown) => request<T>("PATCH", path, { body }),
  delete: (path: string) => request<void>("DELETE", path),
};
