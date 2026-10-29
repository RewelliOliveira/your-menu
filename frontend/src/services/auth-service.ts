import type { LoginInput, RegisterInput, Session } from "@/types/auth";
import { http } from "./http-client";
import { clearSession, readSession, saveSession } from "./session-storage";

async function startSession(request: Promise<Session>) {
  const session = await request;
  saveSession(session);
  return session;
}

export function login(input: LoginInput) {
  return startSession(http.post<Session>("/auth/login", input));
}

export function register(input: RegisterInput) {
  return startSession(http.post<Session>("/auth/register", input));
}

export function getSession() {
  return readSession();
}

export function logout() {
  clearSession();
}
