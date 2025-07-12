import { createContext, useContext, useState, useEffect } from "react";

interface RestaurantContextType {
  slug: string;
  setSlug: (slug: string) => void;
}

const RestaurantContext = createContext<RestaurantContextType>({
  slug: "",
  setSlug: () => {},
});

export function RestaurantProvider({ children }: { children: React.ReactNode }) {
  const [slug, setSlug] = useState(() => {
    // Tenta carregar do localStorage na inicialização
    return localStorage.getItem("restaurantSlug") || "";
  });

  // Salva slug no localStorage toda vez que mudar
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

export function useRestaurant() {
  return useContext(RestaurantContext);
}
