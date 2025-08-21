import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { apiClient } from '../../api/generated'
import { CreateProductRequest, UpdateProductRequest } from '../../api/generated/types'
import LoadingSpinner from '../../components/LoadingSpinner'

interface ProductFormProps {
  mode: 'create' | 'edit'
}

function ProductForm({ mode }: ProductFormProps) {
  const navigate = useNavigate()
  const { id } = useParams<{ id: string }>()
  const [loading, setLoading] = useState(mode === 'edit')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    shortDesc: '',
    longDesc: '',
    priceCents: 0,
    currency: 'EUR',
    quantity: 0,
    isPublished: false
  })

  useEffect(() => {
    if (mode === 'edit' && id) {
      fetchProduct(parseInt(id))
    }
  }, [mode, id])

  const fetchProduct = async (productId: number) => {
    try {
      setLoading(true)
      const product = await apiClient.getProductByIdAdmin(productId)
      setFormData({
        name: product.name,
        slug: product.slug,
        shortDesc: product.shortDesc,
        longDesc: product.longDesc,
        priceCents: product.priceCents,
        currency: product.currency,
        quantity: product.quantity,
        isPublished: product.isPublished
      })
    } catch (err) {
      setError('Failed to load product')
      console.error('Error fetching product:', err)
    } finally {
      setLoading(false)
    }
  }

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
  }

  const handleNameChange = (name: string) => {
    setFormData(prev => ({
      ...prev,
      name,
      // Auto-generate slug only when creating new product
      ...(mode === 'create' && { slug: generateSlug(name) })
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.name.trim()) {
      setError('Product name is required')
      return
    }
    
    if (!formData.slug.trim()) {
      setError('Product slug is required')
      return
    }

    if (formData.priceCents <= 0) {
      setError('Price must be greater than 0')
      return
    }

    try {
      setSaving(true)
      setError(null)

      if (mode === 'create') {
        const createData: CreateProductRequest = {
          name: formData.name,
          slug: formData.slug,
          shortDesc: formData.shortDesc || undefined,
          longDesc: formData.longDesc || undefined,
          priceCents: formData.priceCents,
          currency: formData.currency || 'EUR',
          quantity: formData.quantity,
          isPublished: formData.isPublished
        }
        await apiClient.createProduct(createData)
      } else if (id) {
        const updateData: UpdateProductRequest = {
          name: formData.name,
          shortDesc: formData.shortDesc || undefined,
          longDesc: formData.longDesc || undefined,
          priceCents: formData.priceCents,
          currency: formData.currency || 'EUR',
          quantity: formData.quantity,
          isPublished: formData.isPublished
        }
        await apiClient.updateProduct(parseInt(id), updateData)
      }

      navigate('/admin/products')
    } catch (err: any) {
      if (err.status === 409) {
        setError('A product with this slug already exists')
      } else {
        setError('Failed to save product')
      }
      console.error('Error saving product:', err)
    } finally {
      setSaving(false)
    }
  }

  const formatPrice = (priceCents: number) => {
    return (priceCents / 100).toFixed(2)
  }

  const handlePriceChange = (priceString: string) => {
    const price = parseFloat(priceString) || 0
    setFormData(prev => ({ ...prev, priceCents: Math.round(price * 100) }))
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
          {mode === 'create' ? 'Create Product' : 'Edit Product'}
        </h1>
        <p style={{ 
          color: '#6b7280', 
          fontSize: '14px', 
          margin: 0 
        }}>
          {mode === 'create' 
            ? 'Add a new product to your catalog' 
            : 'Update product information'
          }
        </p>
      </div>

      <div style={{ 
        maxWidth: '800px', 
        margin: '0 auto',
        backgroundColor: 'white',
        borderRadius: '8px',
        border: '1px solid #e5e7eb',
        boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
        padding: '32px'
      }}>
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

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
            <div>
              <label htmlFor="name" style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '8px' }}>
                Product Name *
              </label>
              <input
                type="text"
                id="name"
                value={formData.name}
                onChange={(e) => handleNameChange(e.target.value)}
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  border: '1px solid #d1d5db',
                  borderRadius: '6px',
                  fontSize: '14px',
                  boxSizing: 'border-box'
                }}
                placeholder="Enter product name"
                required
              />
            </div>

            <div>
              <label htmlFor="slug" style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '8px' }}>
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
                  boxSizing: 'border-box',
                  backgroundColor: mode === 'edit' ? '#f9fafb' : 'white'
                }}
                placeholder="product-url-slug"
                required
                disabled={mode === 'edit'} // Don't allow editing slug for existing products
              />
              {mode === 'edit' && (
                <p style={{ fontSize: '12px', color: '#6b7280', marginTop: '4px', margin: '4px 0 0 0' }}>URL slug cannot be changed for existing products</p>
              )}
            </div>
          </div>

          <div>
            <label htmlFor="shortDesc" className="block text-sm font-medium text-gray-700 mb-2">
              Short Description
            </label>
            <input
              type="text"
              id="shortDesc"
              value={formData.shortDesc}
              onChange={(e) => setFormData(prev => ({ ...prev, shortDesc: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Brief product description"
            />
          </div>

          <div>
            <label htmlFor="longDesc" className="block text-sm font-medium text-gray-700 mb-2">
              Long Description
            </label>
            <textarea
              id="longDesc"
              value={formData.longDesc}
              onChange={(e) => setFormData(prev => ({ ...prev, longDesc: e.target.value }))}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Detailed product description"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-2">
                Price ({formData.currency}) *
              </label>
              <input
                type="number"
                id="price"
                step="0.01"
                min="0"
                value={formatPrice(formData.priceCents)}
                onChange={(e) => handlePriceChange(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="0.00"
                required
              />
            </div>

            <div>
              <label htmlFor="currency" className="block text-sm font-medium text-gray-700 mb-2">
                Currency
              </label>
              <select
                id="currency"
                value={formData.currency}
                onChange={(e) => setFormData(prev => ({ ...prev, currency: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="EUR">EUR (€)</option>
                <option value="USD">USD ($)</option>
                <option value="GBP">GBP (£)</option>
              </select>
            </div>

            <div>
              <label htmlFor="quantity" className="block text-sm font-medium text-gray-700 mb-2">
                Stock Quantity *
              </label>
              <input
                type="number"
                id="quantity"
                min="0"
                value={formData.quantity}
                onChange={(e) => setFormData(prev => ({ ...prev, quantity: parseInt(e.target.value) || 0 }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="0"
                required
              />
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
              <span className="ml-2 text-sm text-gray-700">Publish product</span>
            </label>
            <p className="text-xs text-gray-500 mt-1">
              Published products will be visible to customers on the website
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
              onClick={() => navigate('/admin/products')}
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
              onMouseOver={(e) => (e.target as HTMLElement).style.backgroundColor = '#f9fafb'}
              onMouseOut={(e) => (e.target as HTMLElement).style.backgroundColor = 'white'}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              style={{
                padding: '8px 16px',
                fontSize: '14px',
                fontWeight: '500',
                color: 'white',
                backgroundColor: saving ? '#93c5fd' : '#2563eb',
                border: 'none',
                borderRadius: '6px',
                cursor: saving ? 'not-allowed' : 'pointer',
                transition: 'background-color 0.2s',
                display: 'flex',
                alignItems: 'center'
              }}
              onMouseOver={(e) => {
                if (!saving) (e.target as HTMLElement).style.backgroundColor = '#1d4ed8'
              }}
              onMouseOut={(e) => {
                if (!saving) (e.target as HTMLElement).style.backgroundColor = '#2563eb'
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
              {mode === 'create' ? 'Create Product' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default ProductForm
