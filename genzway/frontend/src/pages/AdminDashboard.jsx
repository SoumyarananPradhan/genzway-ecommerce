import { useEffect, useState } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

const AdminDashboard = () => {
  const [stats, setStats] = useState(null)
  const navigate = useNavigate()

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) {
        navigate('/login')
        return
    }

    // Fetch Admin Stats
    axios.get('http://127.0.0.1:8000/api/admin/stats/', {
        headers: { 'Authorization': `Basic ${token}` }
    })
    .then(res => setStats(res.data))
    .catch(err => {
        console.error(err)
        alert("Access Denied: You are not an Admin!")
        navigate('/')
    })
  }, [])

  if (!stats) return (
    <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
    </div>
  )

  const handleStatusChange = async (orderId, newStatus) => {
    const token = localStorage.getItem('token')
    try {
        await axios.put(`http://127.0.0.1:8000/api/admin/orders/${orderId}/update/`, 
            { status: newStatus },
            { headers: { 'Authorization': `Basic ${token}` } }
        )
        // Update the UI locally so we don't need to refresh
        setStats(prevStats => ({
            ...prevStats,
            recent_orders: prevStats.recent_orders.map(order => 
                order.id === orderId ? { ...order, status: newStatus } : order
            )
        }))
        alert(`Order #${orderId} updated to ${newStatus}`)
    } catch (error) {
        console.error(error)
        alert("Failed to update status")
    }
  }

  return (
    <div className="container mx-auto px-6 py-10">
      <h1 className="text-4xl font-extrabold mb-8 text-gray-900">Admin Dashboard</h1>
        <button 
        onClick={() => navigate('/admin/add')}
        className="bg-black text-white px-6 py-2 rounded-lg font-bold hover:bg-gray-800 transition"
        >
        + Add Product
        </button>
      {/* 1. STATS CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        
        {/* Revenue Card */}
        <div className="bg-gradient-to-r from-green-400 to-green-600 p-6 rounded-xl shadow-lg text-white">
            <h3 className="font-bold uppercase text-sm tracking-wider opacity-80">Total Revenue</h3>
            <p className="text-4xl font-bold mt-2">${stats.total_revenue}</p>
        </div>

        {/* Orders Card */}
        <div className="bg-gradient-to-r from-blue-400 to-blue-600 p-6 rounded-xl shadow-lg text-white">
            <h3 className="font-bold uppercase text-sm tracking-wider opacity-80">Total Orders</h3>
            <p className="text-4xl font-bold mt-2">{stats.total_orders}</p>
        </div>

        {/* Products Card */}
        <div className="bg-gradient-to-r from-purple-400 to-purple-600 p-6 rounded-xl shadow-lg text-white">
            <h3 className="font-bold uppercase text-sm tracking-wider opacity-80">Active Products</h3>
            <p className="text-4xl font-bold mt-2">{stats.total_products}</p>
        </div>
      </div>

      {/* 2. RECENT ORDERS TABLE */}
      <h2 className="text-2xl font-bold mb-6 text-gray-800 border-b pb-2">Recent Orders</h2>
      <div className="bg-white rounded-xl shadow overflow-hidden border border-gray-100">
        <table className="min-w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                    <th className="py-4 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order ID</th>
                    <th className="py-4 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                    <th className="py-4 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                    <th className="py-4 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="py-4 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
                {stats.recent_orders.map(order => (
                    <tr key={order.id} className="hover:bg-gray-50 transition">
                        <td className="py-4 px-6 font-medium text-gray-900">#{order.id}</td>
                        <td className="py-4 px-6 text-gray-600">{order.user}</td>
                        <td className="py-4 px-6 font-bold text-gray-900">${order.total_price}</td>
                        <td className="py-4 px-6">
                            <select 
                                value={order.status}
                                onChange={(e) => handleStatusChange(order.id, e.target.value)}
                                className={`px-3 py-1 rounded-full text-xs font-bold border-none cursor-pointer outline-none ${
                                    order.status === 'Pending' 
                                    ? 'bg-yellow-100 text-yellow-800' 
                                    : 'bg-green-100 text-green-800'
                                }`}
                            >
                                <option value="Pending">Pending</option>
                                <option value="Delivered">Delivered</option>
                                <option value="Cancelled">Cancelled</option>
                            </select>
                        </td>
                        <td className="py-4 px-6 text-gray-500 text-sm">
                            {new Date(order.created_at).toLocaleDateString()}
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
      </div>
    </div>
  )
}

export default AdminDashboard