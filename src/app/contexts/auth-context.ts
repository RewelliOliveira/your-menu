import { createContext } from "react";

export interface AuthContextType {
  token: string | null;
  restaurantId: string | null;
  login: (token: string, restaurantId?: string) => void;
  updateRestaurantId: (newRestaurantId: string) => void;
  logout: () => void;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);
