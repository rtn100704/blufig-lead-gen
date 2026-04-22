import { useState, useEffect } from 'react'
import PinScreen from './components/PinScreen.jsx'
import Dashboard from './components/Dashboard.jsx'

const CORRECT_PIN = import.meta.env.VITE_PIN || '8013'

export default function App() {
  const [authenticated, setAuthenticated] = useState(false)

  useEffect(() => {
    const auth = sessionStorage.getItem('blufig_auth')
    if (auth === 'true') setAuthenticated(true)
  }, [])

  const handleAuth = () => {
    sessionStorage.setItem('blufig_auth', 'true')
    setAuthenticated(true)
  }

  if (!authenticated) {
    return <PinScreen correctPin={CORRECT_PIN} onAuth={handleAuth} />
  }

  return <Dashboard />
}
