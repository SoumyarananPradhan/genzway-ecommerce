import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom' 
import axios from 'axios'
import { useCart } from '../context/CartContext'
import { useCurrency } from '../context/CurrencyContext'

const ProductPage = () => {
  const { slug } = useParams()
  const [product, setProduct] = useState(null)
  const { addToCart } = useCart()

  useEffect(() => {
    axios.get(`https://genzway-backend.onrender.com/api/products/${slug}/`)
      .then(res => setProduct(res.data))
      .catch(err => console.error(err))
  }, [slug])

  if (!product) return (
    <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
    </div>
  )

  const { formatPrice } = useCurrency()

  return (
    <div className="container mx-auto px-6 py-10">
      
      {/* Breadcrumb Navigation */}
      <div className="text-sm text-gray-500 mb-6">
        <Link to="/" className="hover:text-yellow-500">Home</Link> 
        <span className="mx-2">/</span>
        <span className="text-gray-900 font-medium">{product.name}</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        
        {/* LEFT: Product Image */}
        <div className="bg-white rounded-2xl shadow-lg p-4 flex items-center justify-center">
             {product.image ? (
                <img 
                    src={product.image} 
                    alt={product.name} 
                    className="max-h-[500px] w-full object-contain rounded-lg hover:scale-105 transition duration-500" 
                />
             ) : (
                <div className="h-96 w-full bg-gray-200 flex items-center justify-center text-gray-500">No Image</div>
             )}
        </div>

        {/* RIGHT: Product Details */}
        <div className="flex flex-col justify-center">
            
            <h1 className="text-4xl font-extrabold text-gray-900 mb-4">{product.name}</h1>
            
            {/* Category Tag */}
            <span className="inline-block bg-gray-200 text-gray-800 text-xs px-3 py-1 rounded-full uppercase font-bold tracking-wide mb-6 w-max">
                {product.category?.name || "Exclusive"}
            </span>

            {/* Price */}
            <div className="text-5xl font-bold text-gray-900 mb-6">
                {formatPrice(product.price)}
            </div>

            {/* Description */}
            <p className="text-gray-600 text-lg leading-relaxed mb-8 border-b pb-8">
                {product.description || "Experience premium quality with our latest collection. Designed for modern life."}
            </p>

            {/* Add to Cart Button */}
            <button 
                onClick={() => addToCart(product)}
                className="w-full bg-black text-white text-lg font-bold py-4 rounded-xl hover:bg-gray-800 hover:shadow-lg transform active:scale-95 transition duration-200 flex justify-center items-center gap-2"
            >
                <span>Add to Cart</span>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
            </button>
            
            <p className="text-green-600 font-semibold mt-4 flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                In Stock & Ready to Ship
            </p>

        </div>
      </div>
    </div>
  )
}

export default ProductPage