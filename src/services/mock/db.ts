import { isArray, isObject, readStorage, writeStorage } from "@/lib/storage";
import type { Session } from "@/types/auth";
import type { Transaction } from "@/types/finance";
import type { Order } from "@/types/order";
import { ApiError } from "../api-error";
import {
  SEED_ADDRESS,
  SEED_CATEGORIES,
  SEED_DISHES,
  SEED_HOURS,
  SEED_RESTAURANT,
  SEED_ZONES,
} from "./seed";
import { createSeedHistory } from "./seed-history";

export { ApiError };

function table<T>(
  key: string,
  seed: () => T,
  isValid: (value: unknown) => value is T,
) {
  let memory: T | null = null;
  return {
    get(): T {
      const value = readStorage(key, isValid) ?? memory ?? seed();
      return structuredClone(value);
    },
    set(value: T) {
      memory = structuredClone(value);
      writeStorage(key, value);
    },
  };
}

const anArray = <T>(value: unknown): value is T[] => isArray(value);
const anObject = <T>(value: unknown): value is T => isObject(value);

let history: ReturnType<typeof createSeedHistory> | null = null;
const seedHistory = () => (history ??= createSeedHistory());

export const db = {
  restaurant: table(
    "restaurant",
    () => SEED_RESTAURANT,
    anObject<typeof SEED_RESTAURANT>,
  ),
  hours: table("hours", () => SEED_HOURS, anArray<(typeof SEED_HOURS)[number]>),
  address: table("address", () => SEED_ADDRESS, anObject<typeof SEED_ADDRESS>),
  zones: table("zones", () => SEED_ZONES, anArray<(typeof SEED_ZONES)[number]>),
  categories: table(
    "categories",
    () => SEED_CATEGORIES,
    anArray<(typeof SEED_CATEGORIES)[number]>,
  ),
  dishes: table(
    "dishes",
    () => SEED_DISHES,
    anArray<(typeof SEED_DISHES)[number]>,
  ),
  orders: table("orders", () => seedHistory().orders, anArray<Order>),
  transactions: table(
    "transactions",
    () => seedHistory().transactions,
    anArray<Transaction>,
  ),
};

export const SESSION_KEY = "session";

const isSession = (value: unknown): value is Session =>
  isObject(value) &&
  typeof value.token === "string" &&
  typeof value.expiresAt === "number";

export function readSession() {
  const session = readStorage(SESSION_KEY, isSession);
  return session && session.expiresAt > Date.now() ? session : null;
}

export function requireAuth() {
  const session = readSession();
  if (!session) throw new ApiError("Sua sessão expirou. Entre novamente.", 401);
  return session;
}

export function requireRestaurant(slug: string) {
  const restaurant = db.restaurant.get();
  if (restaurant.slug !== slug)
    throw new ApiError("Restaurante não encontrado.", 404);
  return restaurant;
}

export function delay(ms = 250) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

try {
  Object.keys(localStorage)
    .filter(
      (key) =>
        key.startsWith("your_menu_mock_") ||
        key.startsWith("yourmenu:v2:") ||
        ["token", "restaurantId", "restaurantSlug"].includes(key),
    )
    .forEach((key) => localStorage.removeItem(key));
} catch {
  void 0;
}
