import { db } from "../database/connection";
import { roundMoney } from "../domain/money";
import { AppError, ConflictError, NotFoundError } from "../errors/app-error";
import * as menu from "../repositories/menu-repository";
import type { Category, Dish, DishInput, MenuSection } from "../types/menu";
import { createId } from "../utils/id";
import { requireRestaurantBySlug } from "./restaurant-service";

const MAX_VARIANT_PRICE = 10_000;

async function buildSections(restaurantId: string): Promise<MenuSection[]> {
  const [categories, dishes] = await Promise.all([menu.listCategories(restaurantId), menu.listDishes(restaurantId)]);
  return categories.map((category) => ({
    ...category,
    dishes: dishes.filter((dish) => dish.categoryId === category.id),
  }));
}

export async function getPublicMenu(slug: string) {
  const restaurant = await requireRestaurantBySlug(slug);
  return (await buildSections(restaurant.id)).filter((section) => section.dishes.length > 0);
}

export function getMenu(restaurantId: string) {
  return buildSections(restaurantId);
}

export function getCategories(restaurantId: string) {
  return menu.listCategories(restaurantId);
}

async function validateCategoryName(restaurantId: string, name: string, ignoreId?: string) {
  const trimmed = name.trim();
  if (trimmed.length < 2 || trimmed.length > 40) throw new AppError("O nome deve ter entre 2 e 40 caracteres.");
  const categories = await menu.listCategories(restaurantId);
  if (categories.some((c) => c.id !== ignoreId && c.name.toLowerCase() === trimmed.toLowerCase())) {
    throw new ConflictError("Já existe uma categoria com esse nome.");
  }
  return trimmed;
}

export async function createCategory(restaurantId: string, name: string) {
  const category: Category = { id: createId(), name: await validateCategoryName(restaurantId, name) };
  await menu.insertCategory(restaurantId, category);
  return category;
}

export async function updateCategory(restaurantId: string, id: string, name: string) {
  if (!(await menu.findCategory(restaurantId, id))) throw new NotFoundError("Categoria não encontrada.");
  const category: Category = { id, name: await validateCategoryName(restaurantId, name, id) };
  await menu.updateCategory(restaurantId, category);
  return category;
}

export function deleteCategory(restaurantId: string, id: string) {
  return menu.deleteCategory(restaurantId, id);
}

export async function getDish(restaurantId: string, id: string) {
  const dish = await menu.findDish(restaurantId, id);
  if (!dish) throw new NotFoundError("Prato não encontrado.");
  return dish;
}

async function validateDish(restaurantId: string, input: DishInput, existing?: Dish): Promise<DishInput> {
  const name = input.name.trim();
  if (name.length < 2 || name.length > 80) throw new AppError("O nome deve ter entre 2 e 80 caracteres.");
  if (!(await menu.findCategory(restaurantId, input.categoryId))) throw new AppError("Categoria inválida.");
  if (input.variants.length === 0) throw new AppError("Adicione ao menos uma opção com preço.");
  if (input.variants.some((v) => !v.label.trim() || !(v.price > 0) || v.price > MAX_VARIANT_PRICE)) {
    throw new AppError("Confira os nomes e preços das opções.");
  }
  const ownVariantIds = new Set(existing?.variants.map((variant) => variant.id));
  return {
    ...input,
    name,
    description: input.description.trim().slice(0, 300),
    variants: input.variants.map((v) => ({
      id: v.id && ownVariantIds.has(v.id) ? v.id : createId(),
      label: v.label.trim().slice(0, 40),
      price: roundMoney(v.price),
    })),
  };
}

export async function createDish(restaurantId: string, input: DishInput) {
  const dish: Dish = { ...(await validateDish(restaurantId, input)), id: createId() };
  await db.transaction().execute((trx) => menu.insertDish(restaurantId, dish, trx));
  return dish;
}

export async function updateDish(restaurantId: string, id: string, input: DishInput) {
  const existing = await getDish(restaurantId, id);
  const dish: Dish = { ...(await validateDish(restaurantId, input, existing)), id };
  await db.transaction().execute((trx) => menu.updateDish(restaurantId, dish, trx));
  return dish;
}

export async function setDishAvailability(restaurantId: string, id: string, isAvailable: boolean) {
  if (!(await menu.setDishAvailability(restaurantId, id, isAvailable))) throw new NotFoundError("Prato não encontrado.");
}

export function deleteDish(restaurantId: string, id: string) {
  return menu.deleteDish(restaurantId, id);
}
