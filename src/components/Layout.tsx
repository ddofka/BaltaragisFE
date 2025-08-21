import { Link, useLocation } from 'react-router-dom'
import { ReactNode } from 'react'
import LanguageSwitcher from './LanguageSwitcher'
import { useI18n } from '../contexts/I18nContext'
import { useConsent } from '../contexts/ConsentContext'

interface LayoutProps {
  children: ReactNode
}

function Layout({ children }: LayoutProps) {
  const location = useLocation()
  const { t, isInitializing } = useI18n()
  const { reopenBanner } = useConsent()

  // Show loading state while locale is being determined
  if (isInitializing) {
    return (
      <div className="app">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading...</p>
        </div>
      </div>
    )
  }

  const isActive = (path: string) => {
    if (path === '/') {
      return location.pathname === '/'
    }
    return location.pathname.startsWith(path)
  }

  return (
    <div className="app">
      <a href="#main-content" className="skip-link">{t('common.skip_to_content')}</a>
      <header className="header" role="banner">
        <nav className="nav" role="navigation" aria-label={t('common.main_navigation')}>
          <div className="nav-brand">
            <Link to="/">Baltaragis</Link>
          </div>
          <ul className="nav-links">
            <li>
              <Link to="/" className={isActive('/') ? 'active' : ''} tabIndex={0}>
                {t('nav.home')}
              </Link>
            </li>
            <li>
              <Link to="/about" className={isActive('/about') ? 'active' : ''} tabIndex={0}>
                {t('nav.about')}
              </Link>
            </li>
            <li>
              <Link to="/products" className={isActive('/products') ? 'active' : ''} tabIndex={0}>
                {t('nav.products')}
              </Link>
            </li>
          </ul>
          <LanguageSwitcher />
        </nav>
      </header>
      <main className="main" id="main-content" role="main" tabIndex={-1}>
        {children}
      </main>
      <footer className="footer" role="contentinfo">
        <div className="footer-content">
          <p>&copy; 2025 Baltaragis. All rights reserved.</p>
          <div className="footer-links">
            <button 
              onClick={reopenBanner}
              className="footer-link footer-consent-link"
              aria-label={t('cookies.manage_preferences')}
            >
              {t('cookies.manage_cookies')}
            </button>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default Layout
