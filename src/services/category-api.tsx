import {
  mockGetCategories,
  mockCreateCategory,
  mockDeleteCategory,
} from "@/mocks/products";

export interface CategoryApi {
  Id: number;
  name: string;
  restaurantId: string;
}

export async function createCategoryApi(
  restaurantId: string,
  categoryName: string,
  _token?: string
): Promise<CategoryApi> {
  const newCat = await mockCreateCategory(restaurantId, categoryName);
  return {
    Id: newCat.Id,
    name: newCat.name,
    restaurantId: newCat.restaurantId,
  };
}

export async function getCategoriesApi(
  restaurantId: string,
  _token?: string
): Promise<CategoryApi[]> {
  const list = await mockGetCategories(restaurantId);
  return list.map((c) => ({
    Id: c.Id,
    name: c.name,
    restaurantId: c.restaurantId,
  }));
}

export async function deleteCategoryApi(
  _restaurantId: string,
  categoryId: number,
  _token?: string
): Promise<void> {
  await mockDeleteCategory(categoryId);
}