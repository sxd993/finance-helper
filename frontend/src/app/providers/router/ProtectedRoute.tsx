import type { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';

import { useUser } from '@/entities/user';
import { Header } from '@/widgets/layout/header';
import { Navigation } from '@/widgets/layout/navigation';

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
    <div className="min-h-screen flex flex-col">
      <Header user={user} />
      <main className='flex-1'>
        {children}
      </main>
      <Navigation />
    </div>
  );
};
