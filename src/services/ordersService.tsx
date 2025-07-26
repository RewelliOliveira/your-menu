import { api } from "./api";

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
    phone: number | string;
  };
}

export async function getOrdersApi(
  restaurantId: string,
  token: string
): Promise<OrderListItemResponse[]> {
  const response = await api.get(`/restaurant/${restaurantId}/order`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
}

export async function getOrderByIdApi(
  restaurantId: string,
  orderId: number,
  token: string
): Promise<OrderDetailResponse> {
  const response = await api.get(
    `/restaurant/${restaurantId}/order/${orderId}`,
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return response.data;
}

export async function updateOrderStatusApi(
  restaurantId: string,
  orderId: number,
  status: string,
  token: string
): Promise<void> {
  await api.patch(
    `/restaurant/${restaurantId}/order/${orderId}`,
    { status },
    {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    }
  );
}

//POST
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

export async function createOrderApi(
  token: string,
  payload: CreateOrderPayload
): Promise<{ orderId: number }> {
  console.log("Payload:", payload);
  const response = await api.post(
    `/restaurant/${payload.restaurantId}/order`,
    payload,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response.data;
}
