import { useState } from 'react'
import { ProductCard as ProductCardType } from '../api/generated/types'
import { useI18n } from '../contexts/I18nContext'
import { useCart } from '../contexts/CartContext'
import { prefetchProduct } from '../utils/prefetch'
import { apiClient } from '../api/generated'
import LoadingSpinner from './LoadingSpinner'

interface ProductCardProps {
  product: ProductCardType
  onNavigate: () => void
}

function ProductCard({ product, onNavigate }: ProductCardProps) {
  const { t } = useI18n()
  const { addItem, triggerAnimation } = useCart()
  const [isAddingToCart, setIsAddingToCart] = useState(false)
  
  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault()
    onNavigate()
  }
  
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      onNavigate()
    }
  }
  
  const handleMouseEnter = () => {
    // Prefetch product detail on hover
    prefetchProduct(product.slug)
  }
  
  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    
    if (!product.inStock || isAddingToCart) return
    
    setIsAddingToCart(true)
    
    try {
      // Fetch full product details to add to cart
      const productDetail = await apiClient.getProduct(product.slug)
      addItem(productDetail, 1)
      triggerAnimation()
    } catch (error) {
      console.error('Error adding to cart:', error)
    } finally {
      setIsAddingToCart(false)
    }
  }
  
  return (
    <article className="product-card">
      <div 
        className="product-card-content"
        tabIndex={0}
        onClick={handleClick}
        onKeyDown={handleKeyDown}
        onMouseEnter={handleMouseEnter}
        role="button"
        aria-label={`${t('products.view_product')} ${product.name}`}
      >
        <div className="product-image">
          {product.thumbnailUrl ? (
            <img 
              src={product.thumbnailUrl} 
              alt={product.name}
              loading="lazy"
              onError={(e) => {
                const target = e.target as HTMLImageElement
                target.style.display = 'none'
                target.nextElementSibling?.classList.remove('hidden')
              }}
            />
          ) : null}
          <div className="product-image-placeholder hidden">
            <span className="placeholder-icon">🎨</span>
          </div>
        </div>
        
        <div className="product-info">
          <h3 className="product-name">{product.name}</h3>
          
          <div className="product-price">
            <span className="price-amount">{product.price}</span>
            <span className="price-currency">{product.currency}</span>
          </div>
          
          <div className="product-status">
            {product.inStock ? (
              <span className="status-badge in-stock">
                {t('products.in_stock')}
              </span>
            ) : (
              <span className="status-badge out-of-stock">
                {t('products.notify_me')}
              </span>
            )}
          </div>
        </div>
      </div>
      
      <div className="product-actions">
        {product.inStock ? (
          <button
            onClick={handleAddToCart}
            disabled={isAddingToCart}
            className="btn btn-primary btn-sm add-to-cart-btn"
            aria-label={`${t('products.add_to_cart')} ${product.name}`}
          >
            {isAddingToCart ? (
              <>
                <LoadingSpinner />
                <span className="sr-only">{t('products.adding_to_cart')}</span>
              </>
            ) : (
              <>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="9" cy="21" r="1"></circle>
                  <circle cx="20" cy="21" r="1"></circle>
                  <path d="m1 1 4 4 2.5 11h9.5l3.5-7H6"></path>
                </svg>
                {t('products.add_to_cart')}
              </>
            )}
          </button>
        ) : (
          <button className="btn btn-secondary btn-sm" disabled>
            {t('products.out_of_stock')}
          </button>
        )}
      </div>
    </article>
  )
}

export default ProductCard
