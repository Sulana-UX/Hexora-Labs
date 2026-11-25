import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  // During `npm run dev`, forward /api calls to `npm run dev:api` (Cloudflare Functions on :8788)
  server: { proxy: { '/api': 'http://127.0.0.1:8788' } },
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
