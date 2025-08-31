import "./App.css";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import { Transactions } from "./pages/Transactions";

function App() {
  const queryClient = new QueryClient();
  return (
    <>
    <QueryClientProvider client={queryClient}>
      <Transactions/>
    </QueryClientProvider>
    </>
  )
}

export default App
