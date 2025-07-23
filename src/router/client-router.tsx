import { Routes, Route } from "react-router-dom";
import { MenuClient } from "@/features/system-client/pages/menu-client";
import { PaymentMethod } from "@/features/system-client/pages/payment";
import { PixPayment } from "@/features/system-client/pages/pix-payment";

export default function ClientRoutes() {
  return (
    <Routes>
      <Route path="/" element={<MenuClient />} />
      <Route path="/payment" element={<PaymentMethod/>} />
      <Route path="/payment/pix" element={<PixPayment/>} />
    </Routes>
  );
}
