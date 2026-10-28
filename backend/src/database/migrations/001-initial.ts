import type { Kysely } from "kysely";

import { env } from "../../config/env";

const binaryType = env.DB_CLIENT === "postgres" ? "bytea" : "blob";

export async function up(db: Kysely<unknown>) {
  await db.schema
    .createTable("users")
    .addColumn("id", "text", (col) => col.primaryKey())
    .addColumn("name", "text", (col) => col.notNull())
    .addColumn("email", "text", (col) => col.notNull().unique())
    .addColumn("password_hash", "text", (col) => col.notNull())
    .addColumn("created_at", "text", (col) => col.notNull())
    .execute();

  await db.schema
    .createTable("restaurants")
    .addColumn("id", "text", (col) => col.primaryKey())
    .addColumn("user_id", "text", (col) => col.notNull().references("users.id").onDelete("cascade"))
    .addColumn("slug", "text", (col) => col.notNull().unique())
    .addColumn("name", "text", (col) => col.notNull())
    .addColumn("description", "text", (col) => col.notNull().defaultTo(""))
    .addColumn("logo_url", "text")
    .addColumn("banner_url", "text")
    .addColumn("delivery_time_min", "integer", (col) => col.notNull())
    .addColumn("delivery_time_max", "integer", (col) => col.notNull())
    .addColumn("is_open", "integer", (col) => col.notNull())
    .addColumn("pickup_enabled", "integer", (col) => col.notNull())
    .addColumn("pix_key", "text", (col) => col.notNull().defaultTo(""))
    .addColumn("created_at", "text", (col) => col.notNull())
    .execute();

  await db.schema
    .createTable("restaurant_addresses")
    .addColumn("restaurant_id", "text", (col) => col.primaryKey().references("restaurants.id").onDelete("cascade"))
    .addColumn("cep", "text", (col) => col.notNull())
    .addColumn("state", "text", (col) => col.notNull())
    .addColumn("city", "text", (col) => col.notNull())
    .addColumn("district", "text", (col) => col.notNull())
    .addColumn("street", "text", (col) => col.notNull())
    .addColumn("number", "text", (col) => col.notNull())
    .addColumn("complement", "text", (col) => col.notNull())
    .addColumn("reference", "text", (col) => col.notNull())
    .execute();

  await db.schema
    .createTable("business_hours")
    .addColumn("restaurant_id", "text", (col) => col.notNull().references("restaurants.id").onDelete("cascade"))
    .addColumn("weekday", "text", (col) => col.notNull())
    .addColumn("is_open", "integer", (col) => col.notNull())
    .addColumn("opening_time", "text", (col) => col.notNull())
    .addColumn("closing_time", "text", (col) => col.notNull())
    .addPrimaryKeyConstraint("business_hours_pk", ["restaurant_id", "weekday"])
    .execute();

  await db.schema
    .createTable("delivery_zones")
    .addColumn("id", "text", (col) => col.primaryKey())
    .addColumn("restaurant_id", "text", (col) => col.notNull().references("restaurants.id").onDelete("cascade"))
    .addColumn("name", "text", (col) => col.notNull())
    .addColumn("fee_cents", "integer", (col) => col.notNull())
    .execute();

  await db.schema
    .createTable("categories")
    .addColumn("id", "text", (col) => col.primaryKey())
    .addColumn("restaurant_id", "text", (col) => col.notNull().references("restaurants.id").onDelete("cascade"))
    .addColumn("name", "text", (col) => col.notNull())
    .addColumn("position", "integer", (col) => col.notNull())
    .execute();

  await db.schema
    .createTable("dishes")
    .addColumn("id", "text", (col) => col.primaryKey())
    .addColumn("restaurant_id", "text", (col) => col.notNull().references("restaurants.id").onDelete("cascade"))
    .addColumn("category_id", "text", (col) => col.notNull().references("categories.id").onDelete("cascade"))
    .addColumn("name", "text", (col) => col.notNull())
    .addColumn("description", "text", (col) => col.notNull())
    .addColumn("image_url", "text")
    .addColumn("is_available", "integer", (col) => col.notNull())
    .addColumn("position", "integer", (col) => col.notNull())
    .execute();

  await db.schema
    .createTable("dish_variants")
    .addColumn("id", "text", (col) => col.primaryKey())
    .addColumn("dish_id", "text", (col) => col.notNull().references("dishes.id").onDelete("cascade"))
    .addColumn("label", "text", (col) => col.notNull())
    .addColumn("price_cents", "integer", (col) => col.notNull())
    .addColumn("position", "integer", (col) => col.notNull())
    .execute();

  await db.schema
    .createTable("orders")
    .addColumn("id", "text", (col) => col.primaryKey())
    .addColumn("restaurant_id", "text", (col) => col.notNull().references("restaurants.id").onDelete("cascade"))
    .addColumn("number", "integer", (col) => col.notNull())
    .addColumn("tracking_code", "text", (col) => col.notNull().unique())
    .addColumn("created_at", "text", (col) => col.notNull())
    .addColumn("status", "text", (col) => col.notNull())
    .addColumn("fulfillment", "text", (col) => col.notNull())
    .addColumn("customer_name", "text", (col) => col.notNull())
    .addColumn("customer_phone", "text", (col) => col.notNull())
    .addColumn("address_zone_id", "text")
    .addColumn("address_zone_name", "text")
    .addColumn("address_cep", "text")
    .addColumn("address_street", "text")
    .addColumn("address_number", "text")
    .addColumn("address_complement", "text")
    .addColumn("address_reference", "text")
    .addColumn("payment_method", "text", (col) => col.notNull())
    .addColumn("change_for_cents", "integer")
    .addColumn("note", "text", (col) => col.notNull())
    .addColumn("subtotal_cents", "integer", (col) => col.notNull())
    .addColumn("delivery_fee_cents", "integer", (col) => col.notNull())
    .addColumn("total_cents", "integer", (col) => col.notNull())
    .addUniqueConstraint("orders_restaurant_number_unique", ["restaurant_id", "number"])
    .execute();

  await db.schema.createIndex("orders_restaurant_created_idx").on("orders").columns(["restaurant_id", "created_at"]).execute();

  await db.schema
    .createTable("order_items")
    .addColumn("id", "text", (col) => col.primaryKey())
    .addColumn("order_id", "text", (col) => col.notNull().references("orders.id").onDelete("cascade"))
    .addColumn("position", "integer", (col) => col.notNull())
    .addColumn("dish_id", "text", (col) => col.notNull())
    .addColumn("variant_id", "text", (col) => col.notNull())
    .addColumn("dish_name", "text", (col) => col.notNull())
    .addColumn("variant_label", "text", (col) => col.notNull())
    .addColumn("image_url", "text")
    .addColumn("unit_price_cents", "integer", (col) => col.notNull())
    .addColumn("quantity", "integer", (col) => col.notNull())
    .addColumn("note", "text", (col) => col.notNull())
    .execute();

  await db.schema.createIndex("order_items_order_idx").on("order_items").column("order_id").execute();

  await db.schema
    .createTable("transactions")
    .addColumn("id", "text", (col) => col.primaryKey())
    .addColumn("restaurant_id", "text", (col) => col.notNull().references("restaurants.id").onDelete("cascade"))
    .addColumn("type", "text", (col) => col.notNull())
    .addColumn("category", "text", (col) => col.notNull())
    .addColumn("description", "text", (col) => col.notNull())
    .addColumn("amount_cents", "integer", (col) => col.notNull())
    .addColumn("date", "text", (col) => col.notNull())
    .execute();

  await db.schema.createIndex("transactions_restaurant_date_idx").on("transactions").columns(["restaurant_id", "date"]).execute();

  await db.schema
    .createTable("uploads")
    .addColumn("id", "text", (col) => col.primaryKey())
    .addColumn("restaurant_id", "text", (col) => col.notNull().references("restaurants.id").onDelete("cascade"))
    .addColumn("mime_type", "text", (col) => col.notNull())
    .addColumn("data", binaryType, (col) => col.notNull())
    .addColumn("created_at", "text", (col) => col.notNull())
    .execute();
}

export async function down(db: Kysely<unknown>) {
  const tables = [
    "uploads",
    "transactions",
    "order_items",
    "orders",
    "dish_variants",
    "dishes",
    "categories",
    "delivery_zones",
    "business_hours",
    "restaurant_addresses",
    "restaurants",
    "users",
  ];
  for (const table of tables) await db.schema.dropTable(table).ifExists().execute();
}
