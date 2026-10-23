import { createContext, useContext } from "react";

import type { MenuSection } from "@/types/menu";
import type { Storefront } from "@/types/restaurant";

export interface StorefrontContextValue extends Storefront {
  menu: MenuSection[];
  acceptingOrders: boolean;
}

export const StorefrontContext = createContext<StorefrontContextValue | null>(null);

export function useStorefront() {
  const context = useContext(StorefrontContext);
  if (!context) throw new Error("useStorefront deve ser usado dentro do StorefrontLayout.");
  return context;
}
