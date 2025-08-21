import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.tsx'
import ErrorBoundary from './components/ErrorBoundary.tsx'
import { I18nProvider } from './contexts/I18nContext.tsx'
import { ConsentProvider } from './contexts/ConsentContext.tsx'
import CookieBanner from './components/CookieBanner.tsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ErrorBoundary>
      <I18nProvider>
        <ConsentProvider>
          <BrowserRouter>
            <App />
            <CookieBanner />
          </BrowserRouter>
        </ConsentProvider>
      </I18nProvider>
    </ErrorBoundary>
  </React.StrictMode>,
)
