import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Analytics } from '@vercel/analytics/react'
import './index.css'
import App from './App.tsx'
import { activePort } from './ports'
import { barcelonaFaviconHref } from './components/BarcelonaLogo'

if (activePort.id === 'barcelona') {
  document.querySelector<HTMLLinkElement>('link[rel="icon"]')?.setAttribute('href', barcelonaFaviconHref())
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
    <Analytics />
  </StrictMode>,
)
