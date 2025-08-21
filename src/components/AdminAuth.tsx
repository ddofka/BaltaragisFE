import { useState, useEffect, ReactNode } from 'react'

interface AdminAuthProps {
  children: ReactNode
}

// Simple admin authentication component
// In a real application, you'd implement proper authentication with JWT tokens, etc.
function AdminAuth({ children }: AdminAuthProps) {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)

  // Simple password - in production, this should be much more secure
  const ADMIN_PASSWORD = 'admin123' // This should be an environment variable

  useEffect(() => {
    // Check if already authenticated (stored in sessionStorage)
    const authToken = sessionStorage.getItem('admin-auth')
    if (authToken === 'authenticated') {
      setIsAuthenticated(true)
    }
    setLoading(false)
  }, [])

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (password === ADMIN_PASSWORD) {
      setIsAuthenticated(true)
      sessionStorage.setItem('admin-auth', 'authenticated')
      setError('')
    } else {
      setError('Invalid password')
      setPassword('')
    }
  }

  const handleLogout = () => {
    setIsAuthenticated(false)
    sessionStorage.removeItem('admin-auth')
    setPassword('')
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (!isAuthenticated) {
    return (
      <div style={{ 
        minHeight: '100vh', 
        backgroundColor: '#f9fafb', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        padding: '16px'
      }}>
        <div style={{ 
          maxWidth: '400px', 
          width: '100%', 
          backgroundColor: 'white', 
          borderRadius: '8px', 
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)', 
          padding: '32px'
        }}>
          <div style={{ textAlign: 'center', marginBottom: '32px' }}>
            <h1 style={{ 
              fontSize: '24px', 
              fontWeight: 'bold', 
              color: '#111827', 
              marginBottom: '8px',
              margin: '0 0 8px 0'
            }}>
              Admin Access
            </h1>
            <p style={{ color: '#6b7280', fontSize: '14px', margin: 0 }}>
              Enter the admin password to continue
            </p>
          </div>

          <form onSubmit={handleLogin}>
            {error && (
              <div style={{ 
                backgroundColor: '#fef2f2', 
                border: '1px solid #fecaca', 
                color: '#dc2626', 
                padding: '12px 16px', 
                borderRadius: '6px', 
                fontSize: '14px',
                marginBottom: '16px'
              }}>
                {error}
              </div>
            )}

            <div style={{ marginBottom: '16px' }}>
              <label htmlFor="password" style={{ 
                display: 'block', 
                fontSize: '14px', 
                fontWeight: '500', 
                color: '#374151', 
                marginBottom: '8px' 
              }}>
                Password
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  border: '1px solid #d1d5db',
                  borderRadius: '6px',
                  fontSize: '14px',
                  boxSizing: 'border-box'
                }}
                placeholder="Enter admin password"
                required
                autoComplete="current-password"
              />
            </div>

            <button
              type="submit"
              style={{
                width: '100%',
                backgroundColor: '#2563eb',
                color: 'white',
                padding: '10px 16px',
                borderRadius: '6px',
                border: 'none',
                fontSize: '14px',
                fontWeight: '500',
                cursor: 'pointer',
                transition: 'background-color 0.2s'
              }}
              onMouseOver={(e) => e.target.style.backgroundColor = '#1d4ed8'}
              onMouseOut={(e) => e.target.style.backgroundColor = '#2563eb'}
            >
              Login
            </button>
          </form>

          <div style={{ 
            marginTop: '24px', 
            paddingTop: '24px', 
            borderTop: '1px solid #e5e7eb' 
          }}>
            <p style={{ 
              fontSize: '12px', 
              color: '#6b7280', 
              textAlign: 'center',
              margin: 0,
              lineHeight: '1.4'
            }}>
              <strong>Development Note:</strong> This is a basic authentication system. 
              In production, implement proper authentication with secure password hashing, 
              JWT tokens, and session management.
            </p>
          </div>
        </div>
      </div>
    )
  }

  // Render children with logout option
  return (
    <div style={{ position: 'relative' }}>
      {/* Logout button */}
      <div style={{ 
        position: 'fixed', 
        top: '16px', 
        right: '16px', 
        zIndex: 1000 
      }}>
        <button
          onClick={handleLogout}
          style={{
            backgroundColor: '#dc2626',
            color: 'white',
            padding: '8px 12px',
            borderRadius: '6px',
            fontSize: '14px',
            border: 'none',
            cursor: 'pointer',
            fontWeight: '500',
            transition: 'background-color 0.2s',
            display: 'flex',
            alignItems: 'center'
          }}
          title="Logout from admin"
          onMouseOver={(e) => e.target.style.backgroundColor = '#b91c1c'}
          onMouseOut={(e) => e.target.style.backgroundColor = '#dc2626'}
        >
          <svg style={{ width: '16px', height: '16px', marginRight: '4px' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
          Logout
        </button>
      </div>
      
      {children}
    </div>
  )
}

export default AdminAuth
