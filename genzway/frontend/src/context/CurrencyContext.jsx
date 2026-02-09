import { createContext, useState, useContext } from 'react'

const CurrencyContext = createContext()

export const CurrencyProvider = ({ children }) => {
  const [currency, setCurrency] = useState('USD')

  // Hardcoded Exchange Rates (You can fetch live ones later!)
  const rates = {
    USD: 1,
    INR: 87,   // $1 = ₹87 (Approx)
    EUR: 0.95  // $1 = €0.95
  }

  const symbols = {
    USD: '$',
    INR: '₹',
    EUR: '€'
  }

  // Helper Function: Converts and Formats Price
  const formatPrice = (priceInUSD) => {
    const rate = rates[currency]
    const converted = priceInUSD * rate
    return `${symbols[currency]} ${converted.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
  }

  return (
    <CurrencyContext.Provider value={{ currency, setCurrency, formatPrice }}>
      {children}
    </CurrencyContext.Provider>
  )
}

export const useCurrency = () => useContext(CurrencyContext)