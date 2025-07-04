import { useAuth } from '@/contexts/auth-context';
import { JSX } from 'react';
import { Navigate } from 'react-router-dom';

interface PrivateRouteProps {
  children: JSX.Element;
}

export function PrivateRoute({ children }: PrivateRouteProps) {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <div>Carregando...</div>; // Pode trocar por um Spinner se quiser
  }

  return isAuthenticated ? children : <Navigate to="/" replace />;
}
