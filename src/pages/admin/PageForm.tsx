import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { apiClient } from '../../api/generated'
import { CreatePageRequest, UpdatePageRequest } from '../../api/generated/types'
import LoadingSpinner from '../../components/LoadingSpinner'

interface PageFormProps {
  mode: 'create' | 'edit'
}

function PageForm({ mode }: PageFormProps) {
  const navigate = useNavigate()
  const { id } = useParams<{ id: string }>()
  const [loading, setLoading] = useState(mode === 'edit')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [previewMode, setPreviewMode] = useState(false)
  
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    contentMd: '',
    isPublished: false
  })

  useEffect(() => {
    if (mode === 'edit' && id) {
      fetchPage(parseInt(id))
    }
  }, [mode, id])

  const fetchPage = async (pageId: number) => {
    try {
      setLoading(true)
      const page = await apiClient.getPageByIdAdmin(pageId)
      setFormData({
        title: page.title,
        slug: page.slug,
        contentMd: page.contentMd,
        isPublished: page.isPublished
      })
    } catch (err) {
      setError('Failed to load page')
      console.error('Error fetching page:', err)
    } finally {
      setLoading(false)
    }
  }

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
  }

  const handleTitleChange = (title: string) => {
    setFormData(prev => ({
      ...prev,
      title,
      // Auto-generate slug only when creating new page
      ...(mode === 'create' && { slug: generateSlug(title) })
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.title.trim()) {
      setError('Page title is required')
      return
    }
    
    if (!formData.slug.trim()) {
      setError('Page slug is required')
      return
    }

    try {
      setSaving(true)
      setError(null)

      if (mode === 'create') {
        const createData: CreatePageRequest = {
          title: formData.title,
          slug: formData.slug,
          contentMd: formData.contentMd || undefined,
          isPublished: formData.isPublished
        }
        await apiClient.createPage(createData)
      } else if (id) {
        const updateData: UpdatePageRequest = {
          title: formData.title,
          contentMd: formData.contentMd || undefined,
          isPublished: formData.isPublished
        }
        await apiClient.updatePage(parseInt(id), updateData)
      }

      navigate('/admin/pages')
    } catch (err: any) {
      if (err.status === 409) {
        setError('A page with this slug already exists')
      } else {
        setError('Failed to save page')
      }
      console.error('Error saving page:', err)
    } finally {
      setSaving(false)
    }
  }

  // Simple markdown preview renderer
  const renderMarkdown = (markdown: string) => {
    return markdown
      .replace(/^# (.*$)/gim, '<h1 class="text-3xl font-bold mb-4">$1</h1>')
      .replace(/^## (.*$)/gim, '<h2 class="text-2xl font-bold mb-3">$1</h2>')
      .replace(/^### (.*$)/gim, '<h3 class="text-xl font-bold mb-2">$1</h3>')
      .replace(/\*\*(.*)\*\*/gim, '<strong class="font-semibold">$1</strong>')
      .replace(/\*(.*)\*/gim, '<em class="italic">$1</em>')
      .replace(/\[([^\]]+)\]\(([^\)]+)\)/gim, '<a href="$2" class="text-blue-600 hover:text-blue-800 underline">$1</a>')
      .replace(/\n\n/gim, '</p><p class="mb-4">')
      .replace(/\n/gim, '<br>')
  }

  if (loading) return <LoadingSpinner />

  return (
    <div style={{ 
      maxWidth: '1200px', 
      margin: '0 auto', 
      padding: '32px 16px' 
    }}>
      <div style={{ marginBottom: '32px', textAlign: 'center' }}>
        <h1 style={{ 
          fontSize: '28px', 
          fontWeight: '600', 
          color: '#111827', 
          margin: '0 0 8px 0' 
        }}>
          {mode === 'create' ? 'Create Page' : 'Edit Page'}
        </h1>
        <p style={{ 
          color: '#6b7280', 
          fontSize: '14px', 
          margin: 0 
        }}>
          {mode === 'create' 
            ? 'Add a new page to your website' 
            : 'Update page content and settings'
          }
        </p>
      </div>

      <div style={{ maxWidth: '1200px' }}>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {error && (
            <div style={{
              backgroundColor: '#fef2f2',
              border: '1px solid #fecaca',
              color: '#dc2626',
              padding: '12px 16px',
              borderRadius: '8px',
              fontSize: '14px'
            }}>
              {error}
            </div>
          )}

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '24px'
          }}>
            <div>
              <label htmlFor="title" style={{
                display: 'block',
                fontSize: '14px',
                fontWeight: '500',
                color: '#374151',
                marginBottom: '8px'
              }}>
                Page Title *
              </label>
              <input
                type="text"
                id="title"
                value={formData.title}
                onChange={(e) => handleTitleChange(e.target.value)}
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  border: '1px solid #d1d5db',
                  borderRadius: '6px',
                  fontSize: '14px',
                  outline: 'none',
                  boxSizing: 'border-box'
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = '#2563eb'
                  e.target.style.boxShadow = '0 0 0 3px rgba(37, 99, 235, 0.1)'
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = '#d1d5db'
                  e.target.style.boxShadow = 'none'
                }}
                placeholder="Enter page title"
                required
              />
            </div>

            <div>
              <label htmlFor="slug" style={{
                display: 'block',
                fontSize: '14px',
                fontWeight: '500',
                color: '#374151',
                marginBottom: '8px'
              }}>
                URL Slug *
              </label>
              <input
                type="text"
                id="slug"
                value={formData.slug}
                onChange={(e) => setFormData(prev => ({ ...prev, slug: e.target.value }))}
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  border: '1px solid #d1d5db',
                  borderRadius: '6px',
                  fontSize: '14px',
                  outline: 'none',
                  boxSizing: 'border-box',
                  backgroundColor: mode === 'edit' ? '#f9fafb' : 'white',
                  color: mode === 'edit' ? '#6b7280' : '#111827'
                }}
                onFocus={(e) => {
                  if (mode !== 'edit') {
                    e.target.style.borderColor = '#2563eb'
                    e.target.style.boxShadow = '0 0 0 3px rgba(37, 99, 235, 0.1)'
                  }
                }}
                onBlur={(e) => {
                  if (mode !== 'edit') {
                    e.target.style.borderColor = '#d1d5db'
                    e.target.style.boxShadow = 'none'
                  }
                }}
                placeholder="page-url-slug"
                required
                disabled={mode === 'edit'}
              />
              {mode === 'edit' && (
                <p style={{
                  fontSize: '12px',
                  color: '#6b7280',
                  marginTop: '4px',
                  margin: '4px 0 0 0'
                }}>
                  URL slug cannot be changed for existing pages
                </p>
              )}
            </div>
          </div>

          <div>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '8px'
            }}>
              <label htmlFor="content" style={{
                display: 'block',
                fontSize: '14px',
                fontWeight: '500',
                color: '#374151'
              }}>
                Page Content (Markdown)
              </label>
              <button
                type="button"
                onClick={() => setPreviewMode(!previewMode)}
                style={{
                  fontSize: '14px',
                  color: '#2563eb',
                  fontWeight: '500',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  transition: 'color 0.2s'
                }}
                onMouseEnter={(e) => (e.target as HTMLElement).style.color = '#1d4ed8'}
                onMouseLeave={(e) => (e.target as HTMLElement).style.color = '#2563eb'}
              >
                {previewMode ? 'Edit' : 'Preview'}
              </button>
            </div>
            
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
              gap: '16px'
            }}>
              {/* Editor */}
              <div style={{
                display: previewMode && window.innerWidth < 1024 ? 'none' : 'block'
              }}>
                <textarea
                  id="content"
                  value={formData.contentMd}
                  onChange={(e) => setFormData(prev => ({ ...prev, contentMd: e.target.value }))}
                  rows={20}
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: '1px solid #d1d5db',
                    borderRadius: '6px',
                    fontFamily: 'monospace',
                    fontSize: '14px',
                    outline: 'none',
                    resize: 'vertical',
                    boxSizing: 'border-box'
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = '#2563eb'
                    e.target.style.boxShadow = '0 0 0 3px rgba(37, 99, 235, 0.1)'
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = '#d1d5db'
                    e.target.style.boxShadow = 'none'
                  }}
                  placeholder="# Page Title

Write your page content here using Markdown syntax.

## Subheading

You can use **bold text**, *italic text*, and [links](https://example.com).

- List item 1
- List item 2"
                />
                <div style={{
                  marginTop: '8px',
                  fontSize: '12px',
                  color: '#6b7280'
                }}>
                  <p style={{ margin: 0 }}>Supported: # Headers, **bold**, *italic*, [links](url), line breaks</p>
                </div>
              </div>

              {/* Preview */}
              <div style={{
                display: !previewMode && window.innerWidth < 1024 ? 'none' : 'block'
              }}>
                <div style={{
                  border: '1px solid #d1d5db',
                  borderRadius: '6px',
                  padding: '16px',
                  height: '500px',
                  overflowY: 'auto',
                  backgroundColor: '#f9fafb'
                }}>
                  <div style={{
                    backgroundColor: 'white',
                    padding: '24px',
                    borderRadius: '6px',
                    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
                  }}>
                    {formData.contentMd ? (
                      <div 
                        style={{
                          maxWidth: 'none',
                          lineHeight: '1.6'
                        }}
                        dangerouslySetInnerHTML={{ 
                          __html: '<p style="margin-bottom: 16px;">' + renderMarkdown(formData.contentMd) + '</p>' 
                        }}
                      />
                    ) : (
                      <p style={{
                        color: '#6b7280',
                        fontStyle: 'italic',
                        margin: 0
                      }}>
                        Content preview will appear here...
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div>
            <label style={{
              display: 'flex',
              alignItems: 'center',
              cursor: 'pointer'
            }}>
              <input
                type="checkbox"
                checked={formData.isPublished}
                onChange={(e) => setFormData(prev => ({ ...prev, isPublished: e.target.checked }))}
                style={{
                  marginRight: '8px',
                  cursor: 'pointer'
                }}
              />
              <span style={{
                fontSize: '14px',
                color: '#374151'
              }}>
                Publish page
              </span>
            </label>
            <p style={{
              fontSize: '12px',
              color: '#6b7280',
              marginTop: '4px',
              margin: '4px 0 0 0'
            }}>
              Published pages will be accessible via /pages/{formData.slug || 'page-slug'}
            </p>
          </div>

          <div style={{
            display: 'flex',
            justifyContent: 'flex-end',
            gap: '16px',
            paddingTop: '24px',
            borderTop: '1px solid #e5e7eb'
          }}>
            <button
              type="button"
              onClick={() => navigate('/admin/pages')}
              style={{
                padding: '8px 16px',
                fontSize: '14px',
                fontWeight: '500',
                color: '#374151',
                backgroundColor: 'white',
                border: '1px solid #d1d5db',
                borderRadius: '6px',
                cursor: 'pointer',
                transition: 'background-color 0.2s'
              }}
              onMouseEnter={(e) => (e.target as HTMLElement).style.backgroundColor = '#f9fafb'}
              onMouseLeave={(e) => (e.target as HTMLElement).style.backgroundColor = 'white'}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              style={{
                display: 'flex',
                alignItems: 'center',
                padding: '8px 16px',
                fontSize: '14px',
                fontWeight: '500',
                color: 'white',
                backgroundColor: '#2563eb',
                border: 'none',
                borderRadius: '6px',
                cursor: saving ? 'not-allowed' : 'pointer',
                opacity: saving ? 0.5 : 1,
                transition: 'background-color 0.2s'
              }}
              onMouseEnter={(e) => {
                if (!saving) {
                  (e.target as HTMLElement).style.backgroundColor = '#1d4ed8'
                }
              }}
              onMouseLeave={(e) => {
                if (!saving) {
                  (e.target as HTMLElement).style.backgroundColor = '#2563eb'
                }
              }}
            >
              {saving && (
                <div style={{
                  width: '16px',
                  height: '16px',
                  border: '2px solid white',
                  borderTop: '2px solid transparent',
                  borderRadius: '50%',
                  animation: 'spin 1s linear infinite',
                  marginRight: '8px'
                }} />
              )}
              {mode === 'create' ? 'Create Page' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default PageForm
