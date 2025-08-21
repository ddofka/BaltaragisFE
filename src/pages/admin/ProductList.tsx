import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { apiClient } from '../../api/generated'
import { Product } from '../../api/generated/types'
import LoadingSpinner from '../../components/LoadingSpinner'

function ProductList() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [deleteLoading, setDeleteLoading] = useState<number | null>(null)

  useEffect(() => {
    fetchProducts()
  }, [])

  const fetchProducts = async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await apiClient.getAllProductsAdmin()
      setProducts(data)
    } catch (err) {
      console.error('Error fetching products:', err)
      
      // Provide helpful error message and mock data for development
      setError('Using development product data. API connection failed.')
      
      // Mock data for development when API is not available
      const mockProducts: Product[] = [
        {
          id: 1,
          name: "Ethereal Sunset",
          slug: "ethereal-sunset",
          shortDesc: "A mesmerizing blend of warm colors",
          longDesc: "This contemporary piece captures the essence of golden hour with flowing brushstrokes and vibrant color palette.",
          priceCents: 12500,
          currency: "EUR",
          quantity: 5,
          isPublished: true,
          createdAt: "2024-01-15T10:00:00Z",
          updatedAt: "2024-01-20T14:30:00Z"
        },
        {
          id: 2,
          name: "Urban Dreams",
          slug: "urban-dreams",
          shortDesc: "Contemporary cityscape with abstract elements",
          longDesc: "A modern interpretation of urban life through abstract forms and vibrant energy.",
          priceCents: 8500,
          currency: "EUR",
          quantity: 3,
          isPublished: true,
          createdAt: "2024-01-10T09:00:00Z",
          updatedAt: "2024-01-18T16:45:00Z"
        },
        {
          id: 3,
          name: "Ocean Waves",
          slug: "ocean-waves",
          shortDesc: "Fluid motion in brilliant blues",
          longDesc: "Capturing the eternal dance of ocean waves through flowing forms and azure tones.",
          priceCents: 9500,
          currency: "EUR",
          quantity: 0,
          isPublished: false,
          createdAt: "2024-01-05T11:00:00Z",
          updatedAt: "2024-01-12T13:20:00Z"
        }
      ]
      
      setProducts(mockProducts)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: number, name: string) => {
    if (!confirm(`Are you sure you want to delete "${name}"? This action cannot be undone.`)) {
      return
    }

    try {
      setDeleteLoading(id)
      await apiClient.deleteProduct(id)
      setProducts(products.filter(p => p.id !== id))
    } catch (err) {
      alert('Failed to delete product')
      console.error('Error deleting product:', err)
    } finally {
      setDeleteLoading(null)
    }
  }

  const togglePublish = async (product: Product) => {
    try {
      const updated = await apiClient.updateProduct(product.id, {
        isPublished: !product.isPublished
      })
      setProducts(products.map(p => p.id === product.id ? updated : p))
    } catch (err) {
      alert('Failed to update product status')
      console.error('Error updating product:', err)
    }
  }

  const formatPrice = (priceCents: number, currency: string) => {
    return (priceCents / 100).toLocaleString('en-US', {
      style: 'currency',
      currency: currency || 'EUR'
    })
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
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
            Products
          </h1>
          <p style={{ 
            color: '#6b7280', 
            fontSize: '14px', 
            margin: 0 
          }}>
            Manage your product catalog
          </p>
        </div>
        <Link
          to="/admin/products/new"
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
          Add Product
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

      {products.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '48px 0' }}>
          <svg style={{ 
            width: '48px', 
            height: '48px', 
            color: '#9ca3af', 
            margin: '0 auto 16px auto' 
          }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
          </svg>
          <h3 style={{ 
            margin: '8px 0 4px 0', 
            fontSize: '14px', 
            fontWeight: '500', 
            color: '#111827' 
          }}>
            No products
          </h3>
          <p style={{ 
            margin: '4px 0 24px 0', 
            fontSize: '14px', 
            color: '#6b7280' 
          }}>
            Get started by creating your first product.
          </p>
          <Link
            to="/admin/products/new"
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
            Add Product
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
          <div style={{ overflowX: 'auto' }}>
            <table style={{ 
              width: '100%', 
              borderCollapse: 'collapse' 
            }}>
              <thead style={{ backgroundColor: '#f9fafb' }}>
                <tr>
                  <th style={{
                    padding: '12px 24px',
                    textAlign: 'left',
                    fontSize: '12px',
                    fontWeight: '500',
                    color: '#6b7280',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                    borderBottom: '1px solid #e5e7eb'
                  }}>
                    Product
                  </th>
                  <th style={{
                    padding: '12px 24px',
                    textAlign: 'left',
                    fontSize: '12px',
                    fontWeight: '500',
                    color: '#6b7280',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                    borderBottom: '1px solid #e5e7eb'
                  }}>
                    Status
                  </th>
                  <th style={{
                    padding: '12px 24px',
                    textAlign: 'left',
                    fontSize: '12px',
                    fontWeight: '500',
                    color: '#6b7280',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                    borderBottom: '1px solid #e5e7eb'
                  }}>
                    Price
                  </th>
                  <th style={{
                    padding: '12px 24px',
                    textAlign: 'left',
                    fontSize: '12px',
                    fontWeight: '500',
                    color: '#6b7280',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                    borderBottom: '1px solid #e5e7eb'
                  }}>
                    Stock
                  </th>
                  <th style={{
                    padding: '12px 24px',
                    textAlign: 'left',
                    fontSize: '12px',
                    fontWeight: '500',
                    color: '#6b7280',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                    borderBottom: '1px solid #e5e7eb'
                  }}>
                    Updated
                  </th>
                  <th style={{
                    padding: '12px 24px',
                    textAlign: 'right',
                    fontSize: '12px',
                    fontWeight: '500',
                    color: '#6b7280',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                    borderBottom: '1px solid #e5e7eb'
                  }}>
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody style={{ backgroundColor: 'white' }}>
                {products.map((product, index) => (
                  <tr 
                    key={product.id} 
                    style={{
                      borderBottom: index < products.length - 1 ? '1px solid #e5e7eb' : 'none',
                      transition: 'background-color 0.2s'
                    }}
                    onMouseEnter={(e) => (e.target as HTMLElement).style.backgroundColor = '#f9fafb'}
                    onMouseLeave={(e) => (e.target as HTMLElement).style.backgroundColor = 'transparent'}
                  >
                    <td style={{ padding: '16px 24px', whiteSpace: 'nowrap' }}>
                      <div>
                        <div style={{ 
                          fontSize: '14px', 
                          fontWeight: '500', 
                          color: '#111827' 
                        }}>
                          {product.name}
                        </div>
                        <div style={{ 
                          fontSize: '14px', 
                          color: '#6b7280' 
                        }}>
                          /{product.slug}
                        </div>
                      </div>
                    </td>
                    <td style={{ padding: '16px 24px', whiteSpace: 'nowrap' }}>
                      <button
                        onClick={() => togglePublish(product)}
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          padding: '2px 10px',
                          borderRadius: '9999px',
                          fontSize: '12px',
                          fontWeight: '500',
                          border: 'none',
                          cursor: 'pointer',
                          backgroundColor: product.isPublished ? '#dcfce7' : '#f3f4f6',
                          color: product.isPublished ? '#166534' : '#374151',
                          transition: 'all 0.2s'
                        }}
                      >
                        {product.isPublished ? 'Published' : 'Draft'}
                      </button>
                    </td>
                    <td style={{ 
                      padding: '16px 24px', 
                      whiteSpace: 'nowrap', 
                      fontSize: '14px', 
                      color: '#111827' 
                    }}>
                      {formatPrice(product.priceCents, product.currency)}
                    </td>
                    <td style={{ 
                      padding: '16px 24px', 
                      whiteSpace: 'nowrap', 
                      fontSize: '14px', 
                      color: '#111827' 
                    }}>
                      <span style={{ 
                        color: product.quantity > 0 ? '#059669' : '#dc2626' 
                      }}>
                        {product.quantity} units
                      </span>
                    </td>
                    <td style={{ 
                      padding: '16px 24px', 
                      whiteSpace: 'nowrap', 
                      fontSize: '14px', 
                      color: '#6b7280' 
                    }}>
                      {formatDate(product.updatedAt)}
                    </td>
                    <td style={{ 
                      padding: '16px 24px', 
                      whiteSpace: 'nowrap', 
                      textAlign: 'right', 
                      fontSize: '14px', 
                      fontWeight: '500' 
                    }}>
                      <div style={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'flex-end', 
                        gap: '8px' 
                      }}>
                        <Link
                          to={`/products/${product.slug}`}
                          style={{
                            color: '#2563eb',
                            transition: 'color 0.2s',
                            display: 'flex',
                            alignItems: 'center',
                            padding: '4px'
                          }}
                          title="View"
                          onMouseEnter={(e) => (e.target as HTMLElement).style.color = '#1d4ed8'}
                          onMouseLeave={(e) => (e.target as HTMLElement).style.color = '#2563eb'}
                        >
                          <svg style={{ width: '16px', height: '16px' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                        </Link>
                        <Link
                          to={`/admin/products/${product.id}/edit`}
                          style={{
                            color: '#6b7280',
                            transition: 'color 0.2s',
                            display: 'flex',
                            alignItems: 'center',
                            padding: '4px'
                          }}
                          title="Edit"
                          onMouseEnter={(e) => (e.target as HTMLElement).style.color = '#111827'}
                          onMouseLeave={(e) => (e.target as HTMLElement).style.color = '#6b7280'}
                        >
                          <svg style={{ width: '16px', height: '16px' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </Link>
                        <Link
                          to={`/admin/products/${product.id}/photos`}
                          style={{
                            color: '#9333ea',
                            transition: 'color 0.2s',
                            display: 'flex',
                            alignItems: 'center',
                            padding: '4px'
                          }}
                          title="Manage Photos"
                          onMouseEnter={(e) => (e.target as HTMLElement).style.color = '#7c3aed'}
                          onMouseLeave={(e) => (e.target as HTMLElement).style.color = '#9333ea'}
                        >
                          <svg style={{ width: '16px', height: '16px' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                        </Link>
                        <button
                          onClick={() => handleDelete(product.id, product.name)}
                          disabled={deleteLoading === product.id}
                          style={{
                            color: '#dc2626',
                            background: 'none',
                            border: 'none',
                            cursor: deleteLoading === product.id ? 'not-allowed' : 'pointer',
                            opacity: deleteLoading === product.id ? 0.5 : 1,
                            transition: 'color 0.2s',
                            display: 'flex',
                            alignItems: 'center',
                            padding: '4px'
                          }}
                          title="Delete"
                          onMouseEnter={(e) => {
                            if (!deleteLoading) {
                              (e.target as HTMLElement).style.color = '#991b1b'
                            }
                          }}
                          onMouseLeave={(e) => (e.target as HTMLElement).style.color = '#dc2626'}
                        >
                          {deleteLoading === product.id ? (
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
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}

export default ProductList
