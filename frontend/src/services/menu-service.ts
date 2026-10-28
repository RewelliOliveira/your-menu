import { createId } from "@/lib/utils";
import type { Category, Dish, DishInput, MenuSection } from "@/types/menu";
import { ApiError, db, delay, requireAuth, requireRestaurant } from "./mock/db";

function buildSections(categories: Category[], dishes: Dish[]): MenuSection[] {
  return categories.map((category) => ({
    ...category,
    dishes: dishes.filter((dish) => dish.categoryId === category.id),
  }));
}

export async function getPublicMenu(slug: string) {
  requireRestaurant(slug);
  await delay();
  return buildSections(db.categories.get(), db.dishes.get()).filter((section) => section.dishes.length > 0);
}

export async function getMenu() {
  requireAuth();
  await delay();
  return buildSections(db.categories.get(), db.dishes.get());
}

export async function getCategories() {
  requireAuth();
  await delay(150);
  return db.categories.get();
}

function validateCategoryName(name: string, ignoreId?: string) {
  const trimmed = name.trim();
  if (trimmed.length < 2 || trimmed.length > 40) throw new ApiError("O nome deve ter entre 2 e 40 caracteres.");
  const exists = db.categories
    .get()
    .some((c) => c.id !== ignoreId && c.name.toLowerCase() === trimmed.toLowerCase());
  if (exists) throw new ApiError("Já existe uma categoria com esse nome.");
  return trimmed;
}

export async function saveCategory(input: { id?: string; name: string }) {
  requireAuth();
  const name = validateCategoryName(input.name, input.id);
  await delay();

  const categories = db.categories.get();
  const category: Category = { id: input.id ?? createId(), name };
  db.categories.set(
    input.id ? categories.map((c) => (c.id === input.id ? category : c)) : [...categories, category],
  );
  return category;
}

export async function deleteCategory(id: string) {
  requireAuth();
  await delay();
  db.categories.set(db.categories.get().filter((c) => c.id !== id));
  db.dishes.set(db.dishes.get().filter((d) => d.categoryId !== id));
}

export async function getDish(id: string) {
  requireAuth();
  await delay(150);
  const dish = db.dishes.get().find((d) => d.id === id);
  if (!dish) throw new ApiError("Prato não encontrado.", 404);
  return dish;
}

function validateDish(input: DishInput): DishInput {
  const name = input.name.trim();
  if (name.length < 2 || name.length > 80) throw new ApiError("O nome deve ter entre 2 e 80 caracteres.");
  if (!db.categories.get().some((c) => c.id === input.categoryId)) throw new ApiError("Categoria inválida.");
  if (input.variants.length === 0) throw new ApiError("Adicione ao menos uma opção com preço.");
  if (input.variants.some((v) => !v.label.trim() || !(v.price > 0) || v.price > 10_000)) {
    throw new ApiError("Confira os nomes e preços das opções.");
  }
  return {
    ...input,
    name,
    description: input.description.trim().slice(0, 300),
    variants: input.variants.map((v) => ({
      id: v.id || createId(),
      label: v.label.trim().slice(0, 40),
      price: Math.round(v.price * 100) / 100,
    })),
  };
}

export async function saveDish(input: DishInput & { id?: string }) {
  requireAuth();
  const data = validateDish(input);
  await delay();

  const dishes = db.dishes.get();
  const dish: Dish = { ...data, id: input.id ?? createId() };
  db.dishes.set(input.id ? dishes.map((d) => (d.id === input.id ? dish : d)) : [...dishes, dish]);
  return dish;
}

export async function setDishAvailability(id: string, isAvailable: boolean) {
  requireAuth();
  await delay(150);
  db.dishes.set(db.dishes.get().map((d) => (d.id === id ? { ...d, isAvailable } : d)));
}

export async function deleteDish(id: string) {
  requireAuth();
  await delay();
  db.dishes.set(db.dishes.get().filter((d) => d.id !== id));
}
