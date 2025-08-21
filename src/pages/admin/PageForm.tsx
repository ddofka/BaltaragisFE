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

      <div className="max-w-6xl">
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                Page Title *
              </label>
              <input
                type="text"
                id="title"
                value={formData.title}
                onChange={(e) => handleTitleChange(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter page title"
                required
              />
            </div>

            <div>
              <label htmlFor="slug" className="block text-sm font-medium text-gray-700 mb-2">
                URL Slug *
              </label>
              <input
                type="text"
                id="slug"
                value={formData.slug}
                onChange={(e) => setFormData(prev => ({ ...prev, slug: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="page-url-slug"
                required
                disabled={mode === 'edit'} // Don't allow editing slug for existing pages
              />
              {mode === 'edit' && (
                <p className="text-xs text-gray-500 mt-1">URL slug cannot be changed for existing pages</p>
              )}
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <label htmlFor="content" className="block text-sm font-medium text-gray-700">
                Page Content (Markdown)
              </label>
              <button
                type="button"
                onClick={() => setPreviewMode(!previewMode)}
                className="text-sm text-blue-600 hover:text-blue-700 font-medium"
              >
                {previewMode ? 'Edit' : 'Preview'}
              </button>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {/* Editor */}
              <div className={previewMode ? 'hidden lg:block' : ''}>
                <textarea
                  id="content"
                  value={formData.contentMd}
                  onChange={(e) => setFormData(prev => ({ ...prev, contentMd: e.target.value }))}
                  rows={20}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-mono text-sm"
                  placeholder="# Page Title

Write your page content here using Markdown syntax.

## Subheading

You can use **bold text**, *italic text*, and [links](https://example.com).

- List item 1
- List item 2"
                />
                <div className="mt-2 text-xs text-gray-500">
                  <p>Supported: # Headers, **bold**, *italic*, [links](url), line breaks</p>
                </div>
              </div>

              {/* Preview */}
              <div className={!previewMode ? 'hidden lg:block' : ''}>
                <div className="border border-gray-300 rounded-lg p-4 h-96 lg:h-auto lg:min-h-[500px] overflow-y-auto bg-gray-50">
                  <div className="bg-white p-6 rounded shadow-sm">
                    {formData.contentMd ? (
                      <div 
                        className="prose max-w-none"
                        dangerouslySetInnerHTML={{ 
                          __html: '<p class="mb-4">' + renderMarkdown(formData.contentMd) + '</p>' 
                        }}
                      />
                    ) : (
                      <p className="text-gray-500 italic">Content preview will appear here...</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div>
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={formData.isPublished}
                onChange={(e) => setFormData(prev => ({ ...prev, isPublished: e.target.checked }))}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="ml-2 text-sm text-gray-700">Publish page</span>
            </label>
            <p className="text-xs text-gray-500 mt-1">
              Published pages will be accessible via /pages/{formData.slug || 'page-slug'}
            </p>
          </div>

          <div className="flex justify-end space-x-4 pt-6 border-t">
            <button
              type="button"
              onClick={() => navigate('/admin/pages')}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center"
            >
              {saving && (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
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
