import { db, type DB } from "../database/connection";
import type { DeliveryZoneRow } from "../database/schema";
import { fromCents, toCents } from "../domain/money";
import type { DeliveryZone } from "../types/restaurant";

const toZone = (row: DeliveryZoneRow): DeliveryZone => ({ id: row.id, name: row.name, fee: fromCents(row.fee_cents) });

export async function listZones(restaurantId: string, executor: DB = db) {
  const rows = await executor
    .selectFrom("delivery_zones")
    .selectAll()
    .where("restaurant_id", "=", restaurantId)
    .orderBy("name")
    .execute();
  return rows.map(toZone);
}

export async function findZone(restaurantId: string, id: string, executor: DB = db) {
  const row = await executor
    .selectFrom("delivery_zones")
    .selectAll()
    .where("restaurant_id", "=", restaurantId)
    .where("id", "=", id)
    .executeTakeFirst();
  return row && toZone(row);
}

export async function insertZones(restaurantId: string, zones: DeliveryZone[], executor: DB = db) {
  if (zones.length === 0) return;
  await executor
    .insertInto("delivery_zones")
    .values(zones.map((zone) => ({ id: zone.id, restaurant_id: restaurantId, name: zone.name, fee_cents: toCents(zone.fee) })))
    .execute();
}

export async function updateZone(restaurantId: string, zone: DeliveryZone, executor: DB = db) {
  await executor
    .updateTable("delivery_zones")
    .set({ name: zone.name, fee_cents: toCents(zone.fee) })
    .where("restaurant_id", "=", restaurantId)
    .where("id", "=", zone.id)
    .execute();
}

export async function deleteZone(restaurantId: string, id: string, executor: DB = db) {
  await executor.deleteFrom("delivery_zones").where("restaurant_id", "=", restaurantId).where("id", "=", id).execute();
}
