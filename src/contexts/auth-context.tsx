import { createContext, useContext, useState, useEffect } from 'react';

interface AuthContextType {
  token: string | null;
  restaurantId: string | null;
  login: (token: string, restaurantId: string) => void;
  logout: () => void;
  isAuthenticated: boolean;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setToken] = useState<string | null>(null);
  const [restaurantId, setRestaurantId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const savedToken = localStorage.getItem('token');
    const savedRestaurantId = localStorage.getItem('restaurantId');

    if (savedToken) setToken(savedToken);
    if (savedRestaurantId) setRestaurantId(savedRestaurantId);

    setIsLoading(false);
  }, []);

  const login = (newToken: string, newRestaurantId: string) => {
    localStorage.setItem('token', newToken);
    localStorage.setItem('restaurantId', newRestaurantId);
    setToken(newToken);
    setRestaurantId(newRestaurantId);
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('restaurantId');
    setToken(null);
    setRestaurantId(null);
  };

  return (
    <AuthContext.Provider
      value={{
        token,
        restaurantId,
        login,
        logout,
        isAuthenticated: !!token,
        isLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de AuthProvider');
  }
  return context;
}
