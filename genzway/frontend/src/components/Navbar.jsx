import { Link, useNavigate } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { useCurrency } from '../context/CurrencyContext'

const Navbar = () => {
  const { cartItems } = useCart()
  const navigate = useNavigate()
  
  const totalItems = cartItems.reduce((acc, item) => acc + item.quantity, 0)
  const token = localStorage.getItem('token')

  const handleLogout = () => {
    localStorage.removeItem('token')
    navigate('/login')
    window.location.reload()
  }
  const { currency, setCurrency } = useCurrency()

  return (
    <nav className="bg-gray-900 text-white shadow-lg sticky top-0 z-50">
      <div className="container mx-auto px-6 py-4 flex justify-between items-center">
        
        {/* LOGO */}
        <Link to="/" className="text-2xl font-bold tracking-wider hover:text-gray-300 transition">
          GENZ<span className="text-yellow-400">WAY</span>
        </Link>

        {/* NAVIGATION LINKS */}
        <div className="flex items-center space-x-8">
          {/* CURRENCY SELECTOR */}
          <select 
            value={currency}
            onChange={(e) => setCurrency(e.target.value)}
            className="bg-gray-800 text-white border border-gray-700 rounded px-2 py-1 text-sm focus:outline-none hover:border-yellow-400 transition"
          >
            <option value="USD">USD ($)</option>
            <option value="INR">INR (₹)</option>
            <option value="EUR">EUR (€)</option>
          </select>
          
          {/* Cart Icon with Badge */}
          <Link to="/cart" className="relative hover:text-yellow-400 transition">
            <span className="text-xl">🛒</span>
            {totalItems > 0 && (
              <span className="absolute -top-2 -right-3 bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                {totalItems}
              </span>
            )}
          </Link>

          {token ? (
            <>
              <Link to="/profile" className="hover:text-yellow-400 font-medium transition">
                My Orders
              </Link>
              <button 
                onClick={handleLogout}
                className="border border-white px-4 py-1 rounded hover:bg-white hover:text-gray-900 transition font-medium"
              >
                Logout
              </button>
            </>
          ) : (
            <div className="flex space-x-4">
              <Link to="/login" className="hover:text-yellow-400 font-medium transition">
                Login
              </Link>
              <Link to="/register" className="bg-yellow-400 text-gray-900 px-4 py-2 rounded font-bold hover:bg-yellow-300 transition">
                Sign Up
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  )
}

export default Navbar