import { db } from "../database/connection";
import { isAcceptingOrders } from "../domain/business-hours";
import { roundMoney } from "../domain/money";
import { canTransition, type OrderStatus } from "../domain/order-status";
import { onlyDigits } from "../domain/text";
import { AppError, NotFoundError } from "../errors/app-error";
import { findZone } from "../repositories/delivery-zone-repository";
import { listDishes } from "../repositories/menu-repository";
import * as orders from "../repositories/order-repository";
import { listBusinessHours } from "../repositories/restaurant-repository";
import type { CreateOrderInput, Order, OrderItem } from "../types/order";
import type { Restaurant } from "../types/restaurant";
import { createId, nowIso } from "../utils/id";
import { requireRestaurantBySlug } from "./restaurant-service";

const MAX_ITEMS = 50;
const MAX_QUANTITY = 99;
const RECENT_ORDERS_WINDOW_MS = 7 * 24 * 60 * 60 * 1000;
const MAX_NUMBER_ATTEMPTS = 3;

function validateCustomer(customer: CreateOrderInput["customer"]) {
  const name = customer.name.trim();
  const phone = onlyDigits(customer.phone);
  if (name.length < 2 || name.length > 80) throw new AppError("Informe seu nome.");
  if (phone.length < 10 || phone.length > 11) throw new AppError("Informe um celular válido.");
  return { name, phone };
}

async function priceItems(restaurantId: string, input: CreateOrderInput["items"]): Promise<OrderItem[]> {
  const dishes = await listDishes(restaurantId);
  return input.map((item) => {
    const dish = dishes.find((d) => d.id === item.dishId);
    const variant = dish?.variants.find((v) => v.id === item.variantId);
    if (!dish || !variant) throw new AppError("Um dos itens não está mais no cardápio.");
    if (!dish.isAvailable) throw new AppError(`"${dish.name}" está indisponível no momento.`);
    if (!Number.isInteger(item.quantity) || item.quantity < 1 || item.quantity > MAX_QUANTITY) {
      throw new AppError("Quantidade inválida.");
    }
    return {
      dishId: dish.id,
      variantId: variant.id,
      dishName: dish.name,
      variantLabel: variant.label,
      imageUrl: dish.imageUrl,
      unitPrice: variant.price,
      quantity: item.quantity,
      note: item.note.trim().slice(0, 140),
    };
  });
}

async function resolveDelivery(restaurant: Restaurant, input: CreateOrderInput) {
  if (input.fulfillment === "PICKUP") {
    if (!restaurant.pickupEnabled) throw new AppError("Este restaurante não aceita retirada.");
    return { address: null, deliveryFee: 0 };
  }

  const zone = input.address && (await findZone(restaurant.id, input.address.zoneId));
  if (!input.address || !zone) throw new AppError("Selecione um bairro atendido.");
  if (!input.address.street.trim() || !input.address.number.trim()) throw new AppError("Endereço incompleto.");
  if (onlyDigits(input.address.cep).length !== 8) throw new AppError("CEP inválido.");

  return {
    deliveryFee: zone.fee,
    address: {
      zoneId: zone.id,
      zoneName: zone.name,
      cep: onlyDigits(input.address.cep),
      street: input.address.street.trim().slice(0, 120),
      number: input.address.number.trim().slice(0, 10),
      complement: input.address.complement.trim().slice(0, 60),
      reference: input.address.reference.trim().slice(0, 120),
    },
  };
}

const isUniqueViolation = (error: unknown) =>
  error instanceof Error && /unique|duplicate/i.test(`${error.message} ${(error as { code?: string }).code ?? ""}`);

async function persistOrder(order: Omit<Order, "id">) {
  for (let attempt = 1; ; attempt++) {
    try {
      return await db.transaction().execute(async (trx) => {
        const saved: Order = { ...order, id: await orders.nextOrderNumber(order.restaurantId, trx) };
        await orders.insertOrders([saved], trx);
        return saved;
      });
    } catch (error) {
      if (attempt >= MAX_NUMBER_ATTEMPTS || !isUniqueViolation(error)) throw error;
    }
  }
}

export async function createOrder(slug: string, input: CreateOrderInput) {
  const restaurant = await requireRestaurantBySlug(slug);

  if (!isAcceptingOrders(restaurant, await listBusinessHours(restaurant.id))) {
    throw new AppError("O restaurante está fechado no momento.");
  }
  if (input.items.length === 0 || input.items.length > MAX_ITEMS) throw new AppError("Sacola inválida.");

  const customer = validateCustomer(input.customer);
  const items = await priceItems(restaurant.id, input.items);
  const { address, deliveryFee } = await resolveDelivery(restaurant, input);

  if (input.paymentMethod === "PIX" && !restaurant.pixKey) throw new AppError("Pix indisponível.");

  const subtotal = roundMoney(items.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0));
  const total = roundMoney(subtotal + deliveryFee);

  if (input.paymentMethod === "CASH" && input.changeFor !== null && input.changeFor < total) {
    throw new AppError("O valor do troco deve ser maior que o total do pedido.");
  }

  return persistOrder({
    trackingCode: createId(),
    restaurantId: restaurant.id,
    createdAt: nowIso(),
    status: "PENDING",
    fulfillment: input.fulfillment,
    customer,
    address,
    paymentMethod: input.paymentMethod,
    changeFor: input.paymentMethod === "CASH" ? input.changeFor : null,
    note: input.note.trim().slice(0, 280),
    items,
    subtotal,
    deliveryFee,
    total,
  });
}

export async function getOrderByTrackingCode(slug: string, trackingCode: string) {
  const restaurant = await requireRestaurantBySlug(slug);
  const order = await orders.findOrderByTrackingCode(restaurant.id, trackingCode);
  if (!order) throw new NotFoundError("Pedido não encontrado.");
  return order;
}

export function getRecentOrders(restaurantId: string) {
  const since = new Date(Date.now() - RECENT_ORDERS_WINDOW_MS).toISOString();
  return orders.listOrdersSince(restaurantId, since);
}

export async function updateOrderStatus(restaurantId: string, number: number, status: OrderStatus) {
  const order = await orders.findOrderByNumber(restaurantId, number);
  if (!order) throw new NotFoundError("Pedido não encontrado.");
  if (!canTransition(order.status, status)) throw new AppError("Mudança de status não permitida.");
  await orders.updateOrderStatus(restaurantId, number, status);
  return { ...order, status };
}
