import { isObject, readStorage, removeStorage, writeStorage } from "@/lib/storage";
import type { Session } from "@/types/auth";

const SESSION_KEY = "session";

export const SESSION_EXPIRED_EVENT = "yourmenu:session-expired";

const isSession = (value: unknown): value is Session =>
  isObject(value) && typeof value.token === "string" && typeof value.expiresAt === "number";

export function readSession() {
  const session = readStorage(SESSION_KEY, isSession);
  return session && session.expiresAt > Date.now() ? session : null;
}

export function saveSession(session: Session) {
  writeStorage(SESSION_KEY, session);
}

export function clearSession() {
  removeStorage(SESSION_KEY);
}

export function expireSession() {
  clearSession();
  window.dispatchEvent(new Event(SESSION_EXPIRED_EVENT));
}
