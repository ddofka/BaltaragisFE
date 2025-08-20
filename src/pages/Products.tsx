import { useI18n } from '../contexts/I18nContext'
import { usePageTitle } from '../hooks/usePageTitle'

function Products() {
  const { t } = useI18n()
  usePageTitle('products.page_title')
  
  return (
    <div className="page products-page">
      <h1>{t('products.title')}</h1>
      
      <section className="products-intro">
        <p>{t('products.intro')}</p>
      </section>

      <section className="products-grid">
        <div className="product-card placeholder">
          <div className="product-image-placeholder"></div>
          <h3>{t('products.sunset_print')}</h3>
          <p>{t('products.a3_giclee')}</p>
          <p className="price">€45.00</p>
        </div>
        
        <div className="product-card placeholder">
          <div className="product-image-placeholder"></div>
          <h3>{t('products.more_coming_soon')}</h3>
          <p>{t('products.additional_pieces')}</p>
        </div>
      </section>

      <section className="products-cta">
        <p>{t('products.cta_text')}</p>
      </section>
    </div>
  )
}

export default Products
