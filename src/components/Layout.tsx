import { Link, useLocation } from 'react-router-dom'
import { ReactNode } from 'react'

interface LayoutProps {
  children: ReactNode
}

function Layout({ children }: LayoutProps) {
  const location = useLocation()

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
                Home
              </Link>
            </li>
            <li>
              <Link to="/about" className={isActive('/about') ? 'active' : ''}>
                About
              </Link>
            </li>
            <li>
              <Link to="/products" className={isActive('/products') ? 'active' : ''}>
                Products
              </Link>
            </li>
          </ul>
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
