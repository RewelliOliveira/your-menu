import { Routes, Route } from 'react-router-dom';
import { LoginAdm } from '../features/system-adm/pages/login-adm';
import { RegisterAdm } from '../features/system-adm/pages/register-adm';
import { ProfileRestaurant } from '@/features/system-adm/pages/profile-restaurant';
import { Orders } from '@/features/system-adm/pages/orders';
import { PrivateRoute } from './private-router';
import { RestaurantAdress } from '@/features/system-adm/pages/restaurant-adress';
import { EditMenu } from '@/features/system-adm/pages/edit-menu';
import { RestaurantDelivery } from '@/features/system-adm/pages/restaurant-delivery';
import { AddOrder } from '@/features/system-adm/pages/add-order';

export default function AdminRoutes() {
  return (
    <Routes>
      <Route path="/adm" element={<LoginAdm />} />
      <Route path="/adm/register" element={<RegisterAdm />} />
      <Route path="/adm/edit-menu" element={<PrivateRoute><EditMenu /></PrivateRoute>} />
      <Route path="/adm/orders" element={<PrivateRoute><Orders /></PrivateRoute>} />
      <Route path="/adm/profile-restaurant" element={<PrivateRoute><ProfileRestaurant /></PrivateRoute>} />
      <Route path="/adm/restaurant-adress" element={<PrivateRoute><RestaurantAdress /></PrivateRoute>} />
      <Route path="/adm/restaurant-delivery" element={<PrivateRoute><RestaurantDelivery /></PrivateRoute>} />
      <Route path="/adm/add-order" element={<PrivateRoute><AddOrder /></PrivateRoute>} />
    </Routes>
  );
}
