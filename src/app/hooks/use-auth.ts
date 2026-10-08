import { useContext } from "react";
import { AuthContext, AuthContextType } from "../contexts/auth-context";

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth deve ser usado dentro de AuthProvider");
  }
  return context;
}
