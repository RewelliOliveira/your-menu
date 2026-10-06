import {
  mockGetOrders,
  mockGetOrderById,
  mockUpdateOrderStatus,
  mockCreateOrder,
  MockOrder,
  CreateOrderPayloadInput,
} from "@/mocks/orders";

export interface OrderListItemResponse {
  orderId: number;
  dateTime?: string;
  status: string;
  price: number;

  orderItems: Array<{
    id: number;
    dishSizeOptionId: number;
    dishName: string;
    sizeOption: {
      id: number;
      magnitude: string | null;
      measureUnit: string;
      abbreviation: string;
    };
    quantity: number;
    price: number;
  }>;

  orderAdress: {
    id: number;
    deliveryZone: {
      id: number;
      zone: string;
      deliveryFee: number;
    };
    cep: number;
    street: string;
    number: string;
    complement: string;
    reference: string;
  };
}

export interface OrderDetailResponse {
  id: number;
  restaurantId: string;
  dateTime: string;
  price: number;
  status: string;
  note: string | null;

  orderItems: Array<{
    foodImg: string;
    id: number;
    dishSizeOptionId: number;
    dishName: string;
    sizeOption: {
      id: number;
      magnitude: string | null;
      measureUnit: string;
      abbreviation: string;
    };
    quantity: number;
    price: number;
  }>;

  orderAdress: {
    id: number;
    deliveryZone: {
      id: number;
      zone: string;
      deliveryFee: number;
    };
    cep: number;
    street: string;
    number: string;
    complement: string;
    reference: string;
  };

  orderClient: {
    firstName: string;
    lastName?: string;
    phone: number | string;
  };
}

export interface CreateOrderPayload {
  dateTime: string;
  status: "PENDING" | "CONFIRMED" | "DELIVERED" | "CANCELLED";
  restaurantId: string;
  orderItems: Array<{
    dishSizeOptionId: number;
    quantity: number;
  }>;
  orderAdress: {
    deliveryZoneId: number;
    street: string;
    number: string;
    complement: string;
    cep: string;
    reference: string;
  };
  orderClient: {
    name: string;
    phone: string;
  };
}

function mapToOrderListItem(order: MockOrder): OrderListItemResponse {
  return {
    orderId: order.id,
    dateTime: order.dateTime,
    status: order.status,
    price: order.price,
    orderItems: order.orderItems.map((item) => ({
      id: item.id,
      dishSizeOptionId: item.dishSizeOptionId,
      dishName: item.dishName,
      sizeOption: item.sizeOption,
      quantity: item.quantity,
      price: item.price,
    })),
    orderAdress: order.orderAdress,
  };
}

function mapToOrderDetail(order: MockOrder): OrderDetailResponse {
  return {
    id: order.id,
    restaurantId: order.restaurantId,
    dateTime: order.dateTime,
    price: order.price,
    status: order.status,
    note: order.note,
    orderItems: order.orderItems.map((item) => ({
      id: item.id,
      foodImg: item.foodImg || "placeholder.svg",
      dishSizeOptionId: item.dishSizeOptionId,
      dishName: item.dishName,
      sizeOption: item.sizeOption,
      quantity: item.quantity,
      price: item.price,
    })),
    orderAdress: order.orderAdress,
    orderClient: order.orderClient,
  };
}

export async function getOrdersApi(
  _restaurantId: string,
  _token?: string
): Promise<OrderListItemResponse[]> {
  const orders = await mockGetOrders();
  return orders.map(mapToOrderListItem);
}

export async function getOrderByIdApi(
  _restaurantId: string,
  orderId: number,
  _token?: string
): Promise<OrderDetailResponse> {
  const order = await mockGetOrderById(orderId);
  if (!order) {
    throw new Error(`Pedido #${orderId} não encontrado.`);
  }
  return mapToOrderDetail(order);
}

export async function updateOrderStatusApi(
  _restaurantId: string,
  orderId: number,
  status: string,
  _token?: string
): Promise<void> {
  await mockUpdateOrderStatus(orderId, status as MockOrder["status"]);
}

export async function createOrderApi(
  _token: string,
  payload: CreateOrderPayload
): Promise<{ orderId: number }> {
  return await mockCreateOrder(payload as CreateOrderPayloadInput);
}
