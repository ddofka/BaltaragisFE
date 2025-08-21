import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.tsx'
import ErrorBoundary from './components/ErrorBoundary.tsx'
import { I18nProvider } from './contexts/I18nContext.tsx'
import { CartProvider } from './contexts/CartContext.tsx'
import { initPerformanceMonitoring } from './utils/performance.ts'
import './index.css'

// Initialize performance monitoring
initPerformanceMonitoring()

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ErrorBoundary>
      <I18nProvider>
        <CartProvider>
          <BrowserRouter>
            <App />
          </BrowserRouter>
        </CartProvider>
      </I18nProvider>
    </ErrorBoundary>
  </React.StrictMode>,
)
