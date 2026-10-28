import { createContext, useContext } from "react";

import type { Dish, DishVariant } from "@/types/menu";

export interface StoredCartItem {
  key: string;
  dishId: string;
  variantId: string;
  quantity: number;
  note: string;
}

export interface CartLine extends StoredCartItem {
  dish: Dish;
  variant: DishVariant;
  total: number;
}

export interface CartContextValue {
  lines: CartLine[];
  count: number;
  subtotal: number;
  add: (item: Omit<StoredCartItem, "key">) => void;
  setQuantity: (key: string, quantity: number) => void;
  clear: () => void;
}

export const CartContext = createContext<CartContextValue | null>(null);

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart deve ser usado dentro do CartProvider.");
  return context;
}
