import { Navigate } from 'react-router-dom';
import { useAuth } from '../features/auth/hooks/useAuth';
import type { ReactNode } from 'react';
import { Navigation } from '../shared/ui/Navigation';
import { Header } from '../shared/ui/Header';

interface ProtectedRouteProps {
  children: ReactNode;
}

export const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Загрузка...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/auth" replace />;
  }

  return (
    <div className="min-h-screen">
      <Header />
      <main className="pb-20">
        {children}
      </main>
      <Navigation />
    </div>
  );
};