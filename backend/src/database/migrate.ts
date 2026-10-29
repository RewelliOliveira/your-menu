import { Migrator, type Migration } from "kysely";

import { env } from "../config/env";
import { db } from "./connection";
import * as initial from "./migrations/001-initial";
import { seedDemo } from "./seeds/demo-seed";

const migrations: Record<string, Migration> = {
  "001-initial": initial,
};

export async function migrateToLatest() {
  const migrator = new Migrator({ db, provider: { getMigrations: async () => migrations } });
  const { error } = await migrator.migrateToLatest();
  if (error) throw error;
}

let ready: Promise<void> | null = null;

export function ensureDatabase() {
  ready ??= (async () => {
    await migrateToLatest();
    if (env.SEED_DEMO) await seedDemo(db);
  })().catch((error) => {
    ready = null;
    throw error;
  });
  return ready;
}
