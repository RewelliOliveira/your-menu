import {
  mockCreateDish,
  mockGetDishesByCategory,
  mockDeleteDish,
  MockDish,
} from "@/mocks/products";

export interface DishSizeOption {
  sizeOptionId: number;
  price: number;
}

export interface CreateDishPayload {
  name: string;
  description: string;
  isAvailable: boolean;
  imgUrl: string;
  sizeOptionsPrices: DishSizeOption[];
  imgFile?: File | null;
}

export interface Prato {
  id: number;
  restaurantId: string;
  categoryId: number;
  name: string;
  description: string;
  isAvailable: boolean;
  imgUrl: string;
  sizeOptionsPrices: {
    dishSizeOptionId: number;
    sizeOptionId: number;
    magnitude: number | null;
    measureUnit: string;
    price: number;
  }[];
}

function mapMockDishToPrato(dish: MockDish): Prato {
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

export async function createDishApi(
  restaurantId: string,
  categoryId: number,
  data: CreateDishPayload,
  _token?: string
): Promise<Prato> {
  const newDish = await mockCreateDish(restaurantId, categoryId, {
    name: data.name,
    description: data.description,
    isAvailable: data.isAvailable,
    imgUrl: data.imgUrl,
    sizeOptionsPrices: data.sizeOptionsPrices,
    imgFile: data.imgFile,
  });
  return mapMockDishToPrato(newDish);
}

export async function getPratosPorCategoria(
  _restaurantId: string,
  categoryId: number,
  _token?: string
): Promise<Prato[]> {
  const dishes = await mockGetDishesByCategory(categoryId);
  return dishes.map(mapMockDishToPrato);
}

export async function deleteDishApi(
  _restaurantId: string,
  _categoryId: number,
  dishId: number,
  _token?: string
): Promise<void> {
  await mockDeleteDish(dishId);
}
