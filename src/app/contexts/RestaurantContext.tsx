import { useState, useEffect, type ReactNode } from "react";
import { RestaurantContext } from "./restaurant-context";

export function RestaurantProvider({ children }: { children: ReactNode }) {
  const [slug, setSlug] = useState<string>(() => {
    return localStorage.getItem("restaurantSlug") || "your-burger";
  });

  useEffect(() => {
    if (slug) {
      localStorage.setItem("restaurantSlug", slug);
    }
  }, [slug]);

  return (
    <RestaurantContext.Provider value={{ slug, setSlug }}>
      {children}
    </RestaurantContext.Provider>
  );
}
