import { TIME_PATTERN } from "../domain/business-hours";
import { roundMoney } from "../domain/money";
import { onlyDigits } from "../domain/text";
import { AppError, ConflictError, NotFoundError } from "../errors/app-error";
import * as zones from "../repositories/delivery-zone-repository";
import * as restaurants from "../repositories/restaurant-repository";
import type {
  BusinessHours,
  DeliveryZone,
  RestaurantAddress,
  RestaurantFlags,
  RestaurantProfileInput,
  Storefront,
} from "../types/restaurant";
import { createId } from "../utils/id";

const EMPTY_ADDRESS: RestaurantAddress = {
  cep: "",
  state: "",
  city: "",
  district: "",
  street: "",
  number: "",
  complement: "",
  reference: "",
};

export async function requireRestaurantBySlug(slug: string) {
  const restaurant = await restaurants.findRestaurantBySlug(slug);
  if (!restaurant) throw new NotFoundError("Restaurante não encontrado.");
  return restaurant;
}

export async function getMyRestaurant(restaurantId: string) {
  const restaurant = await restaurants.findRestaurantById(restaurantId);
  if (!restaurant) throw new NotFoundError("Restaurante não encontrado.");
  return restaurant;
}

export async function getStorefront(slug: string): Promise<Storefront> {
  const restaurant = await requireRestaurantBySlug(slug);
  const [hours, deliveryZones, address] = await Promise.all([
    restaurants.listBusinessHours(restaurant.id),
    zones.listZones(restaurant.id),
    restaurants.findAddress(restaurant.id),
  ]);
  return { restaurant, hours, zones: deliveryZones, city: address?.city ?? "" };
}

export async function updateProfile(restaurantId: string, input: RestaurantProfileInput) {
  const name = input.name.trim();
  if (name.length < 2 || name.length > 60) throw new AppError("O nome deve ter entre 2 e 60 caracteres.");
  if (input.deliveryTimeMin <= 0 || input.deliveryTimeMax < input.deliveryTimeMin) {
    throw new AppError("Confira o tempo de entrega: o máximo deve ser maior que o mínimo.");
  }
  await restaurants.updateRestaurant(restaurantId, {
    ...input,
    name,
    description: input.description.trim().slice(0, 160),
    pixKey: input.pixKey.trim().slice(0, 77),
  });
  return getMyRestaurant(restaurantId);
}

export async function updateFlags(restaurantId: string, flags: RestaurantFlags) {
  await restaurants.updateRestaurant(restaurantId, flags);
  return getMyRestaurant(restaurantId);
}

export function getHours(restaurantId: string) {
  return restaurants.listBusinessHours(restaurantId);
}

export async function updateHours(restaurantId: string, hours: BusinessHours[]) {
  if (new Set(hours.map((day) => day.weekday)).size !== hours.length) throw new AppError("Dias da semana repetidos.");
  if (hours.some((day) => day.isOpen && !(TIME_PATTERN.test(day.openingTime) && TIME_PATTERN.test(day.closingTime)))) {
    throw new AppError("Informe abertura e fechamento dos dias em funcionamento.");
  }
  await restaurants.replaceBusinessHours(restaurantId, hours);
  return hours;
}

export async function getAddress(restaurantId: string) {
  return (await restaurants.findAddress(restaurantId)) ?? EMPTY_ADDRESS;
}

export async function updateAddress(restaurantId: string, address: RestaurantAddress) {
  if (onlyDigits(address.cep).length !== 8) throw new AppError("CEP inválido.");
  await restaurants.saveAddress(restaurantId, address);
  return address;
}

export function getDeliveryZones(restaurantId: string) {
  return zones.listZones(restaurantId);
}

async function validateZone(restaurantId: string, zone: Omit<DeliveryZone, "id">, ignoreId?: string) {
  const name = zone.name.trim();
  if (!name) throw new AppError("Informe o nome do bairro.");
  if (zone.fee < 0 || zone.fee > 500) throw new AppError("Taxa de entrega inválida.");
  const existing = await zones.listZones(restaurantId);
  if (existing.some((z) => z.id !== ignoreId && z.name.toLowerCase() === name.toLowerCase())) {
    throw new ConflictError("Já existe uma zona com esse nome.");
  }
  return { name: name.slice(0, 60), fee: roundMoney(zone.fee) };
}

export async function createDeliveryZone(restaurantId: string, input: Omit<DeliveryZone, "id">) {
  const zone: DeliveryZone = { id: createId(), ...(await validateZone(restaurantId, input)) };
  await zones.insertZones(restaurantId, [zone]);
  return zone;
}

export async function updateDeliveryZone(restaurantId: string, id: string, input: Omit<DeliveryZone, "id">) {
  if (!(await zones.findZone(restaurantId, id))) throw new NotFoundError("Bairro não encontrado.");
  const zone: DeliveryZone = { id, ...(await validateZone(restaurantId, input, id)) };
  await zones.updateZone(restaurantId, zone);
  return zone;
}

export function deleteDeliveryZone(restaurantId: string, id: string) {
  return zones.deleteZone(restaurantId, id);
}
