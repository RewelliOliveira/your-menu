import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function createId() {
  return crypto.randomUUID();
}

export function getErrorMessage(error: unknown, fallback = "Algo deu errado. Tente novamente.") {
  return error instanceof Error && error.message ? error.message : fallback;
}
