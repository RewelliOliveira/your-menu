import type { TransactionType } from "../../domain/finance";
import { roundMoney as round } from "../../domain/money";
import { toDateKey } from "../../domain/month";
import type { Transaction } from "../../types/finance";
import type { Order, OrderItem, PaymentMethod } from "../../types/order";
import { createId } from "../../utils/id";
import { DEMO_DISHES, DEMO_RESTAURANT, DEMO_STREETS, DEMO_ZONES, FIRST_NAMES, LAST_NAMES } from "./demo-catalog";
import { createRecentOrders } from "./demo-recent-orders";

const HISTORY_DAYS = 185;
const WEEKDAY_VOLUME = [16, 0, 9, 10, 12, 19, 22];
const HOUR_WEIGHTS: Array<[number, number]> = [
  [18, 6],
  [19, 14],
  [20, 22],
  [21, 20],
  [22, 12],
  [23, 5],
];
const PAYMENT_WEIGHTS: Array<[PaymentMethod, number]> = [
  ["PIX", 50],
  ["CARD", 36],
  ["CASH", 14],
];

function mulberry32(seed: number) {
  let state = seed;
  return () => {
    state = (state + 0x6d2b79f5) | 0;
    let t = Math.imul(state ^ (state >>> 15), 1 | state);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function createDemoHistory(): { orders: Order[]; transactions: Transaction[] } {
  const random = mulberry32(20261015);
  const between = (min: number, max: number) => min + random() * (max - min);
  const pick = <T>(list: readonly T[]) => list[Math.floor(random() * list.length)];
  const weighted = <T>(entries: Array<[T, number]>) => {
    let target = random() * entries.reduce((sum, [, weight]) => sum + weight, 0);
    for (const [value, weight] of entries) {
      target -= weight;
      if (target <= 0) return value;
    }
    return entries[entries.length - 1][0];
  };

  const dishesByCategory = (categoryId: string) => DEMO_DISHES.filter((dish) => dish.categoryId === categoryId);
  const mains = [...dishesByCategory("cat-burgers"), ...dishesByCategory("cat-pizzas")];

  function buildItems(): OrderItem[] {
    const picks = [pick(mains)];
    if (random() < 0.4) picks.push(pick(dishesByCategory("cat-sides")));
    if (random() < 0.6) picks.push(pick(dishesByCategory("cat-drinks")));
    if (random() < 0.2) picks.push(pick(dishesByCategory("cat-desserts")));
    return picks.map((dish) => {
      const variant = pick(dish.variants);
      return {
        dishId: dish.id,
        variantId: variant.id,
        dishName: dish.name,
        variantLabel: variant.label,
        imageUrl: null,
        unitPrice: variant.price,
        quantity: random() < 0.25 ? 2 : 1,
        note: "",
      };
    });
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const orders: Order[] = [];
  const dailySales = new Map<string, number>();
  const cancelled: Order[] = [];
  let nextId = 1;

  for (let offset = HISTORY_DAYS; offset >= 1; offset--) {
    const day = new Date(today);
    day.setDate(today.getDate() - offset);
    const volume = WEEKDAY_VOLUME[day.getDay()];
    if (!volume) continue;

    const growth = 0.85 + 0.3 * (1 - offset / HISTORY_DAYS);
    const count = Math.round(volume * growth * between(0.75, 1.25));

    for (let i = 0; i < count; i++) {
      const createdAt = new Date(day);
      createdAt.setHours(weighted(HOUR_WEIGHTS), Math.floor(random() * 60));
      const items = buildItems();
      const zone = random() < 0.8 ? pick(DEMO_ZONES) : null;
      const subtotal = round(items.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0));
      const deliveryFee = zone?.fee ?? 0;
      const order: Order = {
        id: nextId++,
        trackingCode: createId(),
        restaurantId: DEMO_RESTAURANT.id,
        createdAt: createdAt.toISOString(),
        status: random() < 0.06 ? "CANCELLED" : "DELIVERED",
        fulfillment: zone ? "DELIVERY" : "PICKUP",
        customer: {
          name: `${pick(FIRST_NAMES)} ${pick(LAST_NAMES)}`,
          phone: `119${Math.floor(between(10_000_000, 99_999_999))}`,
        },
        address: zone
          ? {
              zoneId: zone.id,
              zoneName: zone.name,
              cep: "01310100",
              street: pick(DEMO_STREETS),
              number: String(Math.floor(between(10, 1900))),
              complement: "",
              reference: "",
            }
          : null,
        paymentMethod: weighted(PAYMENT_WEIGHTS),
        changeFor: null,
        note: "",
        items,
        subtotal,
        deliveryFee,
        total: round(subtotal + deliveryFee),
      };
      orders.push(order);

      if (order.status === "DELIVERED") {
        const key = toDateKey(day);
        dailySales.set(key, (dailySales.get(key) ?? 0) + order.total);
      } else {
        cancelled.push(order);
      }
    }
  }

  const transactions: Transaction[] = [];
  const todayKey = toDateKey(today);
  const add = (type: TransactionType, category: string, description: string, amount: number, date: Date) => {
    const dateKey = toDateKey(date);
    if (dateKey > todayKey || amount <= 0) return;
    transactions.push({ id: createId(), type, category, description, amount: round(amount), date: dateKey });
  };

  const salesBetween = (end: Date, days: number) => {
    let total = 0;
    for (let i = 1; i <= days; i++) {
      const day = new Date(end);
      day.setDate(end.getDate() - i);
      total += dailySales.get(toDateKey(day)) ?? 0;
    }
    return total;
  };

  const start = new Date(today);
  start.setDate(today.getDate() - HISTORY_DAYS);

  for (let day = new Date(start); day <= today; day.setDate(day.getDate() + 1)) {
    const weekday = day.getDay();
    if (weekday === 2) {
      add("EXPENSE", "Insumos", "Compra semanal de insumos", salesBetween(day, 7) * between(0.29, 0.33), day);
      if (Math.floor(day.getDate() / 7) % 2 === 0) {
        add("EXPENSE", "Embalagens", "Embalagens e descartáveis", salesBetween(day, 14) * between(0.035, 0.045), day);
      }
    }
    if (weekday === 0) {
      add("LOSS", "Desperdício", "Descarte de insumos da semana", salesBetween(day, 7) * between(0.008, 0.018), day);
    }
    if (weekday === 6) {
      add("INCOME", "Vendas no balcão", "Vendas presenciais do sábado", between(280, 720), day);
    }
  }

  for (const order of cancelled) {
    if (order.paymentMethod === "PIX" && random() < 0.5) {
      add("LOSS", "Estornos", `Estorno do pedido #${order.id}`, order.total, new Date(order.createdAt));
    }
  }

  const firstMonth = new Date(start.getFullYear(), start.getMonth(), 1);
  for (let month = new Date(firstMonth); month <= today; month.setMonth(month.getMonth() + 1)) {
    const on = (day: number) => new Date(month.getFullYear(), month.getMonth(), day);
    const previousMonthKey = toDateKey(new Date(month.getFullYear(), month.getMonth() - 1, 1)).slice(0, 7);
    const previousMonthSales = [...dailySales.entries()]
      .filter(([key]) => key.startsWith(previousMonthKey))
      .reduce((sum, [, value]) => sum + value, 0);

    add("EXPENSE", "Aluguel", "Aluguel do ponto", 2800, on(5));
    add("EXPENSE", "Salários", "Folha de pagamento", 6800 * between(0.98, 1.04), on(5));
    add("EXPENSE", "Marketing", "Anúncios no Instagram", between(300, 650), on(3));
    add("EXPENSE", "Energia", "Conta de energia", 720 * between(0.85, 1.2), on(10));
    add("EXPENSE", "Água", "Conta de água", 190 * between(0.85, 1.15), on(10));
    add("EXPENSE", "Internet", "Internet e telefone", 129.9, on(12));
    add("EXPENSE", "Contabilidade", "Honorários contábeis", 350, on(15));
    add("EXPENSE", "Gás", "Botijões de gás", 320 * between(0.8, 1.2), on(18));
    add("EXPENSE", "Taxas e impostos", "DAS Simples Nacional", previousMonthSales * 0.06, on(20));
    if (random() < 0.35) add("EXPENSE", "Manutenção", "Manutenção da chapa e fritadeira", between(220, 640), on(22));
    add("LOSS", "Validade vencida", "Produtos vencidos no estoque", between(60, 190), on(25));
    if (random() < 0.4) add("INCOME", "Encomendas e eventos", "Encomenda para evento", between(600, 1500), on(14));
  }

  transactions.sort((a, b) => a.date.localeCompare(b.date));
  return { orders: [...orders, ...createRecentOrders(nextId)], transactions };
}
