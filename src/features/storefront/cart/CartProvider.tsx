import { useCallback, useEffect, useMemo, useState, type ReactNode } from "react";

import { isArray, isObject, readStorage, writeStorage } from "@/lib/storage";
import type { MenuSection } from "@/types/menu";
import { CartContext, type CartLine, type StoredCartItem } from "./cart-context";

const MAX_QUANTITY = 99;

const isStoredCart = (value: unknown): value is StoredCartItem[] =>
  isArray(value) &&
  value.every(
    (item) =>
      isObject(item) &&
      typeof item.dishId === "string" &&
      typeof item.variantId === "string" &&
      typeof item.quantity === "number" &&
      typeof item.note === "string",
  );

export function CartProvider({ slug, menu, children }: { slug: string; menu: MenuSection[]; children: ReactNode }) {
  const storageKey = `cart:${slug}`;
  const [items, setItems] = useState(() => readStorage(storageKey, isStoredCart) ?? []);

  useEffect(() => writeStorage(storageKey, items), [storageKey, items]);

  const lines = useMemo(() => {
    const dishes = new Map(menu.flatMap((section) => section.dishes).map((dish) => [dish.id, dish]));
    return items.flatMap<CartLine>((item) => {
      const dish = dishes.get(item.dishId);
      const variant = dish?.variants.find((v) => v.id === item.variantId);
      if (!dish || !variant || !dish.isAvailable) return [];
      return [{ ...item, dish, variant, total: variant.price * item.quantity }];
    });
  }, [items, menu]);

  const add = useCallback((item: Omit<StoredCartItem, "key">) => {
    const note = item.note.trim();
    const key = `${item.dishId}:${item.variantId}:${note}`;
    setItems((current) => {
      const existing = current.find((i) => i.key === key);
      if (existing) {
        return current.map((i) => (i.key === key ? { ...i, quantity: Math.min(MAX_QUANTITY, i.quantity + item.quantity) } : i));
      }
      return [...current, { ...item, note, key }];
    });
  }, []);

  const setQuantity = useCallback((key: string, quantity: number) => {
    setItems((current) =>
      quantity <= 0
        ? current.filter((i) => i.key !== key)
        : current.map((i) => (i.key === key ? { ...i, quantity: Math.min(MAX_QUANTITY, quantity) } : i)),
    );
  }, []);

  const clear = useCallback(() => setItems([]), []);

  const value = useMemo(
    () => ({
      lines,
      count: lines.reduce((sum, line) => sum + line.quantity, 0),
      subtotal: lines.reduce((sum, line) => sum + line.total, 0),
      add,
      setQuantity,
      clear,
    }),
    [lines, add, setQuantity, clear],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}
