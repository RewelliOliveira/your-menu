import {
  mockUpdateDish,
  mockGetDishById,
} from "@/mocks/products";
import { Prato } from "./create-dish";

export interface DishSizeOption {
  sizeOptionId: number;
  price: number;
}

export interface UpdateDishPayload {
  name: string;
  description: string;
  isAvailable: boolean;
  imgUrl: string;
  sizeOptionsPrices: DishSizeOption[];
  imgFile?: File | null;
}

export async function updateDishApi(
  _restaurantId: string,
  categoryId: number,
  dishId: number,
  data: UpdateDishPayload,
  _token?: string
): Promise<Prato> {
  const updated = await mockUpdateDish(dishId, categoryId, {
    name: data.name,
    description: data.description,
    isAvailable: data.isAvailable,
    imgUrl: data.imgUrl,
    sizeOptionsPrices: data.sizeOptionsPrices,
    imgFile: data.imgFile,
  });

  return {
    id: updated.id,
    restaurantId: updated.restaurantId,
    categoryId: updated.categoryId,
    name: updated.name,
    description: updated.description,
    isAvailable: updated.isAvailable,
    imgUrl: updated.imgUrl,
    sizeOptionsPrices: updated.sizeOptionsPrices,
  };
}

export async function getDishDetails(
  _restaurantId: string,
  dishId: number,
  _token?: string
): Promise<Prato | null> {
  const dish = await mockGetDishById(dishId);
  if (!dish) return null;

  return {
    id: dish.id,
    restaurantId: dish.restaurantId,
    categoryId: dish.categoryId,
    name: dish.name,
    description: dish.description,
    isAvailable: dish.isAvailable,
    imgUrl: dish.imgUrl,
    sizeOptionsPrices: dish.sizeOptionsPrices,
  };
}