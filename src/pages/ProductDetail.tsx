import { useState, useEffect } from 'react'
import { useParams, Navigate } from 'react-router-dom'
import { useI18n } from '../contexts/I18nContext'
import { usePageTitle } from '../hooks/usePageTitle'
import { useCart } from '../contexts/CartContext'
import { apiClient } from '../api/generated'
import { ProductDetail as ProductDetailType } from '../api/generated/types'
import LoadingSpinner from '../components/LoadingSpinner'

function ProductDetail() {
  const { slug } = useParams<{ slug: string }>()
  const { t } = useI18n()
  const { addItem, triggerAnimation } = useCart()
  
  const [product, setProduct] = useState<ProductDetailType | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [quantity, setQuantity] = useState(1)
  const [isAddingToCart, setIsAddingToCart] = useState(false)
  
  usePageTitle('product.page_title')

  useEffect(() => {
    if (!slug) return
    
    const fetchProduct = async () => {
      try {
        setLoading(true)
        setError(null)
        const productData = await apiClient.getProduct(slug)
        setProduct(productData)
      } catch (error) {
        console.error('Error fetching product:', error)
        setError(t('product.error_loading'))
      } finally {
        setLoading(false)
      }
    }
    
    fetchProduct()
  }, [slug, t])

  const handleAddToCart = async () => {
    if (!product || !product.inStock) return
    
    setIsAddingToCart(true)
    
    try {
      addItem(product, quantity)
      triggerAnimation()
    } catch (error) {
      console.error('Error adding to cart:', error)
    } finally {
      setIsAddingToCart(false)
    }
  }

  const handleQuantityChange = (newQuantity: number) => {
    if (newQuantity >= 1 && newQuantity <= (product?.quantity || 1)) {
      setQuantity(newQuantity)
    }
  }

  if (!slug) {
    return <Navigate to="/products" replace />
  }

  if (loading) {
    return (
      <div className="page product-detail-page">
        <LoadingSpinner />
      </div>
    )
  }

  if (error || !product) {
    return (
      <div className="page product-detail-page">
        <div className="error-state">
          <h1>{t('product.error_title')}</h1>
          <p>{error || t('product.not_found')}</p>
          <a href="/products" className="btn btn-primary">
            {t('product.back_to_products')}
          </a>
        </div>
      </div>
    )
  }

  return (
    <div className="page product-detail-page">
      <h1>{product.name}</h1>
      
      <section className="product-detail">
        <div className="product-images">
          {product.photos && product.photos.length > 0 ? (
            <div className="product-gallery">
              <div className="main-image">
                <img 
                  src={product.photos[0]} 
                  alt={product.name}
                  loading="eager"
                />
              </div>
              {product.photos.length > 1 && (
                <div className="thumbnail-images">
                  {product.photos.map((photo, index) => (
                    <img 
                      key={index}
                      src={photo} 
                      alt={`${product.name} ${index + 1}`}
                      loading="lazy"
                    />
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div className="product-image-placeholder large">
              <span className="placeholder-icon">🎨</span>
            </div>
          )}
        </div>
        
        <div className="product-info">
          <div className="product-meta">
            <div className="price-section">
              <span className="product-price">
                {product.price} {product.currency}
              </span>
            </div>
            
            <div className="availability-section">
              <span className={`availability-badge ${product.inStock ? 'in-stock' : 'out-of-stock'}`}>
                {product.inStock ? t('product.in_stock') : t('product.out_of_stock')}
              </span>
              {product.inStock && (
                <span className="stock-count">
                  {`${product.quantity} ${t('product.items_available')}`}
                </span>
              )}
            </div>
          </div>
          
          {product.inStock && (
            <div className="purchase-section">
              <div className="quantity-selector">
                <label htmlFor="quantity">{t('product.quantity')}:</label>
                <div className="quantity-controls">
                  <button
                    onClick={() => handleQuantityChange(quantity - 1)}
                    disabled={quantity <= 1}
                    aria-label={t('product.decrease_quantity')}
                  >
                    −
                  </button>
                  
                  <input
                    type="number"
                    id="quantity"
                    value={quantity}
                    onChange={(e) => handleQuantityChange(parseInt(e.target.value) || 1)}
                    min="1"
                    max={product.quantity}
                    className="quantity-input"
                  />
                  
                  <button
                    onClick={() => handleQuantityChange(quantity + 1)}
                    disabled={quantity >= product.quantity}
                    aria-label={t('product.increase_quantity')}
                  >
                    +
                  </button>
                </div>
              </div>
              
              <button 
                onClick={handleAddToCart}
                disabled={isAddingToCart || !product.inStock}
                className="btn btn-primary btn-lg add-to-cart-btn"
              >
                {isAddingToCart ? (
                  <>
                    <LoadingSpinner />
                    {t('product.adding_to_cart')}
                  </>
                ) : (
                  t('product.add_to_cart')
                )}
              </button>
            </div>
          )}
          
          {!product.inStock && (
            <div className="out-of-stock-section">
              <p>{t('product.out_of_stock_message')}</p>
              <button className="btn btn-secondary">
                {t('product.notify_when_available')}
              </button>
            </div>
          )}
        </div>
      </section>

      <section className="product-description">
        <h3>{t('product.description')}</h3>
        <div 
          className="description-content"
          dangerouslySetInnerHTML={{ __html: product.longDesc || t('product.no_description') }}
        />
      </section>
      
      <section className="product-details">
        <h3>{t('product.details')}</h3>
        <div className="details-grid">
          <div className="detail-item">
            <span className="detail-label">{t('product.updated')}:</span>
            <span className="detail-value">
              {new Date(product.updatedAt).toLocaleDateString()}
            </span>
          </div>
        </div>
      </section>
    </div>
  )
}

export default ProductDetail
