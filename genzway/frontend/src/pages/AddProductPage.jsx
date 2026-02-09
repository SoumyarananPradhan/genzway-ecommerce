import { useState, useEffect } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

const AddProductPage = () => {
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [price, setPrice] = useState('')
  const [stock, setStock] = useState('10')
  const [category, setCategory] = useState('') 
  const [image, setImage] = useState(null)
  const [categories, setCategories] = useState([])
  
  const navigate = useNavigate()

  // Fetch Categories so we can select one
  useEffect(() => {
    axios.get('https://genzway-backend.onrender.com/api/categories/')
      .then(res => setCategories(res.data))
      .catch(err => console.error(err))
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    // VALIDATION: Make sure a category is selected
    if (!category) {
        alert("Please select a category!")
        return
    }

    const token = localStorage.getItem('token')

    const formData = new FormData()
    formData.append('name', name)
    formData.append('description', description)
    formData.append('price', price)
    formData.append('stock', stock)
    formData.append('category', category) 
    
    // Only append image if one was selected
    if (image) {
        formData.append('image', image)
    }

    try {
        await axios.post('https://genzway-backend.onrender.com/api/admin/products/add/', formData, {
            headers: {
                'Authorization': `Basic ${token}`
                // DO NOT add 'Content-Type': 'multipart/form-data' here! 
                // Axios handles it automatically.
            }
        })
        alert("Product Added Successfully!")
        navigate('/admin')
    } catch (error) {
        console.error("Error Response:", error.response) // Look at this in Console if it fails
        alert(`Failed: ${JSON.stringify(error.response?.data || "Unknown Error")}`)
    }
  }

  return (
    <div className="container mx-auto px-6 py-10 max-w-lg">
      <h1 className="text-3xl font-bold mb-8">Add New Product</h1>
      
      <form onSubmit={handleSubmit} className="space-y-6 bg-white p-8 rounded-lg shadow-md">
        
        {/* Name */}
        <div>
            <label className="block text-gray-700 font-bold mb-2">Product Name</label>
            <input 
                type="text" 
                value={name} 
                onChange={e => setName(e.target.value)} 
                className="w-full border p-2 rounded" 
                required 
            />
        </div>

        {/* Category */}
        <div>
            <label className="block text-gray-700 font-bold mb-2">Category</label>
            <select 
                value={category} 
                onChange={e => setCategory(e.target.value)} 
                className="w-full border p-2 rounded" 
                required
            >
                <option value="">Select Category</option>
                {categories.map(cat => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
            </select>
        </div>

        {/* Price */}
        <div>
            <label className="block text-gray-700 font-bold mb-2">Price ($)</label>
            <input 
                type="number" 
                step="0.01"
                value={price} 
                onChange={e => setPrice(e.target.value)} 
                className="w-full border p-2 rounded" 
                required 
            />
        </div>
        {/* Stock */}
        <div>
            <label className="block text-gray-700 font-bold mb-2">Stock Quantity</label>
            <input 
                type="number" 
                value={stock} 
                onChange={e => setStock(e.target.value)} 
                className="w-full border p-2 rounded" 
                required 
            />
        </div>

        {/* Description */}
        <div>
            <label className="block text-gray-700 font-bold mb-2">Description</label>
            <textarea 
                value={description} 
                onChange={e => setDescription(e.target.value)} 
                className="w-full border p-2 rounded h-32" 
                required 
            />
        </div>

        {/* Image Upload */}
        <div>
            <label className="block text-gray-700 font-bold mb-2">Product Image</label>
            <input 
                type="file" 
                onChange={e => setImage(e.target.files[0])} 
                className="w-full" 
            />
        </div>

        <button className="w-full bg-black text-white font-bold py-3 rounded hover:bg-gray-800 transition">
            Create Product
        </button>

      </form>
    </div>
  )
}

export default AddProductPage