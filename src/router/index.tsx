import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { LoginAdm } from '../features/system-adm/pages/login-adm';
import { RegisterAdm } from '../features/system-adm/pages/register-adm';

export function Router() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginAdm />} />
        <Route path="/register" element={<RegisterAdm />} />
      </Routes>
    </BrowserRouter>
  );
}
