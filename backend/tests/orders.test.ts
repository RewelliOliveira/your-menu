import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { WEEKDAYS } from "../src/domain/business-hours";
import type { CreateOrderInput, Order } from "../src/types/order";
import { api, createAccount } from "./helpers";

type Store = Awaited<ReturnType<typeof setupStore>>;

const openWeek = (closingTime = "23:30") =>
  WEEKDAYS.map((weekday) => ({ weekday, isOpen: true, openingTime: "18:00", closingTime }));

async function setupStore() {
  const account = await createAccount();
  const { auth } = account;
  await api().put("/api/restaurant/hours").set(auth).send(openWeek()).expect(200);
  await api().patch("/api/restaurant/status").set(auth).send({ isOpen: true, pickupEnabled: true }).expect(200);
  const { body: zone } = await api().post("/api/delivery-zones").set(auth).send({ name: "Centro", fee: 7.5 }).expect(201);
  const { body: category } = await api().post("/api/categories").set(auth).send({ name: "Lanches" }).expect(201);
  const dish = (name: string, variants: Array<{ label: string; price: number }>) =>
    api()
      .post("/api/dishes")
      .set(auth)
      .send({ categoryId: category.id, name, description: "", imageUrl: null, isAvailable: true, variants })
      .expect(201)
      .then((response) => response.body);
  const burger = await dish("Burger", [
    { label: "Simples", price: 29.9 },
    { label: "Duplo", price: 39.9 },
  ]);
  const soda = await dish("Refrigerante", [{ label: "Lata", price: 6 }]);
  return { ...account, zone, burger, soda };
}

function baseInput(store: Store): CreateOrderInput {
  return {
    fulfillment: "DELIVERY",
    customer: { name: " Ana Souza ", phone: "(11) 99999-8888" },
    address: { zoneId: store.zone.id, cep: "01310-100", street: "Avenida Paulista", number: "1000", complement: "", reference: "" },
    paymentMethod: "CARD",
    changeFor: null,
    note: "",
    items: [
      { dishId: store.burger.id, variantId: store.burger.variants[1].id, quantity: 2, note: "" },
      { dishId: store.soda.id, variantId: store.soda.variants[0].id, quantity: 1, note: "" },
    ],
  };
}

function place(store: Store, overrides: Partial<CreateOrderInput> = {}) {
  return api()
    .post(`/api/storefronts/${store.slug}/orders`)
    .send({ ...baseInput(store), ...overrides });
}

let store: Store;

beforeEach(async () => {
  vi.useFakeTimers({ toFake: ["Date"] });
  vi.setSystemTime(new Date(2026, 9, 20, 20));
  store = await setupStore();
});

afterEach(() => {
  vi.useRealTimers();
});

describe("POST /storefronts/:slug/orders", () => {
  it("prices the order from the menu, not from the client", async () => {
    const { body: order } = await place(store).expect(201);
    expect(order.items.map((item: Order["items"][number]) => item.unitPrice)).toEqual([39.9, 6]);
    expect(order.subtotal).toBeCloseTo(85.8);
    expect(order.deliveryFee).toBe(7.5);
    expect(order.total).toBe(93.3);
    expect(order.status).toBe("PENDING");
    expect(order.customer).toEqual({ name: "Ana Souza", phone: "11999998888" });

    const { body: tracked } = await api().get(`/api/storefronts/${store.slug}/orders/${order.trackingCode}`).expect(200);
    expect(tracked.id).toBe(order.id);
  });

  it("charges no delivery fee and stores no address for pickup", async () => {
    const { body: order } = await place(store, { fulfillment: "PICKUP", address: null }).expect(201);
    expect(order.deliveryFee).toBe(0);
    expect(order.address).toBeNull();
  });

  it("numbers orders sequentially per restaurant with a random tracking code", async () => {
    const { body: first } = await place(store).expect(201);
    const { body: second } = await place(store).expect(201);
    expect(first.id).toBe(101);
    expect(second.id).toBe(first.id + 1);
    expect(second.trackingCode).not.toBe(first.trackingCode);
  });

  it("rejects orders when the store switch is off", async () => {
    await api().patch("/api/restaurant/status").set(store.auth).send({ isOpen: false }).expect(200);
    const { body } = await place(store).expect(400);
    expect(body.message).toContain("fechado");
  });

  it("rejects orders outside business hours even with the store switch on", async () => {
    vi.setSystemTime(new Date(2026, 9, 20, 15));
    await place(store).expect(400);
    const { body: orders } = await api().get("/api/orders").set(store.auth).expect(200);
    expect(orders).toHaveLength(0);
  });

  it("accepts orders after midnight on a shift that crosses it", async () => {
    await api().put("/api/restaurant/hours").set(store.auth).send(openWeek("02:00")).expect(200);
    vi.setSystemTime(new Date(2026, 9, 21, 1, 30));
    await place(store).expect(201);
  });

  it("rejects unavailable or removed dishes", async () => {
    await api().patch(`/api/dishes/${store.soda.id}/availability`).set(store.auth).send({ isAvailable: false }).expect(204);
    expect((await place(store).expect(400)).body.message).toContain("indisponível");

    const items = [{ dishId: store.burger.id, variantId: "missing", quantity: 1, note: "" }];
    expect((await place(store, { items }).expect(400)).body.message).toContain("não está mais no cardápio");
  });

  it("rejects invalid quantities", async () => {
    for (const quantity of [0, 1.5, 100]) {
      const items = [{ dishId: store.burger.id, variantId: store.burger.variants[0].id, quantity, note: "" }];
      expect((await place(store, { items }).expect(400)).body.message).toBe("Quantidade inválida.");
    }
  });

  it("rejects delivery to zones the store does not serve", async () => {
    const address = { ...baseInput(store).address!, zoneId: "elsewhere" };
    expect((await place(store, { address }).expect(400)).body.message).toContain("bairro");
  });

  it("rejects pickup when the store does not offer it", async () => {
    await api().patch("/api/restaurant/status").set(store.auth).send({ pickupEnabled: false }).expect(200);
    expect((await place(store, { fulfillment: "PICKUP", address: null }).expect(400)).body.message).toContain("retirada");
  });

  it("requires change for cash to cover the total", async () => {
    expect((await place(store, { paymentMethod: "CASH", changeFor: 50 }).expect(400)).body.message).toContain("troco");
    const { body: order } = await place(store, { paymentMethod: "CASH", changeFor: 100 }).expect(201);
    expect(order.changeFor).toBe(100);
  });
});

describe("admin orders", () => {
  it("lists recent orders and moves them through the allowed statuses", async () => {
    const { body: order } = await place(store).expect(201);

    const { body: orders } = await api().get("/api/orders").set(store.auth).expect(200);
    expect(orders.map((o: Order) => o.id)).toEqual([order.id]);

    await api().patch(`/api/orders/${order.id}/status`).set(store.auth).send({ status: "DELIVERED" }).expect(400);
    const { body: confirmed } = await api()
      .patch(`/api/orders/${order.id}/status`)
      .set(store.auth)
      .send({ status: "CONFIRMED" })
      .expect(200);
    expect(confirmed.status).toBe("CONFIRMED");
  });
});
