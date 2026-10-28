import { db, type DB } from "../database/connection";
import { createId, nowIso } from "../utils/id";

export async function insertUpload(data: { restaurantId: string; mimeType: string; data: Buffer }, executor: DB = db) {
  const id = createId();
  await executor
    .insertInto("uploads")
    .values({ id, restaurant_id: data.restaurantId, mime_type: data.mimeType, data: data.data, created_at: nowIso() })
    .execute();
  return id;
}

export function findUpload(id: string, executor: DB = db) {
  return executor.selectFrom("uploads").select(["mime_type", "data"]).where("id", "=", id).executeTakeFirst();
}
