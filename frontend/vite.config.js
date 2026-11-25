import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  // During development, forward /api calls to the backend Worker (npm run dev:api on :8787)
  server: { proxy: { '/api': 'http://127.0.0.1:8787' } },
  build: {
    outDir: 'dist',
    assetsInlineLimit: 4096,
    rolldownOptions: {
      output: {
        // Separate long-lived vendor chunks so app updates don't invalidate them.
        codeSplitting: {
          groups: [
            { name: 'react', test: /node_modules[\\/](react|react-dom|scheduler)[\\/]/ },
            { name: 'router', test: /node_modules[\\/](react-router|react-router-dom)[\\/]/ },
            { name: 'motion', test: /node_modules[\\/](motion|motion-dom|motion-utils|framer-motion)[\\/]/ },
          ],
        },
      },
    },
  },
})
