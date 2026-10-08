import { Category } from "@/core/types/category-types";
import { mockCreateCategory, mockDeleteCategory, mockGetCategories } from "../mocks/product-mock";

export async function createCategoryApi(
  restaurantId: string,
  categoryName: string,
  _token?: string
): Promise<Category> {
  return await mockCreateCategory(restaurantId, categoryName);
}

export async function getCategoriesApi(
  restaurantId: string,
  _token?: string
): Promise<Category[]> {
  return await mockGetCategories(restaurantId);
}

export async function deleteCategoryApi(
  _restaurantId: string,
  categoryId: number,
  _token?: string
): Promise<void> {
  await mockDeleteCategory(categoryId);
}
