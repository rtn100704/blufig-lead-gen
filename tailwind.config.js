/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['DM Sans', 'sans-serif'],
        mono: ['DM Mono', 'monospace'],
      },
      colors: {
        bg: '#0C0C0E',
        surface: '#141416',
        border: '#1E1E22',
        accent: '#4F6EF7',
        'accent-dim': '#2D3F8A',
        muted: '#4A4A55',
        subtle: '#2A2A30',
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease forwards',
        'slide-up': 'slideUp 0.4s ease forwards',
        'shake': 'shake 0.4s ease',
        'pulse-dot': 'pulseDot 1.5s ease-in-out infinite',
        'draw': 'draw 0.5s ease forwards',
        'spin-slow': 'spin 1.5s linear infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(12px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        shake: {
          '0%, 100%': { transform: 'translateX(0)' },
          '20%': { transform: 'translateX(-6px)' },
          '40%': { transform: 'translateX(6px)' },
          '60%': { transform: 'translateX(-4px)' },
          '80%': { transform: 'translateX(4px)' },
        },
        pulseDot: {
          '0%, 100%': { opacity: '1', transform: 'scale(1)' },
          '50%': { opacity: '0.4', transform: 'scale(0.8)' },
        },
        draw: {
          '0%': { strokeDashoffset: '100' },
          '100%': { strokeDashoffset: '0' },
        },
      },
    },
  },
  plugins: [],
}
