import { readStorage, writeStorage } from "@/lib/storage";
import { createId } from "@/lib/utils";
import type { Order, PaymentMethod } from "@/types/order";
import { db } from "./db";
import { seedAddress } from "./seed";
import { FIRST_NAMES, LAST_NAMES } from "./seed-history";

const NEXT_ORDER_KEY = "demo-next-order-at";
const MIN_INTERVAL_MS = 70_000;
const MAX_INTERVAL_MS = 160_000;
const MAX_PENDING = 3;

const NOTES = [
  "",
  "",
  "",
  "Sem cebola, por favor.",
  "Capricha no molho!",
  "Interfone com defeito, me liga quando chegar.",
  "Ponto da carne mal passado.",
];

const isNumber = (value: unknown): value is number => typeof value === "number";
const pick = <T>(list: readonly T[]) => list[Math.floor(Math.random() * list.length)];
const round = (value: number) => Math.round(value * 100) / 100;

function scheduleNext(now: number) {
  writeStorage(NEXT_ORDER_KEY, now + MIN_INTERVAL_MS + Math.random() * (MAX_INTERVAL_MS - MIN_INTERVAL_MS));
}

function buildOrder(id: number, now: number): Order | null {
  const restaurant = db.restaurant.get();
  const dishes = db.dishes.get().filter((dish) => dish.isAvailable && dish.variants.length > 0);
  const zones = db.zones.get();
  const delivery = zones.length > 0 && (!restaurant.pickupEnabled || Math.random() < 0.75);
  if (!dishes.length || (!delivery && !restaurant.pickupEnabled)) return null;

  const chosen = [...dishes].sort(() => Math.random() - 0.5).slice(0, 1 + Math.floor(Math.random() * 3));
  const items = chosen.map((dish) => {
    const variant = pick(dish.variants);
    return {
      dishId: dish.id,
      variantId: variant.id,
      dishName: dish.name,
      variantLabel: variant.label,
      imageUrl: dish.imageUrl,
      unitPrice: variant.price,
      quantity: Math.random() < 0.25 ? 2 : 1,
      note: "",
    };
  });

  const zone = delivery ? pick(zones) : null;
  const subtotal = round(items.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0));
  const deliveryFee = zone?.fee ?? 0;
  const methods: PaymentMethod[] = restaurant.pixKey ? ["PIX", "PIX", "CARD", "CASH"] : ["CARD", "CASH"];

  return {
    id,
    trackingCode: createId(),
    restaurantId: restaurant.id,
    createdAt: new Date(now).toISOString(),
    status: "PENDING",
    fulfillment: zone ? "DELIVERY" : "PICKUP",
    customer: {
      name: `${pick(FIRST_NAMES)} ${pick(LAST_NAMES)}`,
      phone: `119${Math.floor(10_000_000 + Math.random() * 89_999_999)}`,
    },
    address: zone ? seedAddress(zone, id) : null,
    paymentMethod: pick(methods),
    changeFor: null,
    note: pick(NOTES),
    items,
    subtotal,
    deliveryFee,
    total: round(subtotal + deliveryFee),
  };
}

export function receiveSimulatedOrders(now = Date.now()) {
  const nextAt = readStorage(NEXT_ORDER_KEY, isNumber);
  if (nextAt === null || nextAt > now + MAX_INTERVAL_MS) return scheduleNext(now);
  if (now < nextAt) return;
  scheduleNext(now);

  const orders = db.orders.get();
  if (!db.restaurant.get().isOpen) return;
  if (orders.filter((order) => order.status === "PENDING").length >= MAX_PENDING) return;

  const order = buildOrder(
    orders.reduce((max, o) => Math.max(max, o.id), 100) + 1,
    now,
  );
  if (order) db.orders.set([order, ...orders]);
}
