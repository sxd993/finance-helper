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
          const { LoginPage } = await import('@pages/auth');
          return { Component: LoginPage };
        },
      },
      {
        path: 'login',
        lazy: async () => {
          const { LoginPage } = await import('@pages/auth');
          return { Component: LoginPage };
        },
      },
      {
        path: 'register',
        lazy: async () => {
          const { RegisterPage } = await import('@pages/auth');
          return { Component: RegisterPage };
        },
      },
    ],
  },
  {
    path: '/privacy-policy',
    lazy: async () => {
      const { PrivacyPolicyPage } = await import('@pages/legal');
      return { Component: PrivacyPolicyPage };
    },
  },
  {
    path: '/personal-data-consent',
    lazy: async () => {
      const { PersonalDataConsentPage } = await import('@pages/legal');
      return { Component: PersonalDataConsentPage };
    },
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
    path: '/remainders',
    element: <ProtectedRoute />,
    children: [
      {
        index: true,
        lazy: async () => {
          const { RemaindersPage } = await import('@pages/remainders');
          return { Component: RemaindersPage };
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
          const { SettingsPage } = await import('@/pages/settings');
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
