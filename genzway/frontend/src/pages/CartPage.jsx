import { useCart } from '../context/CartContext'
import { Link, useNavigate } from 'react-router-dom'
// We don't need axios here anymore because PaymentPage handles the API call
import { useCurrency } from '../context/CurrencyContext'

const CartPage = () => {
  const { cartItems, removeFromCart } = useCart()
  const navigate = useNavigate()
  const { formatPrice } = useCurrency()

  // Calculate Total Price
  const totalPrice = cartItems.reduce((acc, item) => acc + (Number(item.price) * item.quantity), 0)

  const handleCheckout = () => {
    const token = localStorage.getItem('token')
    
    if (!token) {
        alert("Please login first!")
        navigate('/login')
        return
    }

    // REDIRECT TO STRIPE PAYMENT PAGE
    navigate('/payment')
  }

  if (cartItems.length === 0) {
    return (
        <div className="container mx-auto px-6 py-20 text-center">
            <h2 className="text-4xl font-bold mb-4">Your cart is empty</h2>
            <p className="text-gray-500 mb-8">Looks like you haven't added anything to your cart yet.</p>
            <Link to="/" className="bg-black text-white px-8 py-3 rounded-lg font-bold hover:bg-gray-800 transition">
                Start Shopping
            </Link>
        </div>
    )
  }

  return (
    <div className="container mx-auto px-6 py-10">
      <h1 className="text-3xl font-bold mb-8">Shopping Cart</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        
        {/* LEFT COLUMN: Cart Items */}
        <div className="lg:col-span-2 space-y-6">
            {cartItems.map(item => (
                <div key={item.id} className="flex items-center justify-between bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                    
                    {/* Product Info */}
                    <div className="flex items-center gap-6">
                        <img 
                            src={item.image} 
                            alt={item.name} 
                            className="w-24 h-24 object-cover rounded-md" 
                        />
                        <div>
                            <h3 className="text-xl font-bold text-gray-800">{item.name}</h3>
                            <p className="text-gray-500 text-sm">Qty: {item.quantity}</p>
                            <p className="text-yellow-600 font-bold mt-1">{formatPrice(item.price)}</p>
                        </div>
                    </div>

                    {/* Remove Button */}
                    <button 
                        onClick={() => removeFromCart(item.id)}
                        className="text-red-500 hover:text-red-700 font-medium transition"
                    >
                        Remove
                    </button>
                </div>
            ))}
        </div>

        {/* RIGHT COLUMN: Order Summary */}
        <div className="bg-white p-8 rounded-lg shadow-lg h-fit border border-gray-100">
            <h2 className="text-xl font-bold mb-6 border-b pb-4">Order Summary</h2>
            
            <div className="flex justify-between mb-4 text-gray-600">
                <span>Subtotal</span>
                <span>{formatPrice(totalPrice)}</span>
            </div>
            <div className="flex justify-between mb-4 text-gray-600">
                <span>Shipping</span>
                <span>Free</span>
            </div>
            <div className="flex justify-between mb-8 text-xl font-bold text-gray-900 border-t pt-4">
                <span>Total</span>
                <span>{formatPrice(totalPrice)}</span>
            </div>

            <button 
                onClick={handleCheckout}
                className="w-full bg-black text-white font-bold py-4 rounded-lg hover:bg-gray-800 hover:shadow-xl transition transform active:scale-95"
            >
                Proceed to Checkout
            </button>
            
            <p className="text-xs text-center text-gray-400 mt-4">
                Secure Checkout - 100% Encrypted
            </p>
        </div>

      </div>
    </div>
  )
}

export default CartPage