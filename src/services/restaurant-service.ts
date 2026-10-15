import { onlyDigits } from "@/lib/format";
import { createId } from "@/lib/utils";
import type {
  BusinessHours,
  DeliveryZone,
  Restaurant,
  RestaurantAddress,
  RestaurantProfileInput,
  Storefront,
} from "@/types/restaurant";
import { ApiError, db, delay, requireAuth, requireRestaurant } from "./mock/db";

export async function getStorefront(slug: string): Promise<Storefront> {
  await delay();
  return {
    restaurant: requireRestaurant(slug),
    hours: db.hours.get(),
    zones: db.zones.get(),
    city: db.address.get().city,
  };
}

export async function getMyRestaurant() {
  requireAuth();
  await delay(150);
  return db.restaurant.get();
}

export async function updateProfile(input: RestaurantProfileInput) {
  requireAuth();
  const name = input.name.trim();
  if (name.length < 2 || name.length > 60) throw new ApiError("O nome deve ter entre 2 e 60 caracteres.");
  if (input.deliveryTimeMin <= 0 || input.deliveryTimeMax < input.deliveryTimeMin) {
    throw new ApiError("Confira o tempo de entrega: o máximo deve ser maior que o mínimo.");
  }
  await delay();

  const restaurant: Restaurant = {
    ...db.restaurant.get(),
    ...input,
    name,
    description: input.description.trim().slice(0, 160),
    pixKey: input.pixKey.trim().slice(0, 77),
  };
  db.restaurant.set(restaurant);
  return restaurant;
}

export async function updateRestaurantFlags(flags: Partial<Pick<Restaurant, "isOpen" | "pickupEnabled">>) {
  requireAuth();
  await delay(200);
  const restaurant = { ...db.restaurant.get(), ...flags };
  db.restaurant.set(restaurant);
  return restaurant;
}

export async function getHours() {
  requireAuth();
  await delay(150);
  return db.hours.get();
}

export async function updateHours(hours: BusinessHours[]) {
  requireAuth();
  if (hours.some((day) => day.isOpen && (!day.openingTime || !day.closingTime))) {
    throw new ApiError("Informe abertura e fechamento dos dias em funcionamento.");
  }
  await delay();
  db.hours.set(hours);
  return hours;
}

export async function getAddress() {
  requireAuth();
  await delay(150);
  return db.address.get();
}

export async function updateAddress(address: RestaurantAddress) {
  requireAuth();
  if (onlyDigits(address.cep).length !== 8) throw new ApiError("CEP inválido.");
  await delay();
  db.address.set(address);
  return address;
}

export async function getDeliveryZones() {
  requireAuth();
  await delay(150);
  return db.zones.get();
}

function validateZone(zone: Omit<DeliveryZone, "id">, ignoreId?: string) {
  const name = zone.name.trim();
  if (!name) throw new ApiError("Informe o nome do bairro.");
  if (!Number.isFinite(zone.fee) || zone.fee < 0 || zone.fee > 500) throw new ApiError("Taxa de entrega inválida.");
  const duplicated = db.zones
    .get()
    .some((z) => z.id !== ignoreId && z.name.toLowerCase() === name.toLowerCase());
  if (duplicated) throw new ApiError("Já existe uma zona com esse nome.");
  return { name: name.slice(0, 60), fee: Math.round(zone.fee * 100) / 100 };
}

export async function saveDeliveryZone(zone: Omit<DeliveryZone, "id"> & { id?: string }) {
  requireAuth();
  const data = validateZone(zone, zone.id);
  await delay();

  const zones = db.zones.get();
  const saved: DeliveryZone = { id: zone.id ?? createId(), ...data };
  db.zones.set(zone.id ? zones.map((z) => (z.id === zone.id ? saved : z)) : [...zones, saved]);
  return saved;
}

export async function deleteDeliveryZone(id: string) {
  requireAuth();
  await delay();
  db.zones.set(db.zones.get().filter((z) => z.id !== id));
}
