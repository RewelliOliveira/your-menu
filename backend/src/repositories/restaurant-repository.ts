import { db, type DB } from "../database/connection";
import type { AddressRow, BusinessHoursRow, RestaurantRow } from "../database/schema";
import type { Weekday } from "../domain/business-hours";
import type { BusinessHours, Restaurant, RestaurantAddress } from "../types/restaurant";

export function toRestaurant(row: RestaurantRow): Restaurant {
  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    description: row.description,
    logoUrl: row.logo_url,
    bannerUrl: row.banner_url,
    deliveryTimeMin: Number(row.delivery_time_min),
    deliveryTimeMax: Number(row.delivery_time_max),
    isOpen: Boolean(row.is_open),
    pickupEnabled: Boolean(row.pickup_enabled),
    pixKey: row.pix_key,
  };
}

const toAddress = ({ restaurant_id: _, ...address }: AddressRow): RestaurantAddress => address;

const toBusinessHours = (row: BusinessHoursRow): BusinessHours => ({
  weekday: row.weekday as Weekday,
  isOpen: Boolean(row.is_open),
  openingTime: row.opening_time,
  closingTime: row.closing_time,
});

export async function findRestaurantById(id: string, executor: DB = db) {
  const row = await executor.selectFrom("restaurants").selectAll().where("id", "=", id).executeTakeFirst();
  return row && toRestaurant(row);
}

export async function findRestaurantBySlug(slug: string, executor: DB = db) {
  const row = await executor.selectFrom("restaurants").selectAll().where("slug", "=", slug).executeTakeFirst();
  return row && toRestaurant(row);
}

export async function findRestaurantByOwner(userId: string, executor: DB = db) {
  const row = await executor.selectFrom("restaurants").selectAll().where("user_id", "=", userId).executeTakeFirst();
  return row && toRestaurant(row);
}

export async function slugExists(slug: string, executor: DB = db) {
  const row = await executor.selectFrom("restaurants").select("id").where("slug", "=", slug).executeTakeFirst();
  return !!row;
}

export async function insertRestaurant(userId: string, restaurant: Restaurant, executor: DB = db) {
  await executor
    .insertInto("restaurants")
    .values({
      id: restaurant.id,
      user_id: userId,
      slug: restaurant.slug,
      name: restaurant.name,
      description: restaurant.description,
      logo_url: restaurant.logoUrl,
      banner_url: restaurant.bannerUrl,
      delivery_time_min: restaurant.deliveryTimeMin,
      delivery_time_max: restaurant.deliveryTimeMax,
      is_open: Number(restaurant.isOpen),
      pickup_enabled: Number(restaurant.pickupEnabled),
      pix_key: restaurant.pixKey,
      created_at: new Date().toISOString(),
    })
    .execute();
}

export async function updateRestaurant(id: string, data: Partial<Omit<Restaurant, "id" | "slug">>, executor: DB = db) {
  await executor
    .updateTable("restaurants")
    .set({
      name: data.name,
      description: data.description,
      logo_url: data.logoUrl,
      banner_url: data.bannerUrl,
      delivery_time_min: data.deliveryTimeMin,
      delivery_time_max: data.deliveryTimeMax,
      is_open: data.isOpen === undefined ? undefined : Number(data.isOpen),
      pickup_enabled: data.pickupEnabled === undefined ? undefined : Number(data.pickupEnabled),
      pix_key: data.pixKey,
    })
    .where("id", "=", id)
    .execute();
}

export async function findAddress(restaurantId: string, executor: DB = db) {
  const row = await executor
    .selectFrom("restaurant_addresses")
    .selectAll()
    .where("restaurant_id", "=", restaurantId)
    .executeTakeFirst();
  return row && toAddress(row);
}

export async function saveAddress(restaurantId: string, address: RestaurantAddress, executor: DB = db) {
  await executor
    .insertInto("restaurant_addresses")
    .values({ restaurant_id: restaurantId, ...address })
    .onConflict((oc) => oc.column("restaurant_id").doUpdateSet(address))
    .execute();
}

export async function listBusinessHours(restaurantId: string, executor: DB = db) {
  const rows = await executor.selectFrom("business_hours").selectAll().where("restaurant_id", "=", restaurantId).execute();
  return rows.map(toBusinessHours);
}

export async function replaceBusinessHours(restaurantId: string, hours: BusinessHours[], executor: DB = db) {
  await executor.deleteFrom("business_hours").where("restaurant_id", "=", restaurantId).execute();
  if (hours.length === 0) return;
  await executor
    .insertInto("business_hours")
    .values(
      hours.map((day) => ({
        restaurant_id: restaurantId,
        weekday: day.weekday,
        is_open: Number(day.isOpen),
        opening_time: day.openingTime,
        closing_time: day.closingTime,
      })),
    )
    .execute();
}
