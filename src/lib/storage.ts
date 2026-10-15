const PREFIX = "yourmenu:v3:";

export function readStorage<T>(key: string, isValid: (value: unknown) => value is T): T | null {
  try {
    const raw = localStorage.getItem(PREFIX + key);
    if (!raw) return null;
    const parsed: unknown = JSON.parse(raw);
    return isValid(parsed) ? parsed : null;
  } catch {
    return null;
  }
}

export function writeStorage(key: string, value: unknown) {
  try {
    localStorage.setItem(PREFIX + key, JSON.stringify(value));
  } catch {
    void 0;
  }
}

export function removeStorage(key: string) {
  try {
    localStorage.removeItem(PREFIX + key);
  } catch {
    void 0;
  }
}

export const isArray = (value: unknown): value is unknown[] => Array.isArray(value);

export const isObject = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);
