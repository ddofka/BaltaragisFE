import { useState, useEffect, useCallback, useMemo } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { useI18n } from '../contexts/I18nContext'
import { usePageTitle } from '../hooks/usePageTitle'
import { apiClient } from '../api/generated'
import { PageProductCard } from '../api/generated/types'
import ProductCardComponent from '../components/ProductCard'
import SearchInput from '../components/SearchInput'
import Pagination from '../components/Pagination'
import LoadingSkeleton from '../components/LoadingSkeleton'

function Products() {
  const { t } = useI18n()
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()
  
  usePageTitle('products.page_title')
  
  // URL state
  const query = searchParams.get('q') || ''
  const page = parseInt(searchParams.get('page') || '0')
  const size = parseInt(searchParams.get('size') || '12')
  
  // Component state
  const [products, setProducts] = useState<PageProductCard | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  
  // Memoized search params for API calls
  const apiParams = useMemo(() => ({
    q: query || undefined,
    page,
    size
  }), [query, page, size])
  
  // Fetch products with ETag support
  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      
      // Use the generated API client
      const data = await apiClient.getProducts(apiParams)
      setProducts(data)
    } catch (err) {
      console.error('Error fetching products:', err)
      setError(err instanceof Error ? err.message : 'Failed to fetch products')
    } finally {
      setLoading(false)
    }
  }, [apiParams])
  
  // Fetch products when params change
  useEffect(() => {
    fetchProducts()
  }, [fetchProducts])
  
  // Update URL when search/pagination changes
  const updateURL = useCallback((newQuery?: string, newPage?: number, newSize?: number) => {
    const params = new URLSearchParams(searchParams)
    
    if (newQuery !== undefined) {
      if (newQuery) {
        params.set('q', newQuery)
      } else {
        params.delete('q')
      }
      params.delete('page') // Reset to first page on new search
    }
    
    if (newPage !== undefined) {
      params.set('page', newPage.toString())
    }
    
    if (newSize !== undefined) {
      params.set('size', newSize.toString())
      params.delete('page') // Reset to first page on size change
    }
    
    setSearchParams(params)
  }, [searchParams, setSearchParams])
  
  // Handle search input
  const handleSearch = useCallback((searchQuery: string) => {
    updateURL(searchQuery)
  }, [updateURL])
  
  // Handle page change
  const handlePageChange = useCallback((newPage: number) => {
    updateURL(undefined, newPage)
  }, [updateURL])
  
  // Handle size change
  const handleSizeChange = useCallback((newSize: number) => {
    updateURL(undefined, undefined, newSize)
  }, [updateURL])
  
  // Loading state
  if (loading && !products) {
    return (
      <div className="page products-page">
        <header className="products-header">
          <h1>{t('products.title')}</h1>
          <p className="products-intro">{t('products.intro')}</p>
        </header>
        <LoadingSkeleton type="grid" count={12} />
      </div>
    )
  }
  
  // Error state
  if (error) {
    return (
      <div className="page products-page">
        <div className="error-container">
          <h1>{t('products.title')}</h1>
          <div className="error-message">
            <p>{t('common.error_loading')}</p>
            <p className="error-details">{error}</p>
            <button 
              onClick={fetchProducts}
              className="btn btn-primary"
            >
              {t('common.retry')}
            </button>
          </div>
        </div>
      </div>
    )
  }
  
  // Empty state
  if (!products || products.empty) {
    return (
      <div className="page products-page">
        <h1>{t('products.title')}</h1>
        
        <SearchInput 
          value={query}
          onSearch={handleSearch}
          placeholder={t('products.search_placeholder')}
        />
        
        <div className="empty-state">
          <div className="empty-icon" aria-hidden="true">🎨</div>
          <h2>{t('products.no_results_title')}</h2>
          <p>{t('products.no_results_message')}</p>
          <div className="empty-actions">
            {query && (
              <button 
                onClick={() => handleSearch('')}
                className="btn btn-primary"
              >
                {t('products.clear_search')}
              </button>
            )}
            <button onClick={() => navigate('/')} className="btn btn-secondary">
              {t('common.go_home')}
            </button>
          </div>
        </div>
      </div>
    )
  }
  
  return (
    <div className="page products-page">
      <header className="products-header">
        <h1>{t('products.title')}</h1>
        <p className="products-intro">{t('products.intro')}</p>
      </header>
      
      <section className="products-controls">
        <SearchInput 
          value={query}
          onSearch={handleSearch}
          placeholder={t('products.search_placeholder')}
        />
        
        <div className="results-info">
          <span className="results-count">
            {`${t('products.results_count')} ${products.totalElements} (${t('common.page')} ${page + 1} ${t('common.of')} ${products.totalPages})`}
          </span>
        </div>
      </section>
      
      <section className="products-grid">
        {products.content.map((product) => (
          <ProductCardComponent 
            key={product.id}
            product={product}
            onNavigate={() => navigate(`/products/${product.slug}`)}
          />
        ))}
      </section>
      
      {products.totalPages > 1 && (
        <section className="products-pagination">
          <Pagination
            currentPage={page}
            totalPages={products.totalPages}
            onPageChange={handlePageChange}
            onSizeChange={handleSizeChange}
            currentSize={size}
            availableSizes={[12, 24, 48]}
          />
        </section>
      )}
    </div>
  )
}

export default Products
