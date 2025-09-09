import { Navigate } from 'react-router-dom';
import { useAuth } from '../features/auth/hooks/useAuth';
import type { ReactNode } from 'react';
import { Navigation } from '../shared/ui/Navigation';
import { Header } from './Header';
import { useMockUser } from '../shared/hooks/useMockUser';

interface ProtectedRouteProps {
  children: ReactNode;
}

export const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { isAuthenticated, isLoading } = useAuth();
  const { user } = useMockUser();


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
    <>
      <Header user={user} />
      <main className="pb-20">
        {children}
      </main>
      <Navigation />
    </>
  );
};