import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'

const registerServiceWorker = () => {
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker
        .register('/sw.js')
        .catch((error) => {
          console.error('Failed to register service worker', error)
        })
    })
  }
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <main className='max-w-7xl mx-auto min-h-screen'>
      <App />
    </main>
  </StrictMode>,
)

registerServiceWorker()
