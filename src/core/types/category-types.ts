export interface Category {
  id: number;
  name: string;
  restaurantId: string;
}

export interface CreateCategoryPayload {
  name: string;
  restaurantId: string;
}
