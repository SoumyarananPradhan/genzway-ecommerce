import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import HomePage from './pages/HomePage'
import ProductPage from './pages/ProductPage'
import CartPage from './pages/CartPage'
import LoginPage from './pages/LoginPage'
import ProfilePage from './pages/ProfilePage'
import RegisterPage from './pages/RegisterPage'
import Footer from './components/Footer'
import AdminDashboard from './pages/AdminDashboard'
import AddProductPage from './pages/AddProductPage'
import PaymentPage from './pages/PaymentPage'

// 1. IMPORT BOTH CONTEXT PROVIDERS
import { CurrencyProvider } from './context/CurrencyContext'
import { CartProvider } from './context/CartContext' 

function App() {
  return (
    // 2. WRAP EVERYTHING (Currency -> Cart -> App)
    <CurrencyProvider>
      <CartProvider>
        
        {/* Helper classes to make Footer stick to bottom */}
        <div className="flex flex-col min-h-screen">
          
          <Navbar />
          
          <div className="flex-grow">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/product/:slug" element={<ProductPage />} />
              <Route path="/cart" element={<CartPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/payment" element={<PaymentPage />} />
              
              {/* Admin Routes */}
              <Route path="/admin" element={<AdminDashboard />} />
              <Route path="/admin/add" element={<AddProductPage />} />
            </Routes>
          </div>

          <Footer />
          
        </div>
      </CartProvider>
    </CurrencyProvider>
  )
}

export default App