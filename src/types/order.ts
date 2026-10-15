export type OrderStatus = "PENDING" | "CONFIRMED" | "IN_DELIVERY" | "DELIVERED" | "CANCELLED";
export type FulfillmentType = "DELIVERY" | "PICKUP";
export type PaymentMethod = "PIX" | "CARD" | "CASH";

export interface OrderItem {
  dishId: string;
  variantId: string;
  dishName: string;
  variantLabel: string;
  imageUrl: string | null;
  unitPrice: number;
  quantity: number;
  note: string;
}

export interface OrderCustomer {
  name: string;
  phone: string;
}

export interface OrderAddress {
  zoneId: string;
  zoneName: string;
  cep: string;
  street: string;
  number: string;
  complement: string;
  reference: string;
}

export interface Order {
  id: number;
  trackingCode: string;
  restaurantId: string;
  createdAt: string;
  status: OrderStatus;
  fulfillment: FulfillmentType;
  customer: OrderCustomer;
  address: OrderAddress | null;
  paymentMethod: PaymentMethod;
  changeFor: number | null;
  note: string;
  items: OrderItem[];
  subtotal: number;
  deliveryFee: number;
  total: number;
}

export interface CreateOrderInput {
  fulfillment: FulfillmentType;
  customer: OrderCustomer;
  address: Omit<OrderAddress, "zoneName"> | null;
  paymentMethod: PaymentMethod;
  changeFor: number | null;
  note: string;
  items: Array<{ dishId: string; variantId: string; quantity: number; note: string }>;
}
