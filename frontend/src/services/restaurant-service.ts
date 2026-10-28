import type {
  BusinessHours,
  DeliveryZone,
  Restaurant,
  RestaurantAddress,
  RestaurantProfileInput,
  Storefront,
} from "@/types/restaurant";
import { http } from "./http-client";

export function getStorefront(slug: string) {
  return http.get<Storefront>(`/storefronts/${encodeURIComponent(slug)}`);
}

export function getMyRestaurant() {
  return http.get<Restaurant>("/restaurant");
}

export function updateProfile(input: RestaurantProfileInput) {
  return http.put<Restaurant>("/restaurant", input);
}

export function updateRestaurantFlags(flags: Partial<Pick<Restaurant, "isOpen" | "pickupEnabled">>) {
  return http.patch<Restaurant>("/restaurant/status", flags);
}

export function getHours() {
  return http.get<BusinessHours[]>("/restaurant/hours");
}

export function updateHours(hours: BusinessHours[]) {
  return http.put<BusinessHours[]>("/restaurant/hours", hours);
}

export function getAddress() {
  return http.get<RestaurantAddress>("/restaurant/address");
}

export function updateAddress(address: RestaurantAddress) {
  return http.put<RestaurantAddress>("/restaurant/address", address);
}

export function getDeliveryZones() {
  return http.get<DeliveryZone[]>("/delivery-zones");
}

export function saveDeliveryZone({ id, ...zone }: Omit<DeliveryZone, "id"> & { id?: string }) {
  return id ? http.put<DeliveryZone>(`/delivery-zones/${id}`, zone) : http.post<DeliveryZone>("/delivery-zones", zone);
}

export function deleteDeliveryZone(id: string) {
  return http.delete(`/delivery-zones/${id}`);
}
