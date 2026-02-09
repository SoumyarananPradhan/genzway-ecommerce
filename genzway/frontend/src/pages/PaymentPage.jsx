import { loadStripe } from '@stripe/stripe-js'
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js'
import { useCart } from '../context/CartContext'
import { useCurrency } from '../context/CurrencyContext'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { useState } from 'react'

// 1. Load Stripe with your PUBLISHABLE Key
const stripePromise = loadStripe('pk_test_51SyZdfB1se9v2QXuXfxywNngEIL9C8wxgjH5s5TpiYP1ePcV5bYkCvzFTOOkrxKnXyTZvmTO8Lbe8dccxJlD1NgW00lGf6Uj5t') 

const CheckoutForm = () => {
    const stripe = useStripe()
    const elements = useElements()
    const { cartItems, clearCart } = useCart()
    const { currency, formatPrice } = useCurrency()
    const navigate = useNavigate()
    const [loading, setLoading] = useState(false)

    // Calculate Total
    const totalPrice = cartItems.reduce((acc, item) => acc + (Number(item.price) * item.quantity), 0)

    const handleSubmit = async (event) => {
        event.preventDefault()
        setLoading(true)

        if (!stripe || !elements) return

        const token = localStorage.getItem('token')

        try {
            // A. Ask Backend for a "Payment Intent" (Client Secret)
            const { data: { clientSecret } } = await axios.post(
                'http://127.0.0.1:8000/api/create-payment-intent/',
                { cartItems, currency }, 
                { headers: { 'Authorization': `Basic ${token}` } }
            )

            // B. Confirm Payment with Stripe
            const result = await stripe.confirmCardPayment(clientSecret, {
                payment_method: {
                    card: elements.getElement(CardElement),
                }
            })

            if (result.error) {
                alert(result.error.message)
                setLoading(false)
            } else {
                if (result.paymentIntent.status === 'succeeded') {
                    // C. Payment Success! Now Save Order in DB
                    await axios.post('http://127.0.0.1:8000/api/orders/add/', 
                        { cartItems, total_price: totalPrice }, 
                        { headers: { 'Authorization': `Basic ${token}` } }
                    )
                    alert("Payment Successful! Order Placed.")
                    // Clear cart (You need to add clearCart to CartContext later if missing, or just reload)
                    window.location.href = '/profile'
                }
            }
        } catch (error) {
            console.error(error)
            alert("Payment failed.")
            setLoading(false)
        }
    }

    return (
        <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow-md max-w-md mx-auto mt-10">
            <h2 className="text-2xl font-bold mb-6">Pay {formatPrice(totalPrice)}</h2>
            
            <div className="mb-6 p-4 border rounded bg-gray-50">
                <CardElement options={{
                    style: {
                        base: { fontSize: '16px', color: '#424770', '::placeholder': { color: '#aab7c4' } },
                    },
                }}/>
            </div>

            <button 
                disabled={!stripe || loading}
                className="w-full bg-black text-white font-bold py-3 rounded hover:bg-gray-800 disabled:opacity-50"
            >
                {loading ? "Processing..." : "Pay Now"}
            </button>
        </form>
    )
}

const PaymentPage = () => {
    return (
        <Elements stripe={stripePromise}>
            <div className="container mx-auto px-6 py-20">
                <CheckoutForm />
            </div>
        </Elements>
    )
}

export default PaymentPage