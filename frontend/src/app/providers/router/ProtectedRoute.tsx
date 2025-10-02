import type { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';

import { useUser } from '@/entities/user';
import { Header } from '@widgets/header';
import { Navigation } from '@widgets/navigation';

interface ProtectedRouteProps {
  children: ReactNode;
}

export const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { user, isAuthenticated, isLoading } = useUser();


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