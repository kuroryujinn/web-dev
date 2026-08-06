import { defineConfig } from 'vite'
import { configDefaults } from 'vitest/config'
import { playwright } from '@vitest/browser-playwright'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vitejs.dev/config/
//
// Two test projects:
//  - `jsdom`   : the fast unit/integration suite (default `npm test`).
//  - `browser` : real-browser tests via Playwright (chromium), gated behind
//                the `*.browser.test.{js,jsx}` filename convention so the
//                jsdom project never picks them up.
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  test: {
    globals: true,
    css: true,
    projects: [
      {
        extends: true,
        test: {
          name: 'jsdom',
          environment: 'jsdom',
          setupFiles: './src/test/setupTests.js',
          include: ['src/**/*.test.{js,jsx}'],
          exclude: [...configDefaults.exclude, '**/*.browser.test.{js,jsx}'],
        },
      },
      {
        extends: true,
        test: {
          name: 'browser',
          setupFiles: './src/test/setupTests.js',
          include: ['src/**/*.browser.test.{js,jsx}'],
          browser: {
            enabled: true,
            provider: playwright(),
            instances: [{ browser: 'chromium' }],
            headless: true,
          },
        },
      },
    ],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html'],
      include: ['src/**/*.{js,jsx}'],
      exclude: ['src/test/**', 'src/**/__tests__/**', 'src/**/*.test.{js,jsx}', 'src/**/*.browser.test.{js,jsx}'],
    },
  },
})
