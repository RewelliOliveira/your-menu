import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { LoginAdm } from '../features/system-adm/pages/login-adm';
import { RegisterAdm } from '../features/system-adm/pages/register-adm';
import { ProfileRestaurant } from '@/features/system-adm/pages/profile-restaurant';

export function Router() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginAdm />} />
        <Route path="/register" element={<RegisterAdm />} />
        <Route path="/profile-restaurante" element={<ProfileRestaurant />} />
        
      </Routes>
    </BrowserRouter>
  );
}
