import { useState } from 'react'

export default function ResultCard({ status, runId, startTime, icpConfig, fileName, driveLink, errorDetails, onNewRun, onTryAgain }) {
  const [icpOpen, setIcpOpen] = useState(false)
  const isSuccess = status === 'completed'

  const duration = startTime ? Math.floor((Date.now() - startTime) / 1000) : null
  const fmt = (s) => {
    if (!s) return ''
    const m = Math.floor(s / 60)
    const sec = s % 60
    return m > 0 ? `${m}m ${sec}s` : `${sec}s`
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-8 animate-fade-in">
      <div className="flex flex-col items-center gap-6 max-w-md w-full">

        {/* Icon */}
        <div className={`w-16 h-16 rounded-2xl flex items-center justify-center ${isSuccess ? 'bg-green-500/10' : 'bg-red-500/10'}`}>
          {isSuccess ? (
            <svg width="28" height="28" viewBox="0 0 28 28" fill="none" className="animate-fade-in">
              <path d="M5 14L11 20L23 8" stroke="#22C55E" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
                style={{ strokeDasharray: 30, strokeDashoffset: 0, animation: 'draw 0.5s ease forwards' }}
              />
            </svg>
          ) : (
            <svg width="28" height="28" viewBox="0 0 28 28" fill="none" className="animate-fade-in">
              <path d="M7 7L21 21M21 7L7 21" stroke="#EF4444" strokeWidth="2.5" strokeLinecap="round"/>
            </svg>
          )}
        </div>

        {/* Title */}
        <div className="text-center">
          <h2 className="text-xl font-semibold text-white">
            {isSuccess ? 'Run completed' : 'Run failed'}
          </h2>
          <div className="flex items-center justify-center gap-3 mt-1.5 text-sm text-muted">
            <span className="font-mono">Run #{runId}</span>
            {duration && (
              <>
                <span>·</span>
                <span>{isSuccess ? `Completed in ${fmt(duration)}` : `Failed after ${fmt(duration)}`}</span>
              </>
            )}
          </div>
        </div>

        {/* Error details */}
        {!isSuccess && errorDetails && (
          <div className="w-full bg-red-500/5 border border-red-500/20 rounded-xl p-4">
            <p className="text-xs text-red-400 font-mono leading-relaxed">{errorDetails}</p>
          </div>
        )}

        {/* Download */}
        {isSuccess && driveLink && (
          <a
            href={driveLink}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full flex items-center justify-center gap-2.5 py-3.5 px-6 rounded-xl bg-accent text-white font-medium text-sm
              hover:bg-accent/90 hover:-translate-y-px transition-all duration-200
              shadow-[0_4px_20px_rgba(79,110,247,0.3)] hover:shadow-[0_6px_24px_rgba(79,110,247,0.4)]"
          >
            <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
              <path d="M7.5 1V10M7.5 10L4 6.5M7.5 10L11 6.5" stroke="white" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M1.5 12V13C1.5 13.5523 1.94772 14 2.5 14H12.5C13.0523 14 13.5 13.5523 13.5 13V12" stroke="white" strokeWidth="1.6" strokeLinecap="round"/>
            </svg>
            Download Output CSV
          </a>
        )}

        {/* ICP Summary */}
        {icpConfig && (
          <div className="w-full bg-surface border border-border rounded-xl overflow-hidden">
            <button
              onClick={() => setIcpOpen(o => !o)}
              className="w-full flex items-center justify-between px-4 py-3 text-sm text-white/70 hover:text-white transition-colors"
            >
              <span className="font-medium">Input Summary</span>
              <svg
                width="14" height="14" viewBox="0 0 14 14" fill="none"
                className={`transition-transform duration-200 ${icpOpen ? 'rotate-180' : ''}`}
              >
                <path d="M3 5L7 9L11 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>

            {icpOpen && (
              <div className="px-4 pb-4 flex flex-col gap-3 border-t border-border pt-3 animate-fade-in">
                <IcpRow label="Job Titles" value={icpConfig.job_titles} />
                <IcpRow label="Industries" value={icpConfig.industries} />
                <IcpRow label="Geography" value={icpConfig.geography} />
                {icpConfig.seniority?.length > 0 && <IcpRow label="Seniority" value={icpConfig.seniority.join(', ')} />}
                {icpConfig.headcount?.length > 0 && <IcpRow label="Headcount" value={icpConfig.headcount.join(', ')} />}
                {icpConfig.revenue?.length > 0 && <IcpRow label="Revenue" value={icpConfig.revenue.join(', ')} />}
                {icpConfig.notes && <IcpRow label="Notes" value={icpConfig.notes} />}
                {fileName && <IcpRow label="File" value={fileName} />}
              </div>
            )}
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-3 w-full">
          {isSuccess ? (
            <button
              onClick={onNewRun}
              className="flex-1 py-3 rounded-xl border border-border text-sm text-white/70 hover:text-white hover:border-muted transition-all duration-200"
            >
              Start New Run
            </button>
          ) : (
<button
  onClick={onNewRun}
  className="flex-1 py-3 rounded-xl bg-accent text-white font-medium text-sm hover:bg-accent/90 transition-all duration-200"
>
  Start New Run
</button>
          )}
        </div>
      </div>
    </div>
  )
}

function IcpRow({ label, value }) {
  const display = Array.isArray(value) ? value.join(', ') : value
  if (!display) return null
  return (
    <div className="flex flex-col gap-0.5">
      <span className="text-xs text-muted">{label}</span>
      <span className="text-xs text-white/80 leading-relaxed">{display}</span>
    </div>
  )
}
