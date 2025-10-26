import './App.css';

import { Router } from '@/app/providers/RouterProvider';
import { RouterProvider } from 'react-router-dom';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from '@app/providers/QueryProvider';
import { StoreProvider } from './app/providers/StoreProvider/StoreProvider';
import { Toaster } from 'sonner'
import { AppMantineProvider } from './app/providers/MantineProvider/AppMantineProvider';


function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <StoreProvider>
        <AppMantineProvider>
          <RouterProvider router={Router} />
        </AppMantineProvider>
        <Toaster position="bottom-right" richColors duration={2000} />
      </StoreProvider>
    </QueryClientProvider>
  );
}

export default App;
