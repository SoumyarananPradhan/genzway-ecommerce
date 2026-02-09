import { useState } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

const LoginPage = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const navigate = useNavigate()

  const handleLogin = async (e) => {
    e.preventDefault()
    // NOTE: In a real app, we would use a token API. 
    // For this guide, we will use Basic Auth which is simpler to set up quickly.
    
    try {
        // We make a dummy call to check credentials
        const response = await axios.get('https://genzway-backend.onrender.com/api/products/', {
            auth: { username: email, password: password }
        })
        
        // If successful, save credentials to LocalStorage (Basic Auth style)
        // WARNING: In production, use JWT tokens. This is for learning only.
        const token = btoa(`${email}:${password}`)
        localStorage.setItem('token', token)
        alert('Login Successful!')
        navigate('/cart')
    } catch (error) {
        alert('Invalid Credentials')
    }
  }

  return (
    <div className="container" style={{ maxWidth: '400px', margin: '50px auto' }}>
        <h1>Login</h1>
        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            <input 
                type="email" 
                placeholder="Email" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)}
                style={{ padding: '10px' }}
            />
            <input 
                type="password" 
                placeholder="Password" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)}
                style={{ padding: '10px' }}
            />
            <button style={{ padding: '10px', backgroundColor: 'black', color: 'white', border: 'none' }}>
                Login
            </button>
        </form>
    </div>
  )
}

export default LoginPage