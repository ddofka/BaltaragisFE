import { Link, useLocation } from 'react-router-dom'
import { ReactNode } from 'react'
import LanguageSwitcher from './LanguageSwitcher'
import { useI18n } from '../contexts/I18nContext'

interface LayoutProps {
  children: ReactNode
}

function Layout({ children }: LayoutProps) {
  const location = useLocation()
  const { t } = useI18n()

  const isActive = (path: string) => {
    if (path === '/') {
      return location.pathname === '/'
    }
    return location.pathname.startsWith(path)
  }

  return (
    <div className="app">
      <header className="header">
        <nav className="nav">
          <div className="nav-brand">
            <Link to="/">Baltaragis</Link>
          </div>
          <ul className="nav-links">
            <li>
              <Link to="/" className={isActive('/') ? 'active' : ''}>
                {t('nav.home')}
              </Link>
            </li>
            <li>
              <Link to="/about" className={isActive('/about') ? 'active' : ''}>
                {t('nav.about')}
              </Link>
            </li>
            <li>
              <Link to="/products" className={isActive('/products') ? 'active' : ''}>
                {t('nav.products')}
              </Link>
            </li>
          </ul>
          <LanguageSwitcher />
        </nav>
      </header>

      <main className="main">
        {children}
      </main>

      <footer className="footer">
        <p>&copy; 2025 Baltaragis. All rights reserved.</p>
      </footer>
    </div>
  )
}

export default Layout
