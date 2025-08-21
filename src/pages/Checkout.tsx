import { useState } from 'react'
import { Navigate } from 'react-router-dom'
import { useCart } from '../contexts/CartContext'
import { useI18n } from '../contexts/I18nContext'
import { usePageTitle } from '../hooks/usePageTitle'
import { apiClient } from '../api/generated'
import LoadingSpinner from '../components/LoadingSpinner'

interface CheckoutForm {
  email: string
  firstName: string
  lastName: string
  address: string
  city: string
  postalCode: string
  country: string
  phone: string
}

function Checkout() {
  const { state, clearCart } = useCart()
  const { t } = useI18n()
  usePageTitle('checkout.page_title')
  
  const [formData, setFormData] = useState<CheckoutForm>({
    email: '',
    firstName: '',
    lastName: '',
    address: '',
    city: '',
    postalCode: '',
    country: '',
    phone: ''
  })
  
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  // Redirect if cart is empty
  if (state.items.length === 0) {
    return <Navigate to="/products" replace />
  }
  
  const totalAmount = (state.totalAmount / 100).toFixed(2)
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)
    
    try {
      // For multiple items, we'll create a checkout session for the first item
      // In a real implementation, you might want to create a single order with multiple items
      const firstItem = state.items[0]
      
      const checkoutData = {
        productSlug: firstItem.product.slug,
        qty: firstItem.quantity,
        email: formData.email,
        successUrl: `${window.location.origin}/checkout/success`,
        cancelUrl: `${window.location.origin}/checkout/cancel`
      }
      
      const response = await apiClient.createCheckoutSession(checkoutData)
      
      // Clear cart and redirect to Stripe checkout
      clearCart()
      window.location.href = response.checkoutUrl
      
    } catch (error) {
      console.error('Checkout error:', error)
      setError(t('checkout.error_generic'))
    } finally {
      setIsSubmitting(false)
    }
  }
  
  const isFormValid = formData.email && formData.firstName && formData.lastName
  
  return (
    <div className="page checkout-page">
      <div className="checkout-container">
        <div className="checkout-content">
          {/* Order Summary */}
          <div className="checkout-summary">
            <h2>{t('checkout.order_summary')}</h2>
            
            <div className="summary-items">
              {state.items.map((item) => (
                <div key={item.product.id} className="summary-item">
                  <div className="summary-item-image">
                    {item.product.photos && item.product.photos.length > 0 ? (
                      <img src={item.product.photos[0]} alt={item.product.name} />
                    ) : (
                      <div className="product-image-placeholder">
                        <span className="placeholder-icon">🎨</span>
                      </div>
                    )}
                  </div>
                  
                  <div className="summary-item-details">
                    <h4>{item.product.name}</h4>
                    <p className="summary-item-price">
                      {item.product.price} {item.product.currency} × {item.quantity}
                    </p>
                    <p className="summary-item-total">
                      {(parseFloat(item.product.price.replace(/[€$£,]/g, '')) * item.quantity).toFixed(2)} {item.product.currency}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="summary-total">
              <div className="total-row">
                <span>{t('checkout.subtotal')}:</span>
                <span>{totalAmount} {state.items[0]?.product.currency || 'EUR'}</span>
              </div>
              <div className="total-row">
                <span>{t('checkout.shipping')}:</span>
                <span>{t('checkout.free_shipping')}</span>
              </div>
              <div className="total-row total-final">
                <span>{t('checkout.total')}:</span>
                <span>{totalAmount} {state.items[0]?.product.currency || 'EUR'}</span>
              </div>
            </div>
          </div>
          
          {/* Checkout Form */}
          <div className="checkout-form-container">
            <h1>{t('checkout.title')}</h1>
            
            {error && (
              <div className="checkout-error" role="alert">
                {error}
              </div>
            )}
            
            <form onSubmit={handleSubmit} className="checkout-form">
              <div className="form-section">
                <h3>{t('checkout.contact_information')}</h3>
                
                <div className="form-group">
                  <label htmlFor="email">{t('checkout.email')} *</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    autoComplete="email"
                  />
                </div>
                
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="firstName">{t('checkout.first_name')} *</label>
                    <input
                      type="text"
                      id="firstName"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      required
                      autoComplete="given-name"
                    />
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="lastName">{t('checkout.last_name')} *</label>
                    <input
                      type="text"
                      id="lastName"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      required
                      autoComplete="family-name"
                    />
                  </div>
                </div>
              </div>
              
              <div className="form-section">
                <h3>{t('checkout.shipping_address')}</h3>
                
                <div className="form-group">
                  <label htmlFor="address">{t('checkout.address')}</label>
                  <input
                    type="text"
                    id="address"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    autoComplete="street-address"
                  />
                </div>
                
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="city">{t('checkout.city')}</label>
                    <input
                      type="text"
                      id="city"
                      name="city"
                      value={formData.city}
                      onChange={handleInputChange}
                      autoComplete="address-level2"
                    />
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="postalCode">{t('checkout.postal_code')}</label>
                    <input
                      type="text"
                      id="postalCode"
                      name="postalCode"
                      value={formData.postalCode}
                      onChange={handleInputChange}
                      autoComplete="postal-code"
                    />
                  </div>
                </div>
                
                <div className="form-group">
                  <label htmlFor="country">{t('checkout.country')}</label>
                  <select
                    id="country"
                    name="country"
                    value={formData.country}
                    onChange={handleInputChange}
                    autoComplete="country"
                  >
                    <option value="">{t('checkout.select_country')}</option>
                    <option value="LT">Lithuania</option>
                    <option value="LV">Latvia</option>
                    <option value="EE">Estonia</option>
                    <option value="PL">Poland</option>
                    <option value="DE">Germany</option>
                    <option value="FR">France</option>
                    <option value="UK">United Kingdom</option>
                    <option value="US">United States</option>
                    <option value="CA">Canada</option>
                  </select>
                </div>
                
                <div className="form-group">
                  <label htmlFor="phone">{t('checkout.phone')}</label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    autoComplete="tel"
                  />
                </div>
              </div>
              
              <div className="checkout-actions">
                <button
                  type="submit"
                  className="btn btn-primary btn-lg btn-full"
                  disabled={!isFormValid || isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <LoadingSpinner />
                      {t('checkout.processing')}
                    </>
                  ) : (
                    t('checkout.complete_order')
                  )}
                </button>
                
                <p className="checkout-note">
                  {t('checkout.stripe_notice')}
                </p>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Checkout
