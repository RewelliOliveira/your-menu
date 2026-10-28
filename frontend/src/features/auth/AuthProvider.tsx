import { useCallback, useEffect, useMemo, useState, type ReactNode } from "react";
import { toast } from "sonner";

import * as authService from "@/services/auth-service";
import type { LoginInput, RegisterInput } from "@/types/auth";
import { AuthContext } from "./auth-context";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState(authService.getSession);

  const logout = useCallback(() => {
    authService.logout();
    setSession(null);
  }, []);

  useEffect(() => {
    const syncSession = () => setSession(authService.getSession());
    window.addEventListener("storage", syncSession);

    let timeout: ReturnType<typeof setTimeout> | undefined;
    if (session) {
      timeout = setTimeout(() => {
        logout();
        toast.info("Sua sessão expirou. Entre novamente.");
      }, session.expiresAt - Date.now());
    }

    return () => {
      window.removeEventListener("storage", syncSession);
      clearTimeout(timeout);
    };
  }, [session, logout]);

  const value = useMemo(
    () => ({
      session,
      logout,
      login: async (input: LoginInput) => setSession(await authService.login(input)),
      register: async (input: RegisterInput) => setSession(await authService.register(input)),
    }),
    [session, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
