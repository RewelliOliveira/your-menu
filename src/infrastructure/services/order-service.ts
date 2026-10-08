import { CreateOrderPayload, OrderEntity, OrderStatus } from "@/core/types/order-types";
import {
  mockCreateOrder,
  mockGetOrderById,
  mockGetOrders,
  mockUpdateOrderStatus,
} from "../mocks/order-mock";

export async function getOrdersApi(
  _restaurantId: string,
  _token?: string
): Promise<OrderEntity[]> {
  return await mockGetOrders();
}

export async function getOrderByIdApi(
  _restaurantId: string,
  orderId: number,
  _token?: string
): Promise<OrderEntity> {
  const order = await mockGetOrderById(orderId);
  if (!order) {
    throw new Error(`Pedido #${orderId} não encontrado.`);
  }
  return order;
}

export async function updateOrderStatusApi(
  _restaurantId: string,
  orderId: number,
  status: OrderStatus,
  _token?: string
): Promise<void> {
  await mockUpdateOrderStatus(orderId, status);
}

export async function createOrderApi(
  _token: string,
  payload: CreateOrderPayload
): Promise<{ orderId: number }> {
  return await mockCreateOrder(payload);
}
