export interface Category {
  id: string;
  name: string;
}

export interface DishVariant {
  id: string;
  label: string;
  price: number;
}

export interface Dish {
  id: string;
  categoryId: string;
  name: string;
  description: string;
  imageUrl: string | null;
  isAvailable: boolean;
  variants: DishVariant[];
}

export type DishInput = Omit<Dish, "id">;

export interface MenuSection extends Category {
  dishes: Dish[];
}
