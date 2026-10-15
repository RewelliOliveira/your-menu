import type { Dish } from "@/types/menu";

export function getStartingPrice(dish: Pick<Dish, "variants">) {
  return dish.variants.length ? Math.min(...dish.variants.map((variant) => variant.price)) : 0;
}
