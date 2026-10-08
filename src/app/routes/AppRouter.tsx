import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { AdminRoutes } from "./AdminRoutes";
import { ClientRoutes } from "./ClientRoutes";

export function AppRouter() {
  const location = useLocation();
  const navigate = useNavigate();
  const isAdmin = location.pathname.startsWith("/adm");

  useEffect(() => {
    if (location.pathname === "/") {
      navigate("/adm", { replace: true });
    }
  }, [location.pathname, navigate]);

  return isAdmin ? <AdminRoutes /> : <ClientRoutes />;
}
