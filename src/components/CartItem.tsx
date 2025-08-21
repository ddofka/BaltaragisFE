import { useCart, CartItem as CartItemType } from '../contexts/CartContext'
import { useI18n } from '../contexts/I18nContext'

interface CartItemProps {
  item: CartItemType
}

function CartItem({ item }: CartItemProps) {
  const { removeItem, updateQuantity } = useCart()
  const { t } = useI18n()
  
  const handleQuantityChange = (newQuantity: number) => {
    if (newQuantity <= 0) {
      removeItem(item.product.id)
    } else {
      updateQuantity(item.product.id, newQuantity)
    }
  }
  
  const totalPrice = (parseFloat(item.product.price.replace(/[€$£,]/g, '')) * item.quantity).toFixed(2)
  
  return (
    <div className="cart-item">
      <div className="cart-item-image">
        {item.product.photos && item.product.photos.length > 0 ? (
          <img 
            src={item.product.photos[0]} 
            alt={item.product.name}
            loading="lazy"
          />
        ) : (
          <div className="product-image-placeholder">
            <span className="placeholder-icon">🎨</span>
          </div>
        )}
      </div>
      
      <div className="cart-item-details">
        <h4 className="cart-item-name">{item.product.name}</h4>
        <p className="cart-item-price">
          {item.product.price} {item.product.currency}
        </p>
        
        <div className="cart-item-controls">
          <div className="quantity-controls">
            <button
              onClick={() => handleQuantityChange(item.quantity - 1)}
              className="quantity-btn"
              aria-label={t('cart.decrease_quantity')}
              disabled={item.quantity <= 1}
            >
              −
            </button>
            
            <input
              type="number"
              value={item.quantity}
              onChange={(e) => handleQuantityChange(parseInt(e.target.value) || 1)}
              className="quantity-input"
              min="1"
              max={item.product.quantity}
              aria-label={`${t('cart.quantity_label')} ${item.product.name}`}
            />
            
            <button
              onClick={() => handleQuantityChange(item.quantity + 1)}
              className="quantity-btn"
              aria-label={t('cart.increase_quantity')}
              disabled={item.quantity >= item.product.quantity}
            >
              +
            </button>
          </div>
          
          <button
            onClick={() => removeItem(item.product.id)}
            className="remove-btn"
            aria-label={`${t('cart.remove_item')} ${item.product.name}`}
            title={`${t('cart.remove_item')} ${item.product.name}`}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="3,6 5,6 21,6"></polyline>
              <path d="m19,6v14a2,2 0 0,1-2,2H7a2,2 0 0,1-2-2V6m3,0V4a2,2 0 0,1,2-2h4a2,2 0 0,1,2,2v2"></path>
              <line x1="10" y1="11" x2="10" y2="17"></line>
              <line x1="14" y1="11" x2="14" y2="17"></line>
            </svg>
          </button>
        </div>
        
        <div className="cart-item-total">
          <strong>{totalPrice} {item.product.currency}</strong>
        </div>
      </div>
    </div>
  )
}

export default CartItem
