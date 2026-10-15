import { createId } from "@/lib/utils";
import { removeStorage, writeStorage } from "@/lib/storage";
import type { LoginInput, RegisterInput, Session } from "@/types/auth";
import { ApiError, SESSION_KEY, db, delay, readSession } from "./mock/db";

const SESSION_TTL_MS = 8 * 60 * 60 * 1000;
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

function startSession(email: string, name: string): Session {
  const session: Session = {
    token: createId(),
    expiresAt: Date.now() + SESSION_TTL_MS,
    restaurantId: db.restaurant.get().id,
    user: { id: createId(), email, name },
  };
  writeStorage(SESSION_KEY, session);
  return session;
}

function validateCredentials({ email, password }: LoginInput) {
  if (!EMAIL_PATTERN.test(email)) throw new ApiError("Informe um e-mail válido.");
  if (password.length < 8) throw new ApiError("A senha deve ter pelo menos 8 caracteres.");
}

export async function login(input: LoginInput) {
  await delay(400);
  validateCredentials(input);
  const email = input.email.trim().toLowerCase();
  return startSession(email, email.split("@")[0]);
}

export async function register(input: RegisterInput) {
  await delay(500);
  validateCredentials(input);
  if (input.name.trim().split(/\s+/).length < 2) throw new ApiError("Informe nome e sobrenome.");
  return startSession(input.email.trim().toLowerCase(), input.name.trim());
}

export function getSession() {
  return readSession();
}

export function logout() {
  removeStorage(SESSION_KEY);
}
