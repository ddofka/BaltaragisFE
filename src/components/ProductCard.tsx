import { ProductCard as ProductCardType } from '../api/generated/types'
import { useI18n } from '../contexts/I18nContext'
import { prefetchProduct } from '../utils/prefetch'

interface ProductCardProps {
  product: ProductCardType
  onNavigate: () => void
}

function ProductCard({ product, onNavigate }: ProductCardProps) {
  const { t } = useI18n()
  
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
  
  return (
    <article 
      className="product-card"
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
    </article>
  )
}

export default ProductCard
