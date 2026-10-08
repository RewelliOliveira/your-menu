import { useState, useEffect, type ReactNode } from "react";
import { AuthContext } from "./auth-context";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(null);
  const [restaurantId, setRestaurantId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const savedToken = localStorage.getItem("token");
    const savedRestaurantId = localStorage.getItem("restaurantId");

    if (savedToken) setToken(savedToken);
    if (savedRestaurantId) setRestaurantId(savedRestaurantId);

    setIsLoading(false);
  }, []);

  const login = (newToken: string, newRestaurantId?: string) => {
    localStorage.setItem("token", newToken);
    setToken(newToken);

    if (newRestaurantId) {
      localStorage.setItem("restaurantId", newRestaurantId);
      setRestaurantId(newRestaurantId);
    }
  };

  const updateRestaurantId = (newRestaurantId: string) => {
    localStorage.setItem("restaurantId", newRestaurantId);
    setRestaurantId(newRestaurantId);
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("restaurantId");
    setToken(null);
    setRestaurantId(null);
  };

  return (
    <AuthContext.Provider
      value={{
        token,
        restaurantId,
        login,
        updateRestaurantId,
        logout,
        isAuthenticated: !!token,
        isLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
