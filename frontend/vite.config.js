import process from 'node:process'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

/**
 * Public site URL used for canonical links, Open Graph tags, the sitemap and robots.txt.
 * Override with the VITE_SITE_URL environment variable (e.g. after adding a custom domain).
 */
process.env.VITE_SITE_URL = (process.env.VITE_SITE_URL || 'https://hexora-labs.vercel.app').replace(/\/+$/, '')
const SITE_URL = process.env.VITE_SITE_URL

/** Indexable pages (section URLs like /services canonicalise to the home page). */
const SITEMAP_PATHS = [
  { path: '/', priority: '1.0', changefreq: 'weekly' },
  { path: '/privacy', priority: '0.3', changefreq: 'yearly' },
]

/** Emits sitemap.xml and robots.txt at build time, using SITE_URL. */
function seoFiles() {
  return {
    name: 'hexora-seo-files',
    apply: 'build',
    generateBundle() {
      const lastmod = new Date().toISOString().slice(0, 10)
      const urls = SITEMAP_PATHS.map(
        (p) =>
          `  <url>\n    <loc>${SITE_URL}${p.path}</loc>\n    <lastmod>${lastmod}</lastmod>\n    <changefreq>${p.changefreq}</changefreq>\n    <priority>${p.priority}</priority>\n  </url>`,
      ).join('\n')
      this.emitFile({
        type: 'asset',
        fileName: 'sitemap.xml',
        source: `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`,
      })
      this.emitFile({
        type: 'asset',
        fileName: 'robots.txt',
        source: `User-agent: *\nAllow: /\n\nSitemap: ${SITE_URL}/sitemap.xml\n`,
      })
    },
  }
}

export default defineConfig({
  plugins: [react(), tailwindcss(), seoFiles()],
  // During development, forward /api calls to the local backend (npm run dev:api on :8787)
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
