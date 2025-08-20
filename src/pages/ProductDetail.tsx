import { useParams } from 'react-router-dom'
import { useI18n } from '../contexts/I18nContext'
import { usePageTitle } from '../hooks/usePageTitle'

function ProductDetail() {
  const { slug } = useParams<{ slug: string }>()
  const { t } = useI18n()
  usePageTitle('product.page_title')

  return (
    <div className="page product-detail-page">
      <h1>{t('product.title')}: {slug}</h1>
      
      <section className="product-detail">
        <div className="product-image-placeholder large"></div>
        
        <div className="product-info">
          <h2>{t('product.details')}</h2>
          <p>
            {t('product.placeholder_text')} <strong>{slug}</strong>
          </p>
          
          <div className="product-meta">
            <p><strong>{t('product.price')}:</strong> €45.00</p>
            <p><strong>{t('product.medium')}:</strong> {t('product.giclee_print')}</p>
            <p><strong>{t('product.size')}:</strong> A3</p>
            <p><strong>{t('product.availability')}:</strong> {t('product.in_stock')}</p>
          </div>
          
          <button className="btn btn-primary">
            {t('product.add_to_cart')}
          </button>
        </div>
      </section>

      <section className="product-description">
        <h3>{t('product.description')}</h3>
        <p>{t('product.description_text')}</p>
      </section>
    </div>
  )
}

export default ProductDetail
