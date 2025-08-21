import { createContext, useContext, useReducer, ReactNode } from 'react'
import { ProductDetail } from '../api/generated/types'

// Cart item type
export interface CartItem {
  product: ProductDetail
  quantity: number
}

// Cart state
interface CartState {
  items: CartItem[]
  isOpen: boolean
  totalItems: number
  totalAmount: number
  isAnimating: boolean
}

// Cart actions
type CartAction =
  | { type: 'ADD_ITEM'; product: ProductDetail; quantity?: number }
  | { type: 'REMOVE_ITEM'; productId: number }
  | { type: 'UPDATE_QUANTITY'; productId: number; quantity: number }
  | { type: 'CLEAR_CART' }
  | { type: 'TOGGLE_CART' }
  | { type: 'OPEN_CART' }
  | { type: 'CLOSE_CART' }
  | { type: 'TRIGGER_ANIMATION' }
  | { type: 'END_ANIMATION' }

// Cart context type
interface CartContextType {
  state: CartState
  addItem: (product: ProductDetail, quantity?: number) => void
  removeItem: (productId: number) => void
  updateQuantity: (productId: number, quantity: number) => void
  clearCart: () => void
  toggleCart: () => void
  openCart: () => void
  closeCart: () => void
  triggerAnimation: () => void
}

// Initial state
const initialState: CartState = {
  items: [],
  isOpen: false,
  totalItems: 0,
  totalAmount: 0,
  isAnimating: false
}

// Helper function to parse price string to cents
const parsePrice = (priceString: string): number => {
  // Remove currency symbols and convert to number
  const numericPrice = parseFloat(priceString.replace(/[€$£,]/g, ''))
  return Math.round(numericPrice * 100) // Convert to cents
}

// Helper function to calculate totals
const calculateTotals = (items: CartItem[]): { totalItems: number; totalAmount: number } => {
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0)
  const totalAmount = items.reduce((sum, item) => {
    const priceInCents = parsePrice(item.product.price)
    return sum + (priceInCents * item.quantity)
  }, 0)
  
  return { totalItems, totalAmount }
}

// Cart reducer
function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case 'ADD_ITEM': {
      const existingItemIndex = state.items.findIndex(
        item => item.product.id === action.product.id
      )
      
      let newItems: CartItem[]
      
      if (existingItemIndex >= 0) {
        // Update quantity if item exists
        newItems = state.items.map((item, index) =>
          index === existingItemIndex
            ? { ...item, quantity: item.quantity + (action.quantity || 1) }
            : item
        )
      } else {
        // Add new item
        newItems = [
          ...state.items,
          {
            product: action.product,
            quantity: action.quantity || 1
          }
        ]
      }
      
      const totals = calculateTotals(newItems)
      
      return {
        ...state,
        items: newItems,
        ...totals
      }
    }
    
    case 'REMOVE_ITEM': {
      const newItems = state.items.filter(item => item.product.id !== action.productId)
      const totals = calculateTotals(newItems)
      
      return {
        ...state,
        items: newItems,
        ...totals
      }
    }
    
    case 'UPDATE_QUANTITY': {
      if (action.quantity <= 0) {
        // Remove item if quantity is 0 or negative
        return cartReducer(state, { type: 'REMOVE_ITEM', productId: action.productId })
      }
      
      const newItems = state.items.map(item =>
        item.product.id === action.productId
          ? { ...item, quantity: action.quantity }
          : item
      )
      
      const totals = calculateTotals(newItems)
      
      return {
        ...state,
        items: newItems,
        ...totals
      }
    }
    
    case 'CLEAR_CART':
      return {
        ...state,
        items: [],
        totalItems: 0,
        totalAmount: 0
      }
    
    case 'TOGGLE_CART':
      return {
        ...state,
        isOpen: !state.isOpen
      }
    
    case 'OPEN_CART':
      return {
        ...state,
        isOpen: true
      }
    
    case 'CLOSE_CART':
      return {
        ...state,
        isOpen: false
      }
    
    case 'TRIGGER_ANIMATION':
      return {
        ...state,
        isAnimating: true
      }
    
    case 'END_ANIMATION':
      return {
        ...state,
        isAnimating: false
      }
    
    default:
      return state
  }
}

// Create context
const CartContext = createContext<CartContextType | undefined>(undefined)

// Provider component
interface CartProviderProps {
  children: ReactNode
}

export function CartProvider({ children }: CartProviderProps) {
  const [state, dispatch] = useReducer(cartReducer, initialState)
  
  // Action creators
  const addItem = (product: ProductDetail, quantity: number = 1) => {
    dispatch({ type: 'ADD_ITEM', product, quantity })
  }
  
  const removeItem = (productId: number) => {
    dispatch({ type: 'REMOVE_ITEM', productId })
  }
  
  const updateQuantity = (productId: number, quantity: number) => {
    dispatch({ type: 'UPDATE_QUANTITY', productId, quantity })
  }
  
  const clearCart = () => {
    dispatch({ type: 'CLEAR_CART' })
  }
  
  const toggleCart = () => {
    dispatch({ type: 'TOGGLE_CART' })
  }
  
  const openCart = () => {
    dispatch({ type: 'OPEN_CART' })
  }
  
  const closeCart = () => {
    dispatch({ type: 'CLOSE_CART' })
  }
  
  const triggerAnimation = () => {
    dispatch({ type: 'TRIGGER_ANIMATION' })
    // Reset animation after a short delay
    setTimeout(() => {
      dispatch({ type: 'END_ANIMATION' })
    }, 400)
  }
  
  const value: CartContextType = {
    state,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    toggleCart,
    openCart,
    closeCart,
    triggerAnimation
  }
  
  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  )
}

// Hook to use cart context
export function useCart() {
  const context = useContext(CartContext)
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider')
  }
  return context
}
