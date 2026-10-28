import type { Insertable, Selectable } from "kysely";

export interface UsersTable {
  id: string;
  name: string;
  email: string;
  password_hash: string;
  created_at: string;
}

export interface RestaurantsTable {
  id: string;
  user_id: string;
  slug: string;
  name: string;
  description: string;
  logo_url: string | null;
  banner_url: string | null;
  delivery_time_min: number;
  delivery_time_max: number;
  is_open: number;
  pickup_enabled: number;
  pix_key: string;
  created_at: string;
}

export interface RestaurantAddressesTable {
  restaurant_id: string;
  cep: string;
  state: string;
  city: string;
  district: string;
  street: string;
  number: string;
  complement: string;
  reference: string;
}

export interface BusinessHoursTable {
  restaurant_id: string;
  weekday: string;
  is_open: number;
  opening_time: string;
  closing_time: string;
}

export interface DeliveryZonesTable {
  id: string;
  restaurant_id: string;
  name: string;
  fee_cents: number;
}

export interface CategoriesTable {
  id: string;
  restaurant_id: string;
  name: string;
  position: number;
}

export interface DishesTable {
  id: string;
  restaurant_id: string;
  category_id: string;
  name: string;
  description: string;
  image_url: string | null;
  is_available: number;
  position: number;
}

export interface DishVariantsTable {
  id: string;
  dish_id: string;
  label: string;
  price_cents: number;
  position: number;
}

export interface OrdersTable {
  id: string;
  restaurant_id: string;
  number: number;
  tracking_code: string;
  created_at: string;
  status: string;
  fulfillment: string;
  customer_name: string;
  customer_phone: string;
  address_zone_id: string | null;
  address_zone_name: string | null;
  address_cep: string | null;
  address_street: string | null;
  address_number: string | null;
  address_complement: string | null;
  address_reference: string | null;
  payment_method: string;
  change_for_cents: number | null;
  note: string;
  subtotal_cents: number;
  delivery_fee_cents: number;
  total_cents: number;
}

export interface OrderItemsTable {
  id: string;
  order_id: string;
  position: number;
  dish_id: string;
  variant_id: string;
  dish_name: string;
  variant_label: string;
  image_url: string | null;
  unit_price_cents: number;
  quantity: number;
  note: string;
}

export interface TransactionsTable {
  id: string;
  restaurant_id: string;
  type: string;
  category: string;
  description: string;
  amount_cents: number;
  date: string;
}

export interface UploadsTable {
  id: string;
  restaurant_id: string;
  mime_type: string;
  data: Buffer;
  created_at: string;
}

export interface Database {
  users: UsersTable;
  restaurants: RestaurantsTable;
  restaurant_addresses: RestaurantAddressesTable;
  business_hours: BusinessHoursTable;
  delivery_zones: DeliveryZonesTable;
  categories: CategoriesTable;
  dishes: DishesTable;
  dish_variants: DishVariantsTable;
  orders: OrdersTable;
  order_items: OrderItemsTable;
  transactions: TransactionsTable;
  uploads: UploadsTable;
}

export type UserRow = Selectable<UsersTable>;
export type RestaurantRow = Selectable<RestaurantsTable>;
export type AddressRow = Selectable<RestaurantAddressesTable>;
export type BusinessHoursRow = Selectable<BusinessHoursTable>;
export type DeliveryZoneRow = Selectable<DeliveryZonesTable>;
export type CategoryRow = Selectable<CategoriesTable>;
export type DishRow = Selectable<DishesTable>;
export type DishVariantRow = Selectable<DishVariantsTable>;
export type OrderRow = Selectable<OrdersTable>;
export type OrderItemRow = Selectable<OrderItemsTable>;
export type TransactionRow = Selectable<TransactionsTable>;

export type NewOrder = Insertable<OrdersTable>;
export type NewOrderItem = Insertable<OrderItemsTable>;
export type NewTransaction = Insertable<TransactionsTable>;
