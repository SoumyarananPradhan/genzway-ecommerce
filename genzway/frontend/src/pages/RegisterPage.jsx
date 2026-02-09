import { useState } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

const RegisterPage = () => {
  const [email, setEmail] = useState('')
  const [name, setName] = useState('')
  const [password, setPassword] = useState('')
  const navigate = useNavigate()

  const handleRegister = async (e) => {
    e.preventDefault()
    try {
        await axios.post('https://genzway-backend.onrender.com/api/accounts/register/', {
            email,
            name,
            password
        })
        alert('Registration Successful! Please Login.')
        navigate('/login')
    } catch (error) {
        console.error(error)
        alert('Registration Failed. Email might already exist.')
    }
  }

  return (
    <div className="container" style={{ maxWidth: '400px', margin: '50px auto' }}>
        <h1>Sign Up</h1>
        <form onSubmit={handleRegister} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            <input 
                type="text" 
                placeholder="Full Name" 
                value={name} 
                onChange={(e) => setName(e.target.value)}
                style={{ padding: '10px' }}
                required
            />
            <input 
                type="email" 
                placeholder="Email Address" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)}
                style={{ padding: '10px' }}
                required
            />
            <input 
                type="password" 
                placeholder="Password" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)}
                style={{ padding: '10px' }}
                required
            />
            <button style={{ padding: '10px', backgroundColor: 'black', color: 'white', border: 'none' }}>
                Register
            </button>
        </form>
    </div>
  )
}

export default RegisterPage