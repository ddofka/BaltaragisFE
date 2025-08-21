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
      const data = await apiClient.getAllPagesAdmin()
      setPages(data)
    } catch (err) {
      setError('Failed to load pages')
      console.error('Error fetching pages:', err)
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
          onMouseOver={(e) => e.target.style.backgroundColor = '#1d4ed8'}
          onMouseOut={(e) => e.target.style.backgroundColor = '#2563eb'}
        >
          <svg style={{ width: '16px', height: '16px', marginRight: '8px' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Add Page
        </Link>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg mb-6">
          {error}
        </div>
      )}

      {pages.length === 0 ? (
        <div className="text-center py-12">
          <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-gray-900">No pages</h3>
          <p className="mt-1 text-sm text-gray-500">Get started by creating your first page.</p>
          <div className="mt-6">
            <Link
              to="/admin/pages/new"
              className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Add Page
            </Link>
          </div>
        </div>
      ) : (
        <div className="bg-white shadow-sm rounded-lg overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
            {pages.map((page) => (
              <div key={page.id} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">{page.title}</h3>
                    <p className="text-sm text-gray-500 font-mono">/{page.slug}</p>
                  </div>
                  <button
                    onClick={() => togglePublish(page)}
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      page.isPublished
                        ? 'bg-green-100 text-green-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}
                  >
                    {page.isPublished ? 'Published' : 'Draft'}
                  </button>
                </div>

                <div className="mb-4">
                  <p className="text-sm text-gray-600 line-clamp-3">
                    {truncateContent(page.contentMd.replace(/[#*`]/g, ''), 120)}
                  </p>
                </div>

                <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
                  <span>Updated {formatDate(page.updatedAt)}</span>
                  <span>Created {formatDate(page.createdAt)}</span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Link
                      to={`/pages/${page.slug}`}
                      className="text-blue-600 hover:text-blue-900 transition-colors"
                      title="View page"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    </Link>
                    <Link
                      to={`/admin/pages/${page.id}/edit`}
                      className="text-gray-600 hover:text-gray-900 transition-colors"
                      title="Edit page"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </Link>
                  </div>
                  
                  <button
                    onClick={() => handleDelete(page.id, page.title)}
                    disabled={deleteLoading === page.id}
                    className="text-red-600 hover:text-red-900 transition-colors disabled:opacity-50"
                    title="Delete page"
                  >
                    {deleteLoading === page.id ? (
                      <div className="w-4 h-4 border-2 border-red-600 border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
