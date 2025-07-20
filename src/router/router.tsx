import { useLocation } from "react-router-dom";
import AdminRoutes from "./adm-router";
import ClientRoutes from "./client-router";

export function Router() {
  const location = useLocation();
  const isAdmin = location.pathname.startsWith("/adm");

  return isAdmin ? <AdminRoutes /> : <ClientRoutes />;
}
