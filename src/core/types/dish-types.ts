export interface SizeOption {
  id: number;
  magnitude: string;
  measureUnit: string;
  abbreviation: string;
}

export interface DishSizePrice {
  dishSizeOptionId: number;
  sizeOptionId: number;
  magnitude: number | null;
  measureUnit: string;
  price: number;
}

export interface DishSizeInput {
  sizeOptionId: number;
  price: number;
}

export interface Dish {
  id: number;
  restaurantId: string;
  categoryId: number;
  name: string;
  description: string;
  isAvailable: boolean;
  imgUrl: string;
  sizeOptionsPrices: DishSizePrice[];
}

export interface DishFormPayload {
  name: string;
  description: string;
  isAvailable: boolean;
  imgUrl: string;
  sizeOptionsPrices: DishSizeInput[];
  imgFile?: File | null;
}
