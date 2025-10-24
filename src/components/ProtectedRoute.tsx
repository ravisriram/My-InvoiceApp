import React from 'react';
import { useInvoiceStore } from '../store/useInvoiceStore';
import { LoginForm } from './auth/LoginForm';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const isAuthenticated = useInvoiceStore((state) => state.isAuthenticated);

  if (!isAuthenticated) {
    return <LoginForm />;
  }

  return <>{children}</>;
};