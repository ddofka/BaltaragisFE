import { useState, useEffect } from 'react'
// import { apiClient } from '../../api/generated' // Uncomment when backend is running
import LoadingSpinner from '../../components/LoadingSpinner'

function AdminDashboard() {
  const [stats, setStats] = useState({
    totalProducts: 0,
    publishedProducts: 0,
    totalPages: 0,
    publishedPages: 0,
    totalTranslations: 0
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true)
        
        // Mock data for now since backend might not be running
        // In production, this would fetch from the actual API
        setStats({
          totalProducts: 12,
          publishedProducts: 8,
          totalPages: 5,
          publishedPages: 4,
          totalTranslations: 45
        })
        
        // Uncomment this when backend is running:
        // const [products, pages] = await Promise.all([
        //   apiClient.getAllProductsAdmin(),
        //   apiClient.getAllPagesAdmin()
        // ])
        // let translationCount = 0
        // try {
        //   const translations = await apiClient.getTranslationsByLocale('en-US')
        //   translationCount = translations.length
        // } catch {
        //   // Ignore translation errors for stats
        // }
        // setStats({
        //   totalProducts: products.length,
        //   publishedProducts: products.filter(p => p.isPublished).length,
        //   totalPages: pages.length,
        //   publishedPages: pages.filter(p => p.isPublished).length,
        //   totalTranslations: translationCount
        // })
      } catch (err) {
        setError('Failed to load dashboard stats')
        console.error('Dashboard error:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
  }, [])

  if (loading) return <LoadingSpinner />

  return (
    <div style={{ 
      maxWidth: '1200px', 
      margin: '0 auto', 
      padding: '32px 16px' 
    }}>
      {/* Header */}
      <div style={{ marginBottom: '32px', textAlign: 'center' }}>
        <h1 style={{ 
          fontSize: '28px', 
          fontWeight: '600', 
          color: '#111827', 
          margin: '0 0 8px 0' 
        }}>
          Dashboard
        </h1>
        <p style={{ 
          margin: 0, 
          fontSize: '14px', 
          color: '#6b7280' 
        }}>
          Overview of your website content and quick actions
        </p>
      </div>

      {error && (
        <div style={{ 
          marginBottom: '24px', 
          padding: '16px', 
          backgroundColor: '#fef2f2', 
          border: '1px solid #fecaca', 
          borderRadius: '8px', 
          color: '#dc2626', 
          fontSize: '14px',
          textAlign: 'center'
        }}>
          {error}
        </div>
      )}

      {/* Stats Grid */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', 
        gap: '24px', 
        marginBottom: '32px' 
      }}>
        <div style={{ 
          backgroundColor: 'white', 
          borderRadius: '8px', 
          border: '1px solid #e5e7eb', 
          boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)', 
          padding: '24px' 
        }}>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <div style={{ 
              width: '48px', 
              height: '48px', 
              backgroundColor: '#dbeafe', 
              borderRadius: '8px', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              flexShrink: 0
            }}>
              <svg style={{ width: '24px', height: '24px', color: '#2563eb' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
            </div>
            <div style={{ marginLeft: '16px' }}>
              <p style={{ fontSize: '14px', fontWeight: '500', color: '#6b7280', margin: '0 0 4px 0' }}>Products</p>
              <p style={{ fontSize: '24px', fontWeight: '600', color: '#111827', margin: '0 0 4px 0' }}>
                {stats.publishedProducts}/{stats.totalProducts}
              </p>
              <p style={{ fontSize: '12px', color: '#9ca3af', margin: 0 }}>Published/Total</p>
            </div>
          </div>
        </div>

        <div style={{ 
          backgroundColor: 'white', 
          borderRadius: '8px', 
          border: '1px solid #e5e7eb', 
          boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)', 
          padding: '24px' 
        }}>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <div style={{ 
              width: '48px', 
              height: '48px', 
              backgroundColor: '#dcfce7', 
              borderRadius: '8px', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              flexShrink: 0
            }}>
              <svg style={{ width: '24px', height: '24px', color: '#16a34a' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <div style={{ marginLeft: '16px' }}>
              <p style={{ fontSize: '14px', fontWeight: '500', color: '#6b7280', margin: '0 0 4px 0' }}>Pages</p>
              <p style={{ fontSize: '24px', fontWeight: '600', color: '#111827', margin: '0 0 4px 0' }}>
                {stats.publishedPages}/{stats.totalPages}
              </p>
              <p style={{ fontSize: '12px', color: '#9ca3af', margin: 0 }}>Published/Total</p>
            </div>
          </div>
        </div>

        <div style={{ 
          backgroundColor: 'white', 
          borderRadius: '8px', 
          border: '1px solid #e5e7eb', 
          boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)', 
          padding: '24px' 
        }}>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <div style={{ 
              width: '48px', 
              height: '48px', 
              backgroundColor: '#f3e8ff', 
              borderRadius: '8px', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              flexShrink: 0
            }}>
              <svg style={{ width: '24px', height: '24px', color: '#9333ea' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
              </svg>
            </div>
            <div style={{ marginLeft: '16px' }}>
              <p style={{ fontSize: '14px', fontWeight: '500', color: '#6b7280', margin: '0 0 4px 0' }}>Translations</p>
              <p style={{ fontSize: '24px', fontWeight: '600', color: '#111827', margin: '0 0 4px 0' }}>{stats.totalTranslations}</p>
              <p style={{ fontSize: '12px', color: '#9ca3af', margin: 0 }}>Translation keys</p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div style={{ 
        backgroundColor: 'white', 
        borderRadius: '8px', 
        border: '1px solid #e5e7eb', 
        boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)', 
        padding: '24px' 
      }}>
        <h2 style={{ 
          fontSize: '18px', 
          fontWeight: '600', 
          color: '#111827', 
          margin: '0 0 16px 0',
          textAlign: 'center'
        }}>
          Quick Actions
        </h2>
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
          gap: '12px' 
        }}>
          <a 
            href="/admin/products/new" 
            style={{ 
              display: 'flex', 
              alignItems: 'center', 
              padding: '12px 16px', 
              fontSize: '14px', 
              backgroundColor: '#eff6ff', 
              borderRadius: '8px', 
              border: '1px solid #bfdbfe', 
              textDecoration: 'none',
              transition: 'background-color 0.2s'
            }}
            onMouseOver={(e) => e.target.style.backgroundColor = '#dbeafe'}
            onMouseOut={(e) => e.target.style.backgroundColor = '#eff6ff'}
          >
            <svg style={{ width: '16px', height: '16px', color: '#2563eb', marginRight: '8px' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            <span style={{ color: '#1d4ed8', fontWeight: '500' }}>Add Product</span>
          </a>
          
          <a 
            href="/admin/pages/new" 
            style={{ 
              display: 'flex', 
              alignItems: 'center', 
              padding: '12px 16px', 
              fontSize: '14px', 
              backgroundColor: '#f0fdf4', 
              borderRadius: '8px', 
              border: '1px solid #bbf7d0', 
              textDecoration: 'none',
              transition: 'background-color 0.2s'
            }}
            onMouseOver={(e) => e.target.style.backgroundColor = '#dcfce7'}
            onMouseOut={(e) => e.target.style.backgroundColor = '#f0fdf4'}
          >
            <svg style={{ width: '16px', height: '16px', color: '#16a34a', marginRight: '8px' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            <span style={{ color: '#15803d', fontWeight: '500' }}>Add Page</span>
          </a>
          
          <a 
            href="/admin/translations" 
            style={{ 
              display: 'flex', 
              alignItems: 'center', 
              padding: '12px 16px', 
              fontSize: '14px', 
              backgroundColor: '#faf5ff', 
              borderRadius: '8px', 
              border: '1px solid #d8b4fe', 
              textDecoration: 'none',
              transition: 'background-color 0.2s'
            }}
            onMouseOver={(e) => e.target.style.backgroundColor = '#f3e8ff'}
            onMouseOut={(e) => e.target.style.backgroundColor = '#faf5ff'}
          >
            <svg style={{ width: '16px', height: '16px', color: '#9333ea', marginRight: '8px' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
            <span style={{ color: '#7c3aed', fontWeight: '500' }}>Edit Translations</span>
          </a>
          
          <a 
            href="/admin/artist" 
            style={{ 
              display: 'flex', 
              alignItems: 'center', 
              padding: '12px 16px', 
              fontSize: '14px', 
              backgroundColor: '#fff7ed', 
              borderRadius: '8px', 
              border: '1px solid #fed7aa', 
              textDecoration: 'none',
              transition: 'background-color 0.2s'
            }}
            onMouseOver={(e) => e.target.style.backgroundColor = '#ffedd5'}
            onMouseOut={(e) => e.target.style.backgroundColor = '#fff7ed'}
          >
            <svg style={{ width: '16px', height: '16px', color: '#ea580c', marginRight: '8px' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            <span style={{ color: '#c2410c', fontWeight: '500' }}>Artist Profile</span>
          </a>
        </div>
      </div>
    </div>
  )
}

export default AdminDashboard
