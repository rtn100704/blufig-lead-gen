import { useState, useRef, useEffect } from 'react'

export default function PinScreen({ correctPin, onAuth }) {
  const [digits, setDigits] = useState(['', '', '', ''])
  const [shake, setShake] = useState(false)
  const [error, setError] = useState(false)
  const refs = [useRef(), useRef(), useRef(), useRef()]

  useEffect(() => {
    refs[0].current?.focus()
  }, [])

  const handleChange = (i, val) => {
    if (!/^\d?$/.test(val)) return
    const next = [...digits]
    next[i] = val
    setDigits(next)
    setError(false)
    if (val && i < 3) {
      refs[i + 1].current?.focus()
    }
    if (val && i === 3) {
      const pin = [...next.slice(0, 3), val].join('')
      if (pin === correctPin) {
        onAuth()
      } else {
        setShake(true)
        setError(true)
        setTimeout(() => {
          setShake(false)
          setDigits(['', '', '', ''])
          refs[0].current?.focus()
        }, 500)
      }
    }
  }

  const handleKeyDown = (i, e) => {
    if (e.key === 'Backspace' && !digits[i] && i > 0) {
      refs[i - 1].current?.focus()
    }
  }

  return (
    <div className="min-h-screen bg-bg flex items-center justify-center">
      <div className="flex flex-col items-center gap-10 animate-fade-in">
        {/* Logo mark */}
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-accent flex items-center justify-center">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M4 10L8.5 14.5L16 6" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <span className="text-xs font-mono text-muted tracking-widest uppercase">Lead Gen Engine</span>
        </div>

        {/* Pin input */}
        <div className="flex flex-col items-center gap-6">
          <p className="text-sm text-muted">Enter your PIN to continue</p>
          <div className={`flex gap-3 ${shake ? 'animate-shake' : ''}`}>
            {digits.map((d, i) => (
              <input
                key={i}
                ref={refs[i]}
                type="password"
                inputMode="numeric"
                maxLength={1}
                value={d}
                onChange={e => handleChange(i, e.target.value)}
                onKeyDown={e => handleKeyDown(i, e)}
                className={`w-14 h-14 text-center text-xl font-mono rounded-xl border outline-none transition-all duration-200
                  bg-surface
                  ${error
                    ? 'border-red-500/50 text-red-400'
                    : d
                      ? 'border-accent text-white shadow-[0_0_0_1px_rgba(79,110,247,0.3)]'
                      : 'border-border text-white focus:border-accent focus:shadow-[0_0_0_1px_rgba(79,110,247,0.2)]'
                  }`}
              />
            ))}
          </div>
          {error && (
            <p className="text-xs text-red-400 animate-fade-in">Incorrect PIN. Try again.</p>
          )}
        </div>
      </div>
    </div>
  )
}
