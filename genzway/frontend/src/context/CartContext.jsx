import { createContext, useState, useContext } from 'react'

const CartContext = createContext()

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([])

  // Function to add item
  const addToCart = (product) => {
    setCartItems(prevItems => {
      // Check if item already exists
      const existingItem = prevItems.find(item => item.id === product.id)
      
      if (existingItem) {
        // If exists, just increase quantity
        return prevItems.map(item =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        )
      } else {
        // If new, add it with quantity 1
        return [...prevItems, { ...product, quantity: 1 }]
      }
    })
  }

  // Function to remove item
  const removeFromCart = (productId) => {
    setCartItems(prevItems => prevItems.filter(item => item.id !== productId))
  }

  return (
    <CartContext.Provider value={{ cartItems, addToCart, removeFromCart }}>
      {children}
    </CartContext.Provider>
  )
}

// Custom hook to use the cart easily
export const useCart = () => useContext(CartContext)