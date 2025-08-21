import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useCart } from '../contexts/CartContext'
import { useI18n } from '../contexts/I18nContext'
import CartItem from './CartItem'

function CartDrawer() {
  const { state, closeCart, clearCart } = useCart()
  const { t } = useI18n()
  
  // Close cart on escape key
  useEffect(() => {
    const handleEscKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && state.isOpen) {
        closeCart()
      }
    }
    
    if (state.isOpen) {
      document.addEventListener('keydown', handleEscKey)
      // Prevent body scroll when cart is open
      document.body.style.overflow = 'hidden'
    }
    
    return () => {
      document.removeEventListener('keydown', handleEscKey)
      document.body.style.overflow = 'unset'
    }
  }, [state.isOpen, closeCart])
  
  const totalAmount = (state.totalAmount / 100).toFixed(2)
  
  return (
    <>
      {/* Backdrop */}
      <div 
        className={`cart-backdrop ${state.isOpen ? 'cart-backdrop-open' : ''}`}
        onClick={closeCart}
        aria-hidden="true"
      />
      
      {/* Cart Drawer */}
      <div 
        className={`cart-drawer ${state.isOpen ? 'cart-drawer-open' : ''}`}
        role="dialog"
        aria-modal="true"
        aria-labelledby="cart-title"
      >
        <div className="cart-header">
          <h2 id="cart-title" className="cart-title">
            {t('cart.title')} ({state.totalItems})
          </h2>
          
          <button
            onClick={closeCart}
            className="cart-close-btn"
            aria-label={t('cart.close_cart')}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>
        
        <div className="cart-content">
          {state.items.length === 0 ? (
            <div className="cart-empty">
              <div className="cart-empty-icon">
                <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
                  <circle cx="9" cy="21" r="1"></circle>
                  <circle cx="20" cy="21" r="1"></circle>
                  <path d="m1 1 4 4 2.5 11h9.5l3.5-7H6"></path>
                </svg>
              </div>
              <h3>{t('cart.empty_title')}</h3>
              <p>{t('cart.empty_message')}</p>
              <Link 
                to="/products" 
                className="btn btn-primary"
                onClick={closeCart}
              >
                {t('cart.continue_shopping')}
              </Link>
            </div>
          ) : (
            <>
              <div className="cart-items">
                {state.items.map((item) => (
                  <CartItem key={item.product.id} item={item} />
                ))}
              </div>
              
              <div className="cart-footer">
                <div className="cart-summary">
                  <div className="cart-total">
                    <span className="total-label">{t('cart.total')}:</span>
                    <span className="total-amount">
                      {totalAmount} {state.items[0]?.product.currency || 'EUR'}
                    </span>
                  </div>
                </div>
                
                <div className="cart-actions">
                  <button
                    onClick={clearCart}
                    className="btn btn-secondary btn-sm"
                  >
                    {t('cart.clear_cart')}
                  </button>
                  
                  <Link
                    to="/checkout"
                    className="btn btn-primary btn-full"
                    onClick={closeCart}
                  >
                    {t('cart.checkout')}
                  </Link>
                </div>
                
                <div className="cart-continue">
                  <Link 
                    to="/products" 
                    className="continue-shopping-link"
                    onClick={closeCart}
                  >
                    {t('cart.continue_shopping')}
                  </Link>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  )
}

export default CartDrawer
