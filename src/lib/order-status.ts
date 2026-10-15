import type { FulfillmentType, OrderStatus, PaymentMethod } from "@/types/order";

export const ORDER_STATUS_LABEL: Record<OrderStatus, string> = {
  PENDING: "Novo",
  CONFIRMED: "Em preparo",
  IN_DELIVERY: "Em entrega",
  DELIVERED: "Concluído",
  CANCELLED: "Cancelado",
};

export const ORDER_STATUS_DOT: Record<OrderStatus, string> = {
  PENDING: "bg-amber-500",
  CONFIRMED: "bg-sky-500",
  IN_DELIVERY: "bg-violet-500",
  DELIVERED: "bg-emerald-500",
  CANCELLED: "bg-red-500",
};

export const ACTIVE_STATUSES: OrderStatus[] = ["PENDING", "CONFIRMED", "IN_DELIVERY"];

export const ORDER_TRANSITIONS: Record<OrderStatus, OrderStatus[]> = {
  PENDING: ["CONFIRMED", "CANCELLED"],
  CONFIRMED: ["IN_DELIVERY", "DELIVERED", "CANCELLED"],
  IN_DELIVERY: ["DELIVERED", "CANCELLED"],
  DELIVERED: [],
  CANCELLED: [],
};

export function canTransition(from: OrderStatus, to: OrderStatus) {
  return ORDER_TRANSITIONS[from].includes(to);
}

export function getNextStep(status: OrderStatus, fulfillment: FulfillmentType) {
  switch (status) {
    case "PENDING":
      return { status: "CONFIRMED" as const, label: "Aceitar pedido" };
    case "CONFIRMED":
      return fulfillment === "PICKUP"
        ? { status: "DELIVERED" as const, label: "Retirado pelo cliente" }
        : { status: "IN_DELIVERY" as const, label: "Saiu para entrega" };
    case "IN_DELIVERY":
      return { status: "DELIVERED" as const, label: "Marcar como entregue" };
    default:
      return null;
  }
}

export const PAYMENT_LABEL: Record<PaymentMethod, string> = {
  PIX: "Pix",
  CARD: "Cartão na entrega",
  CASH: "Dinheiro",
};

export const FULFILLMENT_LABEL: Record<FulfillmentType, string> = {
  DELIVERY: "Entrega",
  PICKUP: "Retirada",
};
