import { db, type DB } from "../database/connection";
import type { NewOrder, NewOrderItem, OrderItemRow, OrderRow } from "../database/schema";
import { fromCents, toCents } from "../domain/money";
import type { OrderStatus } from "../domain/order-status";
import type { FulfillmentType, Order, OrderItem, PaymentMethod } from "../types/order";
import { createId } from "../utils/id";

const BATCH_SIZE = 200;

function toOrderItem(row: OrderItemRow): OrderItem {
  return {
    dishId: row.dish_id,
    variantId: row.variant_id,
    dishName: row.dish_name,
    variantLabel: row.variant_label,
    imageUrl: row.image_url,
    unitPrice: fromCents(row.unit_price_cents),
    quantity: Number(row.quantity),
    note: row.note,
  };
}

function toOrder(row: OrderRow, items: OrderItemRow[]): Order {
  return {
    id: Number(row.number),
    trackingCode: row.tracking_code,
    restaurantId: row.restaurant_id,
    createdAt: row.created_at,
    status: row.status as OrderStatus,
    fulfillment: row.fulfillment as FulfillmentType,
    customer: { name: row.customer_name, phone: row.customer_phone },
    address: row.address_zone_id
      ? {
          zoneId: row.address_zone_id,
          zoneName: row.address_zone_name ?? "",
          cep: row.address_cep ?? "",
          street: row.address_street ?? "",
          number: row.address_number ?? "",
          complement: row.address_complement ?? "",
          reference: row.address_reference ?? "",
        }
      : null,
    paymentMethod: row.payment_method as PaymentMethod,
    changeFor: row.change_for_cents === null ? null : fromCents(row.change_for_cents),
    note: row.note,
    items: items
      .filter((item) => item.order_id === row.id)
      .sort((a, b) => a.position - b.position)
      .map(toOrderItem),
    subtotal: fromCents(row.subtotal_cents),
    deliveryFee: fromCents(row.delivery_fee_cents),
    total: fromCents(row.total_cents),
  };
}

function toRows(order: Order): { row: NewOrder; items: NewOrderItem[] } {
  const id = createId();
  return {
    row: {
      id,
      restaurant_id: order.restaurantId,
      number: order.id,
      tracking_code: order.trackingCode,
      created_at: order.createdAt,
      status: order.status,
      fulfillment: order.fulfillment,
      customer_name: order.customer.name,
      customer_phone: order.customer.phone,
      address_zone_id: order.address?.zoneId ?? null,
      address_zone_name: order.address?.zoneName ?? null,
      address_cep: order.address?.cep ?? null,
      address_street: order.address?.street ?? null,
      address_number: order.address?.number ?? null,
      address_complement: order.address?.complement ?? null,
      address_reference: order.address?.reference ?? null,
      payment_method: order.paymentMethod,
      change_for_cents: order.changeFor === null ? null : toCents(order.changeFor),
      note: order.note,
      subtotal_cents: toCents(order.subtotal),
      delivery_fee_cents: toCents(order.deliveryFee),
      total_cents: toCents(order.total),
    },
    items: order.items.map((item, position) => ({
      id: createId(),
      order_id: id,
      position,
      dish_id: item.dishId,
      variant_id: item.variantId,
      dish_name: item.dishName,
      variant_label: item.variantLabel,
      image_url: item.imageUrl,
      unit_price_cents: toCents(item.unitPrice),
      quantity: item.quantity,
      note: item.note,
    })),
  };
}

async function withItems(rows: OrderRow[], executor: DB) {
  if (rows.length === 0) return [];
  const items: OrderItemRow[] = [];
  for (let start = 0; start < rows.length; start += BATCH_SIZE) {
    const ids = rows.slice(start, start + BATCH_SIZE).map((row) => row.id);
    items.push(...(await executor.selectFrom("order_items").selectAll().where("order_id", "in", ids).execute()));
  }
  return rows.map((row) => toOrder(row, items));
}

export async function nextOrderNumber(restaurantId: string, executor: DB = db) {
  const row = await executor
    .selectFrom("orders")
    .select((eb) => eb.fn.max("number").as("max"))
    .where("restaurant_id", "=", restaurantId)
    .executeTakeFirst();
  return Math.max(Number(row?.max ?? 0), 100) + 1;
}

export async function insertOrders(orders: Order[], executor: DB = db) {
  const rows = orders.map(toRows);
  for (let start = 0; start < rows.length; start += BATCH_SIZE) {
    const batch = rows.slice(start, start + BATCH_SIZE);
    await executor.insertInto("orders").values(batch.map((entry) => entry.row)).execute();
    const items = batch.flatMap((entry) => entry.items);
    for (let offset = 0; offset < items.length; offset += BATCH_SIZE) {
      await executor
        .insertInto("order_items")
        .values(items.slice(offset, offset + BATCH_SIZE))
        .execute();
    }
  }
}

export async function findOrderByTrackingCode(restaurantId: string, trackingCode: string, executor: DB = db) {
  const row = await executor
    .selectFrom("orders")
    .selectAll()
    .where("restaurant_id", "=", restaurantId)
    .where("tracking_code", "=", trackingCode)
    .executeTakeFirst();
  if (!row) return undefined;
  const [order] = await withItems([row], executor);
  return order;
}

export async function findOrderByNumber(restaurantId: string, number: number, executor: DB = db) {
  const row = await executor
    .selectFrom("orders")
    .selectAll()
    .where("restaurant_id", "=", restaurantId)
    .where("number", "=", number)
    .executeTakeFirst();
  if (!row) return undefined;
  const [order] = await withItems([row], executor);
  return order;
}

export async function listOrdersSince(restaurantId: string, sinceIso: string, executor: DB = db) {
  const rows = await executor
    .selectFrom("orders")
    .selectAll()
    .where("restaurant_id", "=", restaurantId)
    .where("created_at", ">=", sinceIso)
    .orderBy("created_at", "desc")
    .execute();
  return withItems(rows, executor);
}

export async function listOrdersBetween(restaurantId: string, startIso: string, endIso: string, executor: DB = db) {
  const rows = await executor
    .selectFrom("orders")
    .selectAll()
    .where("restaurant_id", "=", restaurantId)
    .where("created_at", ">=", startIso)
    .where("created_at", "<", endIso)
    .execute();
  return withItems(rows, executor);
}

export async function updateOrderStatus(restaurantId: string, number: number, status: OrderStatus, executor: DB = db) {
  await executor
    .updateTable("orders")
    .set({ status })
    .where("restaurant_id", "=", restaurantId)
    .where("number", "=", number)
    .execute();
}
