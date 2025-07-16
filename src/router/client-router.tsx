import { Routes, Route } from "react-router-dom";
import { MenuClient } from "@/features/system-client/pages/menu-client";

export default function ClientRoutes() {
  return (
    <Routes>
      <Route path="/" element={<MenuClient />} />
    </Routes>
  );
}
