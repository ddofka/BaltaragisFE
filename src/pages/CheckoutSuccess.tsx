import { useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { useI18n } from '../contexts/I18nContext'
import { usePageTitle } from '../hooks/usePageTitle'
import { apiClient } from '../api/generated'

function CheckoutSuccess() {
  const { t } = useI18n()
  const [searchParams] = useSearchParams()
  const [orderStatus, setOrderStatus] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  
  usePageTitle('checkout.success_page_title')
  
  useEffect(() => {
    const sessionId = searchParams.get('session_id')
    
    if (sessionId) {
      const checkOrderStatus = async () => {
        try {
          const status = await apiClient.getCheckoutSessionStatus(sessionId)
          setOrderStatus(status)
        } catch (error) {
          console.error('Error checking order status:', error)
          setOrderStatus('UNKNOWN')
        } finally {
          setLoading(false)
        }
      }
      
      checkOrderStatus()
    } else {
      setLoading(false)
    }
  }, [searchParams])
  
  if (loading) {
    return (
      <div className="page checkout-success-page">
        <div className="success-container">
          <div className="loading-state">
            <div className="spinner"></div>
            <p>{t('checkout.checking_order_status')}</p>
          </div>
        </div>
      </div>
    )
  }
  
  return (
    <div className="page checkout-success-page">
      <div className="success-container">
        <div className="success-content">
          <div className="success-icon">
            <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M9 11l3 3 8-8" />
              <path d="M21 12c0 5-4 9-9 9s-9-4-9-9 4-9 9-9c1 0 2 .2 3 .5" />
            </svg>
          </div>
          
          <h1>{t('checkout.success_title')}</h1>
          
          <div className="success-message">
            <p>{t('checkout.success_message')}</p>
            
            {orderStatus && orderStatus !== 'UNKNOWN' && (
              <div className="order-status">
                <p><strong>{t('checkout.order_status')}:</strong> {orderStatus}</p>
              </div>
            )}
            
            <p>{t('checkout.success_email_sent')}</p>
          </div>
          
          <div className="success-actions">
            <Link to="/products" className="btn btn-primary">
              {t('checkout.continue_shopping')}
            </Link>
            
            <Link to="/" className="btn btn-secondary">
              {t('checkout.back_to_home')}
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CheckoutSuccess
