// @vitest-environment jsdom
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { WEEKDAYS } from "@/types/restaurant";
import type { CreateOrderInput } from "@/types/order";
import { db } from "./mock/db";
import { SEED_RESTAURANT } from "./mock/seed";
import { createOrder } from "./order-service";

const SLUG = SEED_RESTAURANT.slug;

function settle<T>(promise: Promise<T>) {
  const settled = promise.then(
    (value) => ({ value, error: undefined }),
    (error: unknown) => ({ value: undefined, error }),
  );
  return vi.runAllTimersAsync().then(() => settled);
}

async function place(overrides: Partial<CreateOrderInput> = {}) {
  const { value, error } = await settle(createOrder(SLUG, { ...baseInput, ...overrides }));
  if (error) throw error;
  return value!;
}

const baseInput: CreateOrderInput = {
  fulfillment: "DELIVERY",
  customer: { name: " Ana Souza ", phone: "(11) 99999-8888" },
  address: {
    zoneId: "zone-a",
    cep: "01310-100",
    street: "Avenida Paulista",
    number: "1000",
    complement: "",
    reference: "",
  },
  paymentMethod: "CARD",
  changeFor: null,
  note: "",
  items: [
    { dishId: "dish-burger", variantId: "burger-double", quantity: 2, note: "" },
    { dishId: "dish-soda", variantId: "soda-can", quantity: 1, note: "" },
  ],
};

beforeEach(() => {
  vi.useFakeTimers();
  vi.setSystemTime(new Date(2026, 9, 20, 20));
  localStorage.clear();
  db.restaurant.set({ ...SEED_RESTAURANT, isOpen: true, pickupEnabled: true });
  db.hours.set(WEEKDAYS.map((weekday) => ({ weekday, isOpen: true, openingTime: "18:00", closingTime: "23:30" })));
  db.zones.set([{ id: "zone-a", name: "Centro", fee: 7.5 }]);
  db.orders.set([]);
  db.dishes.set([
    {
      id: "dish-burger",
      categoryId: "cat",
      name: "Burger",
      description: "",
      imageUrl: null,
      isAvailable: true,
      variants: [
        { id: "burger-single", label: "Simples", price: 29.9 },
        { id: "burger-double", label: "Duplo", price: 39.9 },
      ],
    },
    {
      id: "dish-soda",
      categoryId: "cat",
      name: "Refrigerante",
      description: "",
      imageUrl: null,
      isAvailable: true,
      variants: [{ id: "soda-can", label: "Lata", price: 6 }],
    },
  ]);
});

afterEach(() => {
  vi.useRealTimers();
});

describe("createOrder", () => {
  it("prices the order from the menu, not from the client", async () => {
    const order = await place();
    expect(order.items.map((item) => item.unitPrice)).toEqual([39.9, 6]);
    expect(order.subtotal).toBeCloseTo(85.8);
    expect(order.deliveryFee).toBe(7.5);
    expect(order.total).toBe(93.3);
    expect(order.status).toBe("PENDING");
    expect(order.customer).toEqual({ name: "Ana Souza", phone: "11999998888" });
    expect(db.orders.get()).toHaveLength(1);
  });

  it("charges no delivery fee and stores no address for pickup", async () => {
    const order = await place({ fulfillment: "PICKUP", address: null });
    expect(order.deliveryFee).toBe(0);
    expect(order.address).toBeNull();
  });

  it("numbers orders sequentially and uses a separate random tracking code", async () => {
    const first = await place();
    const second = await place();
    expect(second.id).toBe(first.id + 1);
    expect(second.trackingCode).not.toBe(first.trackingCode);
    expect(second.trackingCode).not.toContain(String(second.id));
  });

  it("rejects orders when the store switch is off", async () => {
    db.restaurant.set({ ...db.restaurant.get(), isOpen: false });
    await expect(place()).rejects.toThrow("fechado");
  });

  it("rejects orders outside business hours even with the store switch on", async () => {
    vi.setSystemTime(new Date(2026, 9, 20, 15));
    await expect(place()).rejects.toThrow("fechado");
    expect(db.orders.get()).toHaveLength(0);
  });

  it("accepts orders after midnight on a shift that crosses it", async () => {
    db.hours.set(WEEKDAYS.map((weekday) => ({ weekday, isOpen: true, openingTime: "18:00", closingTime: "02:00" })));
    vi.setSystemTime(new Date(2026, 9, 21, 1, 30));
    await expect(place()).resolves.toMatchObject({ status: "PENDING" });
  });

  it("rejects unavailable or removed dishes", async () => {
    db.dishes.set(db.dishes.get().map((dish) => (dish.id === "dish-soda" ? { ...dish, isAvailable: false } : dish)));
    await expect(place()).rejects.toThrow("indisponível");
    await expect(
      place({ items: [{ dishId: "dish-burger", variantId: "missing", quantity: 1, note: "" }] }),
    ).rejects.toThrow("não está mais no cardápio");
  });

  it("rejects invalid quantities", async () => {
    for (const quantity of [0, 1.5, 100]) {
      await expect(
        place({ items: [{ dishId: "dish-burger", variantId: "burger-single", quantity, note: "" }] }),
      ).rejects.toThrow("Quantidade inválida");
    }
  });

  it("rejects delivery to zones the store does not serve", async () => {
    await expect(place({ address: { ...baseInput.address!, zoneId: "elsewhere" } })).rejects.toThrow("bairro");
  });

  it("rejects pickup when the store does not offer it", async () => {
    db.restaurant.set({ ...db.restaurant.get(), pickupEnabled: false });
    await expect(place({ fulfillment: "PICKUP", address: null })).rejects.toThrow("retirada");
  });

  it("requires change for cash to cover the total", async () => {
    await expect(place({ paymentMethod: "CASH", changeFor: 50 })).rejects.toThrow("troco");
    await expect(place({ paymentMethod: "CASH", changeFor: 100 })).resolves.toMatchObject({ changeFor: 100 });
  });
});
