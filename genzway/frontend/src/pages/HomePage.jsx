import { useEffect, useState } from 'react'
import axios from 'axios'
import { Link } from 'react-router-dom'
import { useCurrency } from '../context/CurrencyContext'

const HomePage = () => {
  const [products, setProducts] = useState([])

  useEffect(() => {
    axios.get('https://genzway-backend.onrender.com/api/products/')
      .then(res => setProducts(res.data))
      .catch(err => console.error(err))
  }, [])

  const { formatPrice } = useCurrency()

  return (
    <div className="bg-gray-50 min-h-screen pb-20">
      
      {/* 1. HERO SECTION (The Banner) */}
      <div className="bg-gray-900 text-white py-20 text-center">
        <h1 className="text-5xl font-extrabold tracking-tight mb-4">
          Latest <span className="text-yellow-400">Drops</span>
        </h1>
        <p className="text-gray-400 text-lg max-w-2xl mx-auto">
          The most exclusive tech and fashion collection for the new generation.
        </p>
      </div>

      {/* 2. THE PRODUCT GRID */}
      <div className="container mx-auto px-6 -mt-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          
          {products.map(product => (
            <Link 
              to={`/product/${product.slug}`} 
              key={product.id} 
              className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition duration-300 transform hover:-translate-y-2 group"
            >
              
              {/* Image Section */}
              <div className="h-64 overflow-hidden relative">
                {product.image ? (
                  <img 
                    src={product.image} 
                    alt={product.name} 
                    className="w-full h-full object-cover group-hover:scale-110 transition duration-500" 
                  />
                ) : (
                  <div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-500">
                    No Image
                  </div>
                )}
                
                {/* Price Tag Overlay */}
                <span className="absolute bottom-2 right-2 bg-yellow-400 text-black font-bold px-3 py-1 rounded-lg shadow">
                  {formatPrice(product.price)}
                </span>
              </div>

              {/* Details Section */}
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-yellow-600 transition">
                  {product.name}
                </h3>
                <p className="text-gray-500 text-sm line-clamp-2">
                  {product.description || "No description available."}
                </p>
                <button className="mt-4 w-full bg-black text-white font-bold py-2 rounded hover:bg-gray-800 transition">
                  View Details
                </button>
              </div>

            </Link>
          ))}
          
        </div>
      </div>
    </div>
  )
}

export default HomePage