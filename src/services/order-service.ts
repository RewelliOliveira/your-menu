import { onlyDigits } from "@/lib/format";
import { canTransition } from "@/lib/order-status";
import { createId } from "@/lib/utils";
import type {
  CreateOrderInput,
  Order,
  OrderItem,
  OrderStatus,
} from "@/types/order";
import { ApiError, db, delay, requireAuth, requireRestaurant } from "./mock/db";
import { receiveSimulatedOrders } from "./mock/demo-simulator";

const MAX_ITEMS = 50;
const MAX_QUANTITY = 99;

export async function createOrder(slug: string, input: CreateOrderInput) {
  const restaurant = requireRestaurant(slug);
  await delay(600);

  if (!restaurant.isOpen)
    throw new ApiError("O restaurante está fechado no momento.");
  if (input.items.length === 0 || input.items.length > MAX_ITEMS)
    throw new ApiError("Sacola inválida.");

  const name = input.customer.name.trim();
  const phone = onlyDigits(input.customer.phone);
  if (name.length < 2 || name.length > 80)
    throw new ApiError("Informe seu nome.");
  if (phone.length < 10 || phone.length > 11)
    throw new ApiError("Informe um celular válido.");

  const dishes = db.dishes.get();
  const items: OrderItem[] = input.items.map((item) => {
    const dish = dishes.find((d) => d.id === item.dishId);
    const variant = dish?.variants.find((v) => v.id === item.variantId);
    if (!dish || !variant)
      throw new ApiError("Um dos itens não está mais no cardápio.");
    if (!dish.isAvailable)
      throw new ApiError(`"${dish.name}" está indisponível no momento.`);
    if (
      !Number.isInteger(item.quantity) ||
      item.quantity < 1 ||
      item.quantity > MAX_QUANTITY
    ) {
      throw new ApiError("Quantidade inválida.");
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

  let address: Order["address"] = null;
  let deliveryFee = 0;

  if (input.fulfillment === "PICKUP") {
    if (!restaurant.pickupEnabled)
      throw new ApiError("Este restaurante não aceita retirada.");
  } else {
    const zone = db.zones.get().find((z) => z.id === input.address?.zoneId);
    if (!input.address || !zone)
      throw new ApiError("Selecione um bairro atendido.");
    if (!input.address.street.trim() || !input.address.number.trim())
      throw new ApiError("Endereço incompleto.");
    if (onlyDigits(input.address.cep).length !== 8)
      throw new ApiError("CEP inválido.");
    deliveryFee = zone.fee;
    address = {
      zoneId: zone.id,
      zoneName: zone.name,
      cep: onlyDigits(input.address.cep),
      street: input.address.street.trim().slice(0, 120),
      number: input.address.number.trim().slice(0, 10),
      complement: input.address.complement.trim().slice(0, 60),
      reference: input.address.reference.trim().slice(0, 120),
    };
  }

  if (input.paymentMethod === "PIX" && !restaurant.pixKey)
    throw new ApiError("Pix indisponível.");

  const subtotal = items.reduce(
    (sum, item) => sum + item.unitPrice * item.quantity,
    0,
  );
  const total = Math.round((subtotal + deliveryFee) * 100) / 100;

  if (
    input.paymentMethod === "CASH" &&
    input.changeFor !== null &&
    input.changeFor < total
  ) {
    throw new ApiError(
      "O valor do troco deve ser maior que o total do pedido.",
    );
  }

  const orders = db.orders.get();
  const order: Order = {
    id: orders.reduce((max, o) => Math.max(max, o.id), 100) + 1,
    trackingCode: createId(),
    restaurantId: restaurant.id,
    createdAt: new Date().toISOString(),
    status: "PENDING",
    fulfillment: input.fulfillment,
    customer: { name, phone },
    address,
    paymentMethod: input.paymentMethod,
    changeFor: input.paymentMethod === "CASH" ? input.changeFor : null,
    note: input.note.trim().slice(0, 280),
    items,
    subtotal,
    deliveryFee,
    total,
  };

  db.orders.set([order, ...orders]);
  return order;
}

export async function getOrderByTrackingCode(
  slug: string,
  trackingCode: string,
) {
  requireRestaurant(slug);
  await delay(200);
  const order = db.orders.get().find((o) => o.trackingCode === trackingCode);
  if (!order) throw new ApiError("Pedido não encontrado.", 404);
  return order;
}

const RECENT_ORDERS_WINDOW_MS = 7 * 24 * 60 * 60 * 1000;

export async function getOrders() {
  requireAuth();
  await delay(200);
  receiveSimulatedOrders();
  const since = new Date(Date.now() - RECENT_ORDERS_WINDOW_MS).toISOString();
  return db.orders
    .get()
    .filter((order) => order.createdAt >= since)
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export async function updateOrderStatus(id: number, status: OrderStatus) {
  requireAuth();
  await delay(250);

  const orders = db.orders.get();
  const order = orders.find((o) => o.id === id);
  if (!order) throw new ApiError("Pedido não encontrado.", 404);
  if (!canTransition(order.status, status))
    throw new ApiError("Mudança de status não permitida.");

  const updated = { ...order, status };
  db.orders.set(orders.map((o) => (o.id === id ? updated : o)));
  return updated;
}
