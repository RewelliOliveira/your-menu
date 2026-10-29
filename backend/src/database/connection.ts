import { mkdirSync } from "node:fs";
import { dirname } from "node:path";
import SQLite from "better-sqlite3";
import { Kysely, PostgresDialect, SqliteDialect, type Dialect } from "kysely";
import { Pool } from "pg";

import { env } from "../config/env";
import type { Database } from "./schema";

const IN_MEMORY = ":memory:";

function createSqliteDialect(filename: string): Dialect {
  if (filename !== IN_MEMORY) mkdirSync(dirname(filename), { recursive: true });
  const database = new SQLite(filename);
  database.pragma("journal_mode = WAL");
  database.pragma("foreign_keys = ON");
  return new SqliteDialect({ database });
}

function createPostgresDialect(connectionString: string): Dialect {
  return new PostgresDialect({ pool: new Pool({ connectionString, max: 5 }) });
}

export const db = new Kysely<Database>({
  dialect: env.DB_CLIENT === "postgres" ? createPostgresDialect(env.DATABASE_URL) : createSqliteDialect(env.DATABASE_URL),
});

export type DB = Kysely<Database>;
