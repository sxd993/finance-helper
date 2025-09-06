import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <main className='bg-gray-50 w-full m-auto p-2'>
      <App />
    </main>
  </StrictMode>,
)
