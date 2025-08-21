import { useCart } from '../contexts/CartContext'
import { useI18n } from '../contexts/I18nContext'

function CartIcon() {
  const { state, toggleCart } = useCart()
  const { t } = useI18n()
  
  return (
    <button
      onClick={toggleCart}
      className={`cart-icon ${state.isAnimating ? 'cart-icon-pop' : ''}`}
      aria-label={t('cart.toggle_cart')}
      title={t('cart.toggle_cart')}
    >
      <div className="cart-icon-container">
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="9" cy="21" r="1"></circle>
          <circle cx="20" cy="21" r="1"></circle>
          <path d="m1 1 4 4 2.5 11h9.5l3.5-7H6"></path>
        </svg>
        
        {state.totalItems > 0 && (
          <span className="cart-badge" aria-label={`${state.totalItems} ${t('cart.items')}`}>
            {state.totalItems > 99 ? '99+' : state.totalItems}
          </span>
        )}
      </div>
    </button>
  )
}

export default CartIcon
