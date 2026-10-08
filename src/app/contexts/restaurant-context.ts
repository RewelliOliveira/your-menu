import { createContext } from "react";

export interface RestaurantContextType {
  slug: string;
  setSlug: (slug: string) => void;
}

export const RestaurantContext = createContext<RestaurantContextType>({
  slug: "",
  setSlug: () => {},
});
