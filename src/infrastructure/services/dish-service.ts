import { Dish, DishFormPayload, SizeOption } from "@/core/types/dish-types";
import {
  mockCreateDish,
  mockDeleteDish,
  mockGetDishById,
  mockGetDishesByCategory,
  mockGetSizeOptions,
  mockUpdateDish,
} from "../mocks/product-mock";

export async function getSizeOptionsApi(_token?: string): Promise<SizeOption[]> {
  return await mockGetSizeOptions();
}

export async function createDishApi(
  restaurantId: string,
  categoryId: number,
  data: DishFormPayload,
  _token?: string
): Promise<Dish> {
  return await mockCreateDish(restaurantId, categoryId, data);
}

export async function getPratosPorCategoria(
  _restaurantId: string,
  categoryId: number,
  _token?: string
): Promise<Dish[]> {
  return await mockGetDishesByCategory(categoryId);
}

export async function getDishDetails(
  _restaurantId: string,
  dishId: number,
  _token?: string
): Promise<Dish | null> {
  return await mockGetDishById(dishId);
}

export async function updateDishApi(
  _restaurantId: string,
  categoryId: number,
  dishId: number,
  data: DishFormPayload,
  _token?: string
): Promise<Dish> {
  return await mockUpdateDish(dishId, categoryId, data);
}

export async function deleteDishApi(
  _restaurantId: string,
  _categoryId: number,
  dishId: number,
  _token?: string
): Promise<void> {
  await mockDeleteDish(dishId);
}
