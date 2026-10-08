export interface DeliveryZone {
  id: string;
  zone: string;
  deliveryFee: number;
  restaurantSlug: string;
}

export interface DeliveryZonePayload {
  zone: string;
  deliveryFee: number;
  restaurantSlug: string;
}
