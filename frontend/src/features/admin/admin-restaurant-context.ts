import { createContext, useContext } from "react";

import type { Restaurant } from "@/types/restaurant";

interface AdminRestaurantContextValue {
  restaurant: Restaurant;
  setRestaurant: (restaurant: Restaurant) => void;
}

export const AdminRestaurantContext = createContext<AdminRestaurantContextValue | null>(null);

export function useAdminRestaurant() {
  const context = useContext(AdminRestaurantContext);
  if (!context) throw new Error("useAdminRestaurant deve ser usado dentro do AdminLayout.");
  return context;
}
