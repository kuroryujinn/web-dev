/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        warm: {
          cream: 'var(--bg-warm)',
          peach: 'var(--bg-peach)',
          butter: 'var(--surface-butter)',
          coral: 'var(--surface-coral)',
          mint: 'var(--surface-mint)',
          sky: 'var(--surface-sky)',
        },
        ink: {
          DEFAULT: 'var(--ink)',
          soft: 'var(--ink-soft)',
        },
      },
      boxShadow: {
        brutal: 'var(--shadow-offset) var(--shadow-offset) 0 var(--ink)',
        brutalPressed: '0 0 0 var(--ink)',
      },
      borderWidth: {
        brutal: 'var(--border-brutal)',
      },
    },
  },
  plugins: [],
};
