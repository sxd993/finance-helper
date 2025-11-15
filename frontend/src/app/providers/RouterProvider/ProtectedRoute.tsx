import type { ReactNode } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { Header } from '@/widgets/layout/header';
import { Navigation } from '@/widgets/layout/navigation';
import { useUser } from '@/shared/hooks/useUser';

interface ProtectedRouteProps {
  children?: ReactNode;
}

export const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { user, isAuthenticated, isLoading } = useUser();
  console.log(isAuthenticated)


  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Загрузка...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  const content = children ?? <Outlet />;

  return (
    <div className="min-h-screen flex flex-col">
      <Header user={user} />
      <main className='flex-1'>
        {content}
      </main>
      <Navigation />
    </div>
  );
};
