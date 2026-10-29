import { db, type DB } from "../database/connection";
import type { CategoryRow, DishRow, DishVariantRow } from "../database/schema";
import { fromCents, toCents } from "../domain/money";
import type { Category, Dish } from "../types/menu";

const toCategory = (row: CategoryRow): Category => ({ id: row.id, name: row.name });

function toDish(row: DishRow, variants: DishVariantRow[]): Dish {
  return {
    id: row.id,
    categoryId: row.category_id,
    name: row.name,
    description: row.description,
    imageUrl: row.image_url,
    isAvailable: Boolean(row.is_available),
    variants: variants
      .filter((variant) => variant.dish_id === row.id)
      .sort((a, b) => a.position - b.position)
      .map((variant) => ({ id: variant.id, label: variant.label, price: fromCents(variant.price_cents) })),
  };
}

export async function listCategories(restaurantId: string, executor: DB = db) {
  const rows = await executor
    .selectFrom("categories")
    .selectAll()
    .where("restaurant_id", "=", restaurantId)
    .orderBy("position")
    .execute();
  return rows.map(toCategory);
}

export async function findCategory(restaurantId: string, id: string, executor: DB = db) {
  const row = await executor
    .selectFrom("categories")
    .selectAll()
    .where("restaurant_id", "=", restaurantId)
    .where("id", "=", id)
    .executeTakeFirst();
  return row && toCategory(row);
}

async function nextPosition(table: "categories" | "dishes", restaurantId: string, executor: DB) {
  const row = await executor
    .selectFrom(table)
    .select((eb) => eb.fn.max("position").as("max"))
    .where("restaurant_id", "=", restaurantId)
    .executeTakeFirst();
  return Number(row?.max ?? -1) + 1;
}

export async function insertCategory(restaurantId: string, category: Category, executor: DB = db) {
  const position = await nextPosition("categories", restaurantId, executor);
  await executor.insertInto("categories").values({ ...category, restaurant_id: restaurantId, position }).execute();
}

export async function updateCategory(restaurantId: string, category: Category, executor: DB = db) {
  await executor
    .updateTable("categories")
    .set({ name: category.name })
    .where("restaurant_id", "=", restaurantId)
    .where("id", "=", category.id)
    .execute();
}

export async function deleteCategory(restaurantId: string, id: string, executor: DB = db) {
  await executor.deleteFrom("categories").where("restaurant_id", "=", restaurantId).where("id", "=", id).execute();
}

export async function listDishes(restaurantId: string, executor: DB = db) {
  const [dishes, variants] = await Promise.all([
    executor.selectFrom("dishes").selectAll().where("restaurant_id", "=", restaurantId).orderBy("position").execute(),
    executor
      .selectFrom("dish_variants")
      .innerJoin("dishes", "dishes.id", "dish_variants.dish_id")
      .selectAll("dish_variants")
      .where("dishes.restaurant_id", "=", restaurantId)
      .execute(),
  ]);
  return dishes.map((dish) => toDish(dish, variants));
}

export async function findDish(restaurantId: string, id: string, executor: DB = db) {
  const row = await executor
    .selectFrom("dishes")
    .selectAll()
    .where("restaurant_id", "=", restaurantId)
    .where("id", "=", id)
    .executeTakeFirst();
  if (!row) return undefined;
  const variants = await executor.selectFrom("dish_variants").selectAll().where("dish_id", "=", id).execute();
  return toDish(row, variants);
}

async function insertVariants(dish: Dish, executor: DB) {
  if (dish.variants.length === 0) return;
  await executor
    .insertInto("dish_variants")
    .values(
      dish.variants.map((variant, position) => ({
        id: variant.id,
        dish_id: dish.id,
        label: variant.label,
        price_cents: toCents(variant.price),
        position,
      })),
    )
    .execute();
}

export async function insertDish(restaurantId: string, dish: Dish, executor: DB = db) {
  const position = await nextPosition("dishes", restaurantId, executor);
  await executor
    .insertInto("dishes")
    .values({
      id: dish.id,
      restaurant_id: restaurantId,
      category_id: dish.categoryId,
      name: dish.name,
      description: dish.description,
      image_url: dish.imageUrl,
      is_available: Number(dish.isAvailable),
      position,
    })
    .execute();
  await insertVariants(dish, executor);
}

export async function updateDish(restaurantId: string, dish: Dish, executor: DB = db) {
  await executor
    .updateTable("dishes")
    .set({
      category_id: dish.categoryId,
      name: dish.name,
      description: dish.description,
      image_url: dish.imageUrl,
      is_available: Number(dish.isAvailable),
    })
    .where("restaurant_id", "=", restaurantId)
    .where("id", "=", dish.id)
    .execute();
  await executor.deleteFrom("dish_variants").where("dish_id", "=", dish.id).execute();
  await insertVariants(dish, executor);
}

export async function setDishAvailability(restaurantId: string, id: string, isAvailable: boolean, executor: DB = db) {
  const result = await executor
    .updateTable("dishes")
    .set({ is_available: Number(isAvailable) })
    .where("restaurant_id", "=", restaurantId)
    .where("id", "=", id)
    .executeTakeFirst();
  return Number(result.numUpdatedRows) > 0;
}

export async function deleteDish(restaurantId: string, id: string, executor: DB = db) {
  await executor.deleteFrom("dishes").where("restaurant_id", "=", restaurantId).where("id", "=", id).execute();
}
