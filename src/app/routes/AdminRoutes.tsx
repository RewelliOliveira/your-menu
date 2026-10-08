import { Routes, Route } from "react-router-dom";
import { LoginAdm } from "../modules/admin/pages/LoginAdm";
import { RegisterAdm } from "../modules/admin/pages/RegisterAdm";
import { OrdersPage } from "../modules/admin/pages/OrdersPage";
import { EditMenuPage } from "../modules/admin/pages/EditMenuPage";
import { AddOrderPage } from "../modules/admin/pages/AddOrderPage";
import { EditOrderPage } from "../modules/admin/pages/EditOrderPage";
import { ProfileRestaurantPage } from "../modules/admin/pages/ProfileRestaurantPage";
import { RestaurantAddressPage } from "../modules/admin/pages/RestaurantAddressPage";
import { RestaurantDeliveryPage } from "../modules/admin/pages/RestaurantDeliveryPage";
import { PrivateRoute } from "./PrivateRoute";

export function AdminRoutes() {
  return (
    <Routes>
      <Route path="/adm" element={<LoginAdm />} />
      <Route path="/adm/register" element={<RegisterAdm />} />
      <Route
        path="/adm/orders"
        element={
          <PrivateRoute>
            <OrdersPage />
          </PrivateRoute>
        }
      />
      <Route
        path="/adm/edit-menu"
        element={
          <PrivateRoute>
            <EditMenuPage />
          </PrivateRoute>
        }
      />
      <Route
        path="/adm/add-order"
        element={
          <PrivateRoute>
            <AddOrderPage />
          </PrivateRoute>
        }
      />
      <Route
        path="/adm/edit-order/:dishId"
        element={
          <PrivateRoute>
            <EditOrderPage />
          </PrivateRoute>
        }
      />
      <Route
        path="/adm/profile-restaurant"
        element={
          <PrivateRoute>
            <ProfileRestaurantPage />
          </PrivateRoute>
        }
      />
      <Route
        path="/adm/restaurant-adress"
        element={
          <PrivateRoute>
            <RestaurantAddressPage />
          </PrivateRoute>
        }
      />
      <Route
        path="/adm/restaurant-delivery"
        element={
          <PrivateRoute>
            <RestaurantDeliveryPage />
          </PrivateRoute>
        }
      />
    </Routes>
  );
}
