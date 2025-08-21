import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { apiClient } from '../../api/generated'
import { Page } from '../../api/generated/types'
import LoadingSpinner from '../../components/LoadingSpinner'

function PageList() {
  const [pages, setPages] = useState<Page[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [deleteLoading, setDeleteLoading] = useState<number | null>(null)

  useEffect(() => {
    fetchPages()
  }, [])

  const fetchPages = async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await apiClient.getAllPagesAdmin()
      setPages(data)
    } catch (err) {
      console.error('Error fetching pages:', err)
      
      // Provide helpful error message and mock data for development
      setError('Using development page data. API connection failed.')
      
      // Mock data for development when API is not available
      const mockPages: Page[] = [
        {
          id: 1,
          title: "About the Artist",
          slug: "about-artist",
          contentMd: "# About the Artist\n\nExplore the journey and artistic vision behind the contemporary works...",
          isPublished: true,
          createdAt: "2024-01-10T10:00:00Z",
          updatedAt: "2024-01-15T14:30:00Z"
        },
        {
          id: 2,
          title: "Gallery Information",
          slug: "gallery-info",
          contentMd: "# Gallery Information\n\nVisiting hours, location details, and exhibition schedules...",
          isPublished: true,
          createdAt: "2024-01-08T09:00:00Z",
          updatedAt: "2024-01-12T16:45:00Z"
        },
        {
          id: 3,
          title: "Commission Guidelines",
          slug: "commissions",
          contentMd: "# Commission Guidelines\n\nCustom artwork process, pricing, and requirements for commissioned pieces...",
          isPublished: false,
          createdAt: "2024-01-05T11:00:00Z",
          updatedAt: "2024-01-05T11:00:00Z"
        }
      ]
      
      setPages(mockPages)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: number, title: string) => {
    if (!confirm(`Are you sure you want to delete "${title}"? This action cannot be undone.`)) {
      return
    }

    try {
      setDeleteLoading(id)
      await apiClient.deletePage(id)
      setPages(pages.filter(p => p.id !== id))
    } catch (err) {
      alert('Failed to delete page')
      console.error('Error deleting page:', err)
    } finally {
      setDeleteLoading(null)
    }
  }

  const togglePublish = async (page: Page) => {
    try {
      const updated = await apiClient.updatePage(page.id, {
        isPublished: !page.isPublished
      })
      setPages(pages.map(p => p.id === page.id ? updated : p))
    } catch (err) {
      alert('Failed to update page status')
      console.error('Error updating page:', err)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const truncateContent = (content: string, maxLength: number = 100) => {
    if (content.length <= maxLength) return content
    return content.substring(0, maxLength) + '...'
  }

  if (loading) return <LoadingSpinner />

  return (
    <div style={{ 
      maxWidth: '1200px', 
      margin: '0 auto', 
      padding: '32px 16px' 
    }}>
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        marginBottom: '32px',
        flexWrap: 'wrap',
        gap: '16px'
      }}>
        <div style={{ textAlign: 'center', flexGrow: 1 }}>
          <h1 style={{ 
            fontSize: '28px', 
            fontWeight: '600', 
            color: '#111827', 
            margin: '0 0 8px 0' 
          }}>
            Pages
          </h1>
          <p style={{ 
            color: '#6b7280', 
            fontSize: '14px', 
            margin: 0 
          }}>
            Manage your website pages and content
          </p>
        </div>
        <Link
          to="/admin/pages/new"
          style={{
            backgroundColor: '#2563eb',
            color: 'white',
            padding: '8px 16px',
            borderRadius: '6px',
            textDecoration: 'none',
            fontSize: '14px',
            fontWeight: '500',
            display: 'flex',
            alignItems: 'center',
            transition: 'background-color 0.2s'
          }}
          onMouseOver={(e) => (e.target as HTMLElement).style.backgroundColor = '#1d4ed8'}
          onMouseOut={(e) => (e.target as HTMLElement).style.backgroundColor = '#2563eb'}
        >
          <svg style={{ width: '16px', height: '16px', marginRight: '8px' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Add Page
        </Link>
      </div>

      {error && (
        <div style={{
          backgroundColor: '#fef3c7',
          border: '1px solid #fbbf24',
          color: '#92400e',
          padding: '12px 16px',
          borderRadius: '8px',
          marginBottom: '24px',
          fontSize: '14px'
        }}>
          ⚠️ {error}
        </div>
      )}

      {pages.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '48px 0' }}>
          <svg style={{ 
            width: '48px', 
            height: '48px', 
            color: '#9ca3af', 
            margin: '0 auto 16px auto' 
          }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <h3 style={{ 
            margin: '8px 0 4px 0', 
            fontSize: '14px', 
            fontWeight: '500', 
            color: '#111827' 
          }}>
            No pages
          </h3>
          <p style={{ 
            margin: '4px 0 24px 0', 
            fontSize: '14px', 
            color: '#6b7280' 
          }}>
            Get started by creating your first page.
          </p>
          <Link
            to="/admin/pages/new"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              padding: '8px 16px',
              backgroundColor: '#2563eb',
              color: 'white',
              borderRadius: '6px',
              textDecoration: 'none',
              fontSize: '14px',
              fontWeight: '500',
              boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
              transition: 'background-color 0.2s'
            }}
            onMouseOver={(e) => (e.target as HTMLElement).style.backgroundColor = '#1d4ed8'}
            onMouseOut={(e) => (e.target as HTMLElement).style.backgroundColor = '#2563eb'}
          >
            <svg style={{ width: '16px', height: '16px', marginRight: '8px' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Add Page
          </Link>
        </div>
      ) : (
        <div style={{
          backgroundColor: 'white',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
          borderRadius: '8px',
          overflow: 'hidden',
          border: '1px solid #e5e7eb'
        }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '24px',
            padding: '24px'
          }}>
            {pages.map((page) => (
              <div 
                key={page.id} 
                style={{
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  padding: '24px',
                  backgroundColor: 'white',
                  transition: 'box-shadow 0.2s',
                  boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)'
                }}
                onMouseEnter={(e) => (e.target as HTMLElement).style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.1)'}
                onMouseLeave={(e) => (e.target as HTMLElement).style.boxShadow = '0 1px 3px rgba(0, 0, 0, 0.05)'}
              >
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'flex-start', 
                  marginBottom: '16px' 
                }}>
                  <div style={{ flex: 1 }}>
                    <h3 style={{ 
                      fontSize: '18px', 
                      fontWeight: '600', 
                      color: '#111827', 
                      margin: '0 0 4px 0' 
                    }}>
                      {page.title}
                    </h3>
                    <p style={{ 
                      fontSize: '14px', 
                      color: '#6b7280', 
                      fontFamily: 'monospace',
                      margin: 0
                    }}>
                      /{page.slug}
                    </p>
                  </div>
                  <button
                    onClick={() => togglePublish(page)}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      padding: '2px 10px',
                      borderRadius: '9999px',
                      fontSize: '12px',
                      fontWeight: '500',
                      border: 'none',
                      cursor: 'pointer',
                      backgroundColor: page.isPublished ? '#dcfce7' : '#f3f4f6',
                      color: page.isPublished ? '#166534' : '#374151',
                      transition: 'all 0.2s'
                    }}
                  >
                    {page.isPublished ? 'Published' : 'Draft'}
                  </button>
                </div>

                <div style={{ marginBottom: '16px' }}>
                  <p style={{ 
                    fontSize: '14px', 
                    color: '#4b5563', 
                    lineHeight: '1.5',
                    margin: 0,
                    overflow: 'hidden',
                    display: '-webkit-box',
                    WebkitLineClamp: 3,
                    WebkitBoxOrient: 'vertical'
                  }}>
                    {truncateContent(page.contentMd.replace(/[#*`]/g, ''), 120)}
                  </p>
                </div>

                <div style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'space-between', 
                  fontSize: '12px', 
                  color: '#6b7280', 
                  marginBottom: '16px' 
                }}>
                  <span>Updated {formatDate(page.updatedAt)}</span>
                  <span>Created {formatDate(page.createdAt)}</span>
                </div>

                <div style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'space-between' 
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Link
                      to={`/pages/${page.slug}`}
                      style={{
                        color: '#2563eb',
                        transition: 'color 0.2s',
                        display: 'flex',
                        alignItems: 'center',
                        padding: '4px'
                      }}
                      title="View page"
                      onMouseEnter={(e) => (e.target as HTMLElement).style.color = '#1d4ed8'}
                      onMouseLeave={(e) => (e.target as HTMLElement).style.color = '#2563eb'}
                    >
                      <svg style={{ width: '16px', height: '16px' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    </Link>
                    <Link
                      to={`/admin/pages/${page.id}/edit`}
                      style={{
                        color: '#6b7280',
                        transition: 'color 0.2s',
                        display: 'flex',
                        alignItems: 'center',
                        padding: '4px'
                      }}
                      title="Edit page"
                      onMouseEnter={(e) => (e.target as HTMLElement).style.color = '#111827'}
                      onMouseLeave={(e) => (e.target as HTMLElement).style.color = '#6b7280'}
                    >
                      <svg style={{ width: '16px', height: '16px' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </Link>
                  </div>
                  
                  <button
                    onClick={() => handleDelete(page.id, page.title)}
                    disabled={deleteLoading === page.id}
                    style={{
                      color: '#dc2626',
                      background: 'none',
                      border: 'none',
                      cursor: deleteLoading === page.id ? 'not-allowed' : 'pointer',
                      opacity: deleteLoading === page.id ? 0.5 : 1,
                      transition: 'color 0.2s',
                      display: 'flex',
                      alignItems: 'center',
                      padding: '4px'
                    }}
                    title="Delete page"
                    onMouseEnter={(e) => {
                      if (!deleteLoading) {
                        (e.target as HTMLElement).style.color = '#991b1b'
                      }
                    }}
                    onMouseLeave={(e) => (e.target as HTMLElement).style.color = '#dc2626'}
                  >
                    {deleteLoading === page.id ? (
                      <div style={{
                        width: '16px',
                        height: '16px',
                        border: '2px solid #dc2626',
                        borderTop: '2px solid transparent',
                        borderRadius: '50%',
                        animation: 'spin 1s linear infinite'
                      }} />
                    ) : (
                      <svg style={{ width: '16px', height: '16px' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default PageList
