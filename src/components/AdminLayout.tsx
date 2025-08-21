import { ReactNode, useState } from 'react'
import { NavLink, useLocation } from 'react-router-dom'

interface AdminLayoutProps {
  children: ReactNode
}

function AdminLayout({ children }: AdminLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const location = useLocation()

  const navigation = [
    {
      name: 'Dashboard',
      href: '/admin',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z" />
        </svg>
      )
    },
    {
      name: 'Products',
      href: '/admin/products',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
        </svg>
      )
    },
    {
      name: 'Pages',
      href: '/admin/pages',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      )
    },
    {
      name: 'Translations',
      href: '/admin/translations',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
        </svg>
      )
    },
    {
      name: 'Artist Profile',
      href: '/admin/artist',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
      )
    }
  ]

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f9fafb' }}>
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div 
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            zIndex: 40,
            display: window.innerWidth >= 1024 ? 'none' : 'block'
          }}
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        bottom: 0,
        width: '250px',
        backgroundColor: 'white',
        borderRight: '1px solid #e5e7eb',
        transform: sidebarOpen || window.innerWidth >= 1024 ? 'translateX(0)' : 'translateX(-100%)',
        transition: 'transform 0.2s ease-in-out',
        zIndex: 50
      }}>
        
        {/* Logo/Header */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          height: '64px',
          padding: '0 16px',
          borderBottom: '1px solid #e5e7eb'
        }}>
          <h1 style={{
            fontSize: '18px',
            fontWeight: '600',
            color: '#111827',
            margin: 0
          }}>
            Admin
          </h1>
          <button
            style={{
              display: window.innerWidth >= 1024 ? 'none' : 'block',
              padding: '4px',
              color: '#9ca3af',
              backgroundColor: 'transparent',
              border: 'none',
              cursor: 'pointer'
            }}
            onClick={() => setSidebarOpen(false)}
          >
            <svg style={{ width: '20px', height: '20px' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Navigation */}
        <nav style={{ marginTop: '16px', padding: '0 12px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            {navigation.map((item) => {
              const isActive = location.pathname === item.href || 
                (item.href !== '/admin' && location.pathname.startsWith(item.href))
              
              return (
                <NavLink
                  key={item.name}
                  to={item.href}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    padding: '8px 12px',
                    fontSize: '14px',
                    fontWeight: '500',
                    borderRadius: '6px',
                    textDecoration: 'none',
                    transition: 'all 0.2s',
                    backgroundColor: isActive ? '#eff6ff' : 'transparent',
                    color: isActive ? '#1d4ed8' : '#374151'
                  }}
                  onClick={() => setSidebarOpen(false)}
                  onMouseOver={(e) => {
                    if (!isActive) {
                      (e.target as HTMLElement).style.backgroundColor = '#f9fafb';
                      (e.target as HTMLElement).style.color = '#111827'
                    }
                  }}
                  onMouseOut={(e) => {
                    if (!isActive) {
                      (e.target as HTMLElement).style.backgroundColor = 'transparent';
                      (e.target as HTMLElement).style.color = '#374151'
                    }
                  }}
                >
                  <span style={{ 
                    marginRight: '12px', 
                    color: isActive ? '#2563eb' : '#9ca3af',
                    width: '20px',
                    height: '20px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    {item.icon}
                  </span>
                  {item.name}
                </NavLink>
              )
            })}
          </div>
        </nav>

        {/* Bottom section */}
        <div style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          padding: '16px',
          borderTop: '1px solid #e5e7eb'
        }}>
          <a 
            href="/" 
            style={{
              display: 'flex',
              alignItems: 'center',
              fontSize: '14px',
              color: '#6b7280',
              textDecoration: 'none',
              transition: 'color 0.2s'
            }}
            onMouseOver={(e) => (e.target as HTMLElement).style.color = '#374151'}
            onMouseOut={(e) => (e.target as HTMLElement).style.color = '#6b7280'}
          >
            <svg style={{ width: '16px', height: '16px', marginRight: '8px' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Website
          </a>
        </div>
      </div>

      {/* Main content */}
      <div style={{ 
        marginLeft: window.innerWidth >= 1024 ? '250px' : '0',
        minHeight: '100vh'
      }}>
        {/* Top navigation */}
        <div style={{
          position: 'sticky',
          top: 0,
          zIndex: 10,
          backgroundColor: 'white',
          borderBottom: '1px solid #e5e7eb'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            height: '56px',
            padding: '0 16px'
          }}>
            <button
              style={{
                display: window.innerWidth >= 1024 ? 'none' : 'block',
                padding: '8px',
                color: '#9ca3af',
                backgroundColor: 'transparent',
                border: 'none',
                cursor: 'pointer'
              }}
              onClick={() => setSidebarOpen(true)}
            >
              <svg style={{ width: '20px', height: '20px' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <span style={{
                fontSize: '14px',
                color: '#6b7280'
              }}>
                Content Management
              </span>
            </div>
          </div>
        </div>

        {/* Page content */}
        <main style={{ flex: 1, backgroundColor: '#f9fafb' }}>
          {children}
        </main>
      </div>
    </div>
  )
}

export default AdminLayout
