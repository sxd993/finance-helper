import './App.css';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { Toaster } from 'sonner'


import { ProtectedRoute, PublicRoute } from '@app/providers/router';
import { AuthPage } from '@pages/auth';
import { ConvertsPage, AddConvertsPage } from '@pages/converts';
import { TransactionsPage } from '@/pages/transactions';
import { HomePage } from '@pages/home';
import { SettingsPage } from '@pages/settings';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,
      retry: 1,
    },
  },
});

const router = createBrowserRouter([
  {
    path: '/',
    element: (
      <PublicRoute>
        <AuthPage />
      </PublicRoute>
    ),
  },
  {
    path: '/auth',
    element: (
      <PublicRoute>
        <AuthPage />
      </PublicRoute>
    ),
  },
  {
    path: '/home',
    element: (
      <ProtectedRoute>
        <HomePage />
      </ProtectedRoute>
    ),
  },
  {
    path: '/converts',
    element: (
      <ProtectedRoute>
        <ConvertsPage />
      </ProtectedRoute>
    ),
  },
  {
    path: '/transactions',
    element: (
      <ProtectedRoute>
        <TransactionsPage />
      </ProtectedRoute>
    ),
  },
  {
    path: '/settings',
    element: (
      <ProtectedRoute>
        <SettingsPage />
      </ProtectedRoute>
    ),
  },
  {
    path: '/converts/add-converts',
    element: (
      <ProtectedRoute>
        <AddConvertsPage />
      </ProtectedRoute>
    )
  }
]);

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
      <Toaster position="bottom-right" richColors duration={2000} />
    </QueryClientProvider>
  );
}

export default App;
