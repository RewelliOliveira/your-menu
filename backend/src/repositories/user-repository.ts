import { db, type DB } from "../database/connection";
import type { UserRow } from "../database/schema";
import type { User } from "../types/auth";
import { createId, nowIso } from "../utils/id";

export const toUser = (row: UserRow): User => ({ id: row.id, name: row.name, email: row.email });

export function findUserByEmail(email: string, executor: DB = db) {
  return executor.selectFrom("users").selectAll().where("email", "=", email).executeTakeFirst();
}

export function findUserById(id: string, executor: DB = db) {
  return executor.selectFrom("users").selectAll().where("id", "=", id).executeTakeFirst();
}

export async function createUser(data: { name: string; email: string; passwordHash: string }, executor: DB = db) {
  const row: UserRow = {
    id: createId(),
    name: data.name,
    email: data.email,
    password_hash: data.passwordHash,
    created_at: nowIso(),
  };
  await executor.insertInto("users").values(row).execute();
  return row;
}
