import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <main className='max-w-7xl mx-auto p-4 min-h-screen'>
      <App />
    </main>
  </StrictMode>,
)
