import { Navigate, Outlet, useLocation } from "react-router-dom";

import { useAuth } from "./auth-context";

export function RequireAuth() {
  const { session } = useAuth();
  const location = useLocation();

  if (!session) return <Navigate to="/admin/login" replace state={{ from: location.pathname }} />;
  return <Outlet />;
}

export function RedirectIfAuthenticated() {
  const { session } = useAuth();
  const location = useLocation();
  const from = (location.state as { from?: string } | null)?.from;
  if (!session) return <Outlet />;
  return <Navigate to={from?.startsWith("/admin") ? from : "/admin"} replace />;
}
