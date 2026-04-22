import { useState, useEffect } from 'react'

export default function ProcessingCard({ runId, startTime, onCancel }) {
  const [elapsed, setElapsed] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setElapsed(Math.floor((Date.now() - startTime) / 1000))
    }, 1000)
    return () => clearInterval(interval)
  }, [startTime])

  const fmt = (s) => {
    const m = Math.floor(s / 60)
    const sec = s % 60
    return m > 0 ? `${m}m ${sec}s` : `${sec}s`
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-8 animate-fade-in">
      <div className="flex flex-col items-center gap-8 max-w-sm w-full">

        {/* Spinner */}
        <div className="relative w-20 h-20">
          <svg className="w-20 h-20 animate-spin-slow" viewBox="0 0 80 80">
            <circle cx="40" cy="40" r="34" fill="none" stroke="#1E1E22" strokeWidth="3"/>
            <circle cx="40" cy="40" r="34" fill="none" stroke="#4F6EF7" strokeWidth="3"
              strokeDasharray="60 154" strokeLinecap="round"
              style={{ transformOrigin: '40px 40px' }}
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-2.5 h-2.5 rounded-full bg-accent animate-pulse-dot" />
          </div>
        </div>

        {/* Text */}
        <div className="flex flex-col items-center gap-2 text-center">
          <div className="flex items-center gap-2">
            <span className="text-base font-medium text-white">Workflow running</span>
            <span className="flex gap-0.5">
              {[0,1,2].map(i => (
                <span key={i} className="w-1 h-1 rounded-full bg-accent animate-pulse-dot" style={{ animationDelay: `${i * 0.2}s` }} />
              ))}
            </span>
          </div>
          <div className="flex items-center gap-3 text-sm text-muted">
            <span className="font-mono">Run #{runId}</span>
            <span>·</span>
            <span>{fmt(elapsed)} elapsed</span>
          </div>
        </div>

        {/* Warning */}
        <div className="w-full bg-surface border border-border rounded-xl p-4 flex gap-3">
          <svg className="flex-shrink-0 mt-0.5" width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M7 1L13 12H1L7 1Z" stroke="#4A4A55" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M7 5.5V7.5" stroke="#4A4A55" strokeWidth="1.3" strokeLinecap="round"/>
            <circle cx="7" cy="9.5" r="0.5" fill="#4A4A55"/>
          </svg>
          <p className="text-xs text-muted leading-relaxed">
            Do not close or reload this tab while the workflow is running. The run will continue on the server but you may lose access to the result.
          </p>
        </div>

        {/* Cancel */}
        <div className="flex flex-col items-center gap-1"></div>
        <button
          onClick={onCancel}
          className="text-xs text-muted hover:text-white transition-colors underline underline-offset-2"
        >
          Cancel and start over
        </button>
         <p className="text-xs text-muted/50">The workflow will continue running in the background.</p>
      </div>
    </div>
  )
}
