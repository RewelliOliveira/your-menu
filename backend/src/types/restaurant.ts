import type { Weekday } from "../domain/business-hours";

export interface BusinessHours {
  weekday: Weekday;
  isOpen: boolean;
  openingTime: string;
  closingTime: string;
}

export interface RestaurantAddress {
  cep: string;
  state: string;
  city: string;
  district: string;
  street: string;
  number: string;
  complement: string;
  reference: string;
}

export interface DeliveryZone {
  id: string;
  name: string;
  fee: number;
}

export interface Restaurant {
  id: string;
  slug: string;
  name: string;
  description: string;
  logoUrl: string | null;
  bannerUrl: string | null;
  deliveryTimeMin: number;
  deliveryTimeMax: number;
  isOpen: boolean;
  pickupEnabled: boolean;
  pixKey: string;
}

export type RestaurantProfileInput = Omit<Restaurant, "id" | "slug" | "isOpen" | "pickupEnabled">;

export type RestaurantFlags = Partial<Pick<Restaurant, "isOpen" | "pickupEnabled">>;

export interface Storefront {
  restaurant: Restaurant;
  hours: BusinessHours[];
  zones: DeliveryZone[];
  city: string;
}
