import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { LoginAdm } from '../features/system-adm/pages/login-adm';
import { RegisterAdm } from '../features/system-adm/pages/register-adm';
import { ProfileRestaurant } from '@/features/system-adm/pages/profile-restaurant';
import { Orders } from '@/features/system-adm/pages/orders';
import { PrivateRoute } from './private-router';
import { RestaurantAdress } from '@/features/system-adm/pages/restaurant-adress';
import { EditMenu } from '@/features/system-adm/pages/edit-menu';
import { RestaurantDelivery } from '@/features/system-adm/pages/restaurant-delivery';
import { AddOrder } from '@/features/system-adm/pages/add-order';
import { AddDish } from '@/features/system-adm/pages/add-dish';

export function Router() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginAdm />} />
        <Route path="/register" element={<RegisterAdm />} />

        <Route
          path="/edit-menu"
          element={
            <PrivateRoute>
              <EditMenu />
            </PrivateRoute>
          }
        />
        <Route
          path="/orders"
          element={
            <PrivateRoute>
              <Orders />
            </PrivateRoute>
          }
        />
        <Route
          path="/profile-restaurant"
          element={
            <PrivateRoute>
              <ProfileRestaurant />
            </PrivateRoute>
          }
        />
        <Route
          path="/restaurant-adress"
          element={
            <PrivateRoute>
              <RestaurantAdress />
            </PrivateRoute>
          }
        />
        <Route
          path="/restaurant-delivery"
          element={
            <PrivateRoute>
              <RestaurantDelivery />
            </PrivateRoute>
          }
        />
        <Route
          path="/add-order"
          element={
            <PrivateRoute>
              <AddOrder />
            </PrivateRoute>
          }
        />
        <Route
          path="/add-dish"
          element={
            <PrivateRoute>
              <AddDish />
            </PrivateRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}
