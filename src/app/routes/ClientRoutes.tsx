import { Routes, Route } from "react-router-dom";
import { MenuClientPage } from "../modules/client/pages/MenuClientPage";
import { CheckOrderPage } from "../modules/client/pages/CheckOrderPage";
import { PersonalDataPage } from "../modules/client/pages/PersonalDataPage";
import { AddressDataPage } from "../modules/client/pages/AddressDataPage";
import { FinalizeOrderPage } from "../modules/client/pages/FinalizeOrderPage";
import { PaymentMethodPage } from "../modules/client/pages/PaymentMethodPage";
import { PixPaymentPage } from "../modules/client/pages/PixPaymentPage";

export function ClientRoutes() {
  return (
    <Routes>
      <Route path="/:restaurantId" element={<MenuClientPage />} />
      <Route path="/check-order" element={<CheckOrderPage />} />
      <Route path="/personal-data" element={<PersonalDataPage />} />
      <Route path="/address-data" element={<AddressDataPage />} />
      <Route path="/finalize-order" element={<FinalizeOrderPage />} />
      <Route path="/payment" element={<PaymentMethodPage />} />
      <Route path="/payment/pix" element={<PixPaymentPage />} />
    </Routes>
  );
}
