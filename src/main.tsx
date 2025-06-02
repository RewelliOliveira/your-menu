// src/main.tsx
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

import './index.css';
import { AuthProvider } from './contexts/auth-context';
import { App } from './App';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AuthProvider>
      <App />
    </AuthProvider>
  </StrictMode>
);
