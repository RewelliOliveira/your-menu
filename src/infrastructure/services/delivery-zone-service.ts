import { DeliveryZone, DeliveryZonePayload } from "@/core/types/delivery-zone-types";
import {
  mockDeleteDeliveryZone,
  mockGetDeliveryZones,
  mockSaveDeliveryZone,
  mockUpdateDeliveryZone,
} from "../mocks/restaurant-mock";

export async function saveDeliveryZone(
  data: DeliveryZonePayload,
  _token?: string
): Promise<{ data: DeliveryZone }> {
  const newZone = await mockSaveDeliveryZone(data);
  return { data: newZone };
}

export async function getDeliveryZones(
  restaurantSlug?: string,
  _token?: string
): Promise<DeliveryZone[]> {
  return await mockGetDeliveryZones(restaurantSlug);
}

export async function updateDeliveryZone(
  id: string,
  data: DeliveryZonePayload,
  _token?: string
): Promise<{ data: DeliveryZone }> {
  const updated = await mockUpdateDeliveryZone(id, data);
  return { data: updated };
}

export async function deleteDeliveryZone(
  id: string,
  _token?: string
): Promise<{ data: { success: boolean } }> {
  await mockDeleteDeliveryZone(id);
  return { data: { success: true } };
}
