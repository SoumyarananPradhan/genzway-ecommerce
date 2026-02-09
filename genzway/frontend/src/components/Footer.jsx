import { Link } from 'react-router-dom'
import { FaFacebook, FaInstagram, FaTwitter, FaLinkedin } from 'react-icons/fa'

const Footer = () => {
  const handleSubscribe = (e) => {
    e.preventDefault()
    alert("Thanks for subscribing to GenZWay updates!")
  }

  return (
    <footer className="bg-gray-900 text-white pt-16 pb-8 border-t border-gray-800">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          
          {/* COLUMN 1: BRAND */}
          <div className="space-y-4">
            <h3 className="text-2xl font-bold tracking-tighter text-yellow-400">GENZWAY</h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              The ultimate destination for Gen Z fashion and tech. 
              Cop the latest drops before they sell out.
            </p>
            <div className="flex space-x-4 pt-2">
              {/* <a href="https://twitter.com" target="_blank" rel="noreferrer" className="text-gray-400 hover:text-white transition">
                <FaTwitter size={20} />
              </a> */}
              <a href="https://www.facebook.com/aman.p.313" target="_blank" rel="noreferrer" className="text-gray-400 hover:text-white transition">
                <FaFacebook size={20} />
              </a>
              <a href="https://www.instagram.com/_im._.aman_/" target="_blank" rel="noreferrer" className="text-gray-400 hover:text-white transition">
                <FaInstagram size={20} />
              </a>
              <a href="https://www.linkedin.com/in/soumyaranjan-pradhan-/" target="_blank" rel="noreferrer" className="text-gray-400 hover:text-white transition">
                <FaLinkedin size={20} />
              </a>
            </div>
          </div>

          {/* COLUMN 2: SHOP */}
          <div>
            <h4 className="text-lg font-bold mb-6">Shop</h4>
            <ul className="space-y-3 text-sm text-gray-400">
              <li><Link to="/" className="hover:text-yellow-400 transition">All Products</Link></li>
              <li><Link to="/" className="hover:text-yellow-400 transition">New Arrivals</Link></li>
              <li><Link to="/" className="hover:text-yellow-400 transition">Featured</Link></li>
              <li><Link to="/cart" className="hover:text-yellow-400 transition">My Cart</Link></li>
            </ul>
          </div>

          {/* COLUMN 3: ACCOUNT */}
          <div>
            <h4 className="text-lg font-bold mb-6">Account</h4>
            <ul className="space-y-3 text-sm text-gray-400">
              <li><Link to="/profile" className="hover:text-yellow-400 transition">My Profile</Link></li>
              <li><Link to="/profile" className="hover:text-yellow-400 transition">Order History</Link></li>
              <li><Link to="/login" className="hover:text-yellow-400 transition">Login / Register</Link></li>
              <li><Link to="/admin" className="hover:text-yellow-400 transition">Admin Dashboard</Link></li>
            </ul>
          </div>

          {/* COLUMN 4: NEWSLETTER */}
          <div>
            <h4 className="text-lg font-bold mb-6">Stay in the loop</h4>
            <p className="text-gray-400 text-sm mb-4">Get 10% off your first order when you sign up.</p>
            <form onSubmit={handleSubscribe} className="space-y-3">
              <input 
                type="email" 
                placeholder="Enter your email" 
                className="w-full bg-gray-800 border border-gray-700 text-white px-4 py-3 rounded focus:outline-none focus:border-yellow-400 transition"
                required
              />
              <button className="w-full bg-yellow-400 text-black font-bold py-3 rounded hover:bg-yellow-300 transition">
                Subscribe
              </button>
            </form>
          </div>

        </div>

        {/* BOTTOM BAR */}
        <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center text-sm text-gray-500">
          <p>&copy; {new Date().getFullYear()} GenZWay Inc. All rights reserved.</p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <span className="hover:text-white cursor-pointer">Privacy Policy</span>
            <span className="hover:text-white cursor-pointer">Terms of Service</span>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer