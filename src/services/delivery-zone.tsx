import {
  mockGetDeliveryZones,
  mockSaveDeliveryZone,
  mockUpdateDeliveryZone,
  mockDeleteDeliveryZone,
} from "@/mocks/restaurant";

export interface DeliveryZoneRequest {
  zone: string;
  deliveryFee: number;
  restaurantSlug: string;
}

export async function saveDeliveryZone(
  data: DeliveryZoneRequest,
  _token?: string
) {
  const newZone = await mockSaveDeliveryZone(data);
  return { data: newZone };
}

export async function getDeliveryZones(
  restaurantSlug?: string,
  _token?: string
) {
  const zones = await mockGetDeliveryZones(restaurantSlug);
  return zones;
}

export async function updateDeliveryZone(
  id: string,
  data: DeliveryZoneRequest,
  _token?: string
) {
  const updated = await mockUpdateDeliveryZone(id, data);
  return { data: updated };
}

export async function deleteDeliveryZone(
  id: string,
  _token?: string
) {
  await mockDeleteDeliveryZone(id);
  return { data: { success: true } };
}
