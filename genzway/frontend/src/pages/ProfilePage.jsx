import { useEffect, useState } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

const ProfilePage = () => {
  const [orders, setOrders] = useState([])
  const navigate = useNavigate()

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) {
        navigate('/login')
        return
    }

    axios.get('http://127.0.0.1:8000/api/orders/my-orders/', {
        headers: { 'Authorization': `Basic ${token}` }
    })
    .then(res => setOrders(res.data))
    .catch(err => console.error(err))
  }, [])

  return (
    <div className="container" style={{ padding: '20px' }}>
      <h1>My Orders</h1>
      
      {orders.length === 0 ? <p>No orders found.</p> : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {orders.map(order => (
                <div key={order.id} style={{ border: '1px solid #ddd', padding: '20px', borderRadius: '8px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #eee', paddingBottom: '10px' }}>
                        <h3>Order #{order.id}</h3>
                        <span style={{ fontWeight: 'bold' }}>Status: {order.status}</span>
                    </div>
                    
                    <ul style={{ marginTop: '10px' }}>
                        {order.items.map((item, index) => (
                            <li key={index}>
                                {item.quantity} x {item.product_name} (${item.product_price})
                            </li>
                        ))}
                    </ul>
                    
                    <h4 style={{ textAlign: 'right', marginTop: '10px' }}>
                        Total Paid: ${order.total_price}
                    </h4>
                </div>
            ))}
        </div>
      )}
    </div>
  )
}

export default ProfilePage