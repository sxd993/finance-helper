import { createBrowserRouter } from 'react-router-dom';
import { ProtectedRoute, PublicRoute } from './';

export const Router = createBrowserRouter([
  {
    path: '/',
    element: <PublicRoute />,
    children: [
      {
        index: true,
        lazy: async () => {
          const { AuthPage } = await import('@pages/auth');
          return { Component: AuthPage };
        },
      },
    ],
  },
  {
    path: '/home',
    element: <ProtectedRoute />,
    children: [
      {
        index: true,
        lazy: async () => {
          const { HomePage } = await import('@pages/home');
          return { Component: HomePage };
        },
      },
    ],
  },
  {
    path: '/converts',
    element: <ProtectedRoute />,
    children: [
      {
        path: 'add-converts',
        lazy: async () => {
          const { AddConvertsPage } = await import('@pages/converts');
          return { Component: AddConvertsPage };
        },
      },
      {
        path: 'edit/:type_code',
        lazy: async () => {
          const { ConvertByTypePage } = await import('@pages/converts');
          return { Component: ConvertByTypePage };
        },
      },
    ],
  },
  {
    path: '/expenses',
    element: <ProtectedRoute />,
    children: [
      {
        index: true,
        lazy: async () => {
          const { ExpensesPage } = await import('@/pages/expenses');
          return { Component: ExpensesPage };
        },
      },
      {
        path: 'add-expense',
        lazy: async () => {
          const { AddExpensesPage } = await import('@pages/expenses');
          return { Component: AddExpensesPage };
        },
      },
    ],
  },
  {
    path: '/settings',
    element: <ProtectedRoute />,
    children: [
      {
        index: true,
        lazy: async () => {
          const { SettingsPage } = await import('@pages/settings');
          return { Component: SettingsPage };
        },
      },
    ],
  },
  {
    path: '*',
    lazy: async () => {
      const { NotFoundPage } = await import('@pages/not-found');
      return { Component: NotFoundPage };
    },
  },
]);
