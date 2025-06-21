import { api } from "./api";

interface DeliveryZoneRequest {
  zone: string;
  deliveryFee: number;
  restaurantSlug: string;
}

export async function saveDeliveryZone(data: DeliveryZoneRequest, token: string) {
  return await api.post("/delivery-zone", data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}

export async function getDeliveryZones(restaurantSlug: string, token: string) {
  const response = await api.get("/delivery-zone", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    params: { restaurantSlug },
  });
  return response.data;
}
