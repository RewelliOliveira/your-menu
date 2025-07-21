import { AddressData } from "@/features/system-client/pages/address-data";
import { CheckOrder } from "@/features/system-client/pages/check-order";
import { MenuClient } from "@/features/system-client/pages/menu-client";
import { PersonalData } from "@/features/system-client/pages/personal-data";
import { Route, Routes } from "react-router-dom";

export default function ClientRoutes() {
  return (
    <Routes>
      <Route path="/" element={<MenuClient />} />
      <Route path="/check-order" element={<CheckOrder />} />
      <Route path="/personal-data" element={<PersonalData />} />
      <Route path="/address-data" element={<AddressData />} />
    </Routes>
  );
}
