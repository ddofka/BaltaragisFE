import { ProductCard as ProductCardType } from '../api/generated/types'
import { useI18n } from '../contexts/I18nContext'
import { useState } from 'react'

interface ProductCardProps {
  product: ProductCardType
  onNavigate: () => void
}

function ProductCard({ product, onNavigate }: ProductCardProps) {
  const { t } = useI18n()
  const [imgLoaded, setImgLoaded] = useState(false)

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

  // Responsive srcSet example (could be improved if backend provides multiple sizes)
  const srcSet = product.thumbnailUrl
    ? `${product.thumbnailUrl} 1x, ${product.thumbnailUrl.replace(/(\.[a-z]+)$/, '@2x$1')} 2x`
    : undefined
  const sizes = '(max-width: 600px) 100vw, 33vw'

  return (
    <article 
      className="product-card"
      tabIndex={0}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      role="button"
      aria-label={`${t('products.view_product')} ${product.name}`}
    >
      <div className="product-image aspect-ratio-1-1">
        {product.thumbnailUrl ? (
          <>
            <img 
              src={product.thumbnailUrl} 
              srcSet={srcSet}
              sizes={sizes}
              alt={t('products.product_image_alt') + ' ' + product.name}
              loading="lazy"
              className={`product-img ${imgLoaded ? 'loaded' : 'blur'}`}
              onLoad={() => setImgLoaded(true)}
              onError={(e) => {
                const target = e.target as HTMLImageElement
                target.style.display = 'none'
                target.nextElementSibling?.classList.remove('hidden')
              }}
            />
            {!imgLoaded && (
              <div className="product-image-skeleton" aria-hidden="true"></div>
            )}
          </>
        ) : (
          <div className="product-image-placeholder">
            <span className="placeholder-icon">🎨</span>
          </div>
        )}
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
