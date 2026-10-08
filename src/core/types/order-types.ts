export type OrderStatus =
  | "PENDING"
  | "CONFIRMED"
  | "IN_DELIVERY"
  | "DELIVERED"
  | "CANCELLED";

export type OrderStatusLabel =
  | "Solicitados"
  | "Em preparo"
  | "Em entrega"
  | "Entregue"
  | "Cancelados";

export interface OrderItemSummary {
  id: number;
  dishSizeOptionId: number;
  dishName: string;
  foodImg?: string;
  sizeOption: {
    id: number;
    magnitude: string | null;
    measureUnit: string;
    abbreviation: string;
  };
  quantity: number;
  price: number;
}

export interface OrderAddressData {
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
}

export interface OrderClientData {
  firstName: string;
  lastName?: string;
  phone: string | number;
}

export interface OrderEntity {
  id: number;
  restaurantId: string;
  dateTime: string;
  price: number;
  status: OrderStatus;
  note: string | null;
  orderItems: OrderItemSummary[];
  orderAdress: OrderAddressData;
  orderClient: OrderClientData;
}

export interface CreateOrderPayload {
  dateTime: string;
  status: OrderStatus;
  restaurantId: string;
  orderItems: Array<{
    dishSizeOptionId: number;
    quantity: number;
    dishName?: string;
    foodImg?: string;
    price?: number;
    sizeOption?: {
      id: number;
      magnitude: string | null;
      measureUnit: string;
      abbreviation: string;
    };
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
