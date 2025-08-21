import { Link } from 'react-router-dom'
import { useI18n } from '../contexts/I18nContext'
import { usePageTitle } from '../hooks/usePageTitle'

function CheckoutCancel() {
  const { t } = useI18n()
  usePageTitle('checkout.cancel_page_title')
  
  return (
    <div className="page checkout-cancel-page">
      <div className="cancel-container">
        <div className="cancel-content">
          <div className="cancel-icon">
            <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10" />
              <line x1="15" y1="9" x2="9" y2="15" />
              <line x1="9" y1="9" x2="15" y2="15" />
            </svg>
          </div>
          
          <h1>{t('checkout.cancel_title')}</h1>
          
          <div className="cancel-message">
            <p>{t('checkout.cancel_message')}</p>
            <p>{t('checkout.cancel_help_text')}</p>
          </div>
          
          <div className="cancel-actions">
            <Link to="/checkout" className="btn btn-primary">
              {t('checkout.try_again')}
            </Link>
            
            <Link to="/products" className="btn btn-secondary">
              {t('checkout.continue_shopping')}
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CheckoutCancel
