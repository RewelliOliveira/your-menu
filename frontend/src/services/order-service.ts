import type { CreateOrderInput, Order, OrderStatus } from "@/types/order";
import { http } from "./http-client";

const storefrontPath = (slug: string) => `/storefronts/${encodeURIComponent(slug)}`;

export function createOrder(slug: string, input: CreateOrderInput) {
  return http.post<Order>(`${storefrontPath(slug)}/orders`, input);
}

export function getOrderByTrackingCode(slug: string, trackingCode: string) {
  return http.get<Order>(`${storefrontPath(slug)}/orders/${encodeURIComponent(trackingCode)}`);
}

export function getOrders() {
  return http.get<Order[]>("/orders");
}

export function updateOrderStatus(id: number, status: OrderStatus) {
  return http.patch<Order>(`/orders/${id}/status`, { status });
}
