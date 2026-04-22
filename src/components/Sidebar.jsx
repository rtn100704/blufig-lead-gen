import { useState } from 'react'

const NAV = [
  {
    id: 'home',
    label: 'Lead & Message Gen Engine',
    icon: (
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
        <path d="M2 9L9 2L16 9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M4 7.5V15C4 15.5523 4.44772 16 5 16H7.5V12H10.5V16H13C13.5523 16 14 15.5523 14 15V7.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
  },
]

export default function Sidebar({ activePage, onNavigate }) {
  const [expanded, setExpanded] = useState(false)

  return (
    <div
      className={`h-screen bg-surface border-r border-border flex flex-col transition-all duration-300 ease-in-out ${expanded ? 'w-56' : 'w-14'}`}
      onMouseEnter={() => setExpanded(true)}
      onMouseLeave={() => setExpanded(false)}
    >
      {/* Logo */}
      <div className="h-14 flex items-center justify-center border-b border-border flex-shrink-0">
        <div className="w-7 h-7 rounded-lg bg-accent flex items-center justify-center flex-shrink-0">
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M2.5 7L6 10.5L11.5 4" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 py-3 flex flex-col gap-1 px-2">
        {NAV.map(item => (
          <button
            key={item.id}
            onClick={() => onNavigate(item.id)}
            className={`flex items-center gap-3 px-2 py-2.5 rounded-lg transition-all duration-150 text-left w-full
              ${activePage === item.id
                ? 'bg-accent/10 text-accent'
                : 'text-muted hover:text-white hover:bg-subtle'
              }`}
          >
            <span className="flex-shrink-0">{item.icon}</span>
            {expanded && (
              <span className="text-sm font-medium truncate whitespace-nowrap overflow-hidden transition-opacity duration-200">
                {item.label}
              </span>
            )}
          </button>
        ))}
      </nav>

      {/* Bottom dot */}
      <div className="h-14 flex items-center justify-center border-t border-border">
        <div className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_6px_2px_rgba(34,197,94,0.4)]" />
      </div>
    </div>
  )
}
