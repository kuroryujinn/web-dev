/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'bg-base': 'var(--bg-base)',
        'bg-panel': 'var(--bg-panel)',
        'bg-card': 'var(--bg-card)',
        'border-custom': 'var(--border)',
        'cyan-neon': 'var(--cyan)',
        'green-phosphor': 'var(--green)',
        'gold-glow': 'var(--gold)',
        'grey-visited': 'var(--grey-visited)',
        'teal-visited': 'var(--teal-visited)',
        'node-unvisited': 'var(--node-unvisited)',
        'text-primary': 'var(--text-primary)',
        'text-secondary': 'var(--text-secondary)',
      },
      fontFamily: {
        sans: ['Space Mono', 'monospace'],
        display: ['Syne', 'sans-serif'],
      },
      animation: {
        'glow-pulse': 'glow-pulse 1.5s ease-in-out infinite',
        'sweep-in': 'sweep-in 1s ease-out forwards',
        'gold-pulse': 'gold-pulse 1.5s ease-in-out infinite',
      },
      keyframes: {
        'glow-pulse': {
          '0%, 100%': { filter: 'drop-shadow(0 0 5px var(--cyan))', transform: 'scale(1)' },
          '50%': { filter: 'drop-shadow(0 0 15px var(--cyan))', transform: 'scale(1.1)' },
        },
        'sweep-in': {
          '0%': { strokeDashoffset: '1000' },
          '100%': { strokeDashoffset: '0' },
        },
        'gold-pulse': {
          '0%, 100%': { filter: 'drop-shadow(0 0 5px var(--gold))', transform: 'scale(1)' },
          '50%': { filter: 'drop-shadow(0 0 20px var(--gold))', transform: 'scale(1.2)' },
        }
      }
    },
  },
  plugins: [],
}
