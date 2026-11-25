import { useEffect } from 'react'
import { site } from '../config/site'

function setMeta(selector, attr, value) {
  const el = document.head.querySelector(selector)
  if (el && value) el.setAttribute(attr, value)
}

/**
 * Per-page SEO: document title, description, canonical URL, Open Graph / Twitter
 * text and robots directive.
 *
 * @param {string} title
 * @param {string} [description]
 * @param {{ path?: string, noindex?: boolean }} [options]
 *   path    – canonical path for this page (default '/')
 *   noindex – keep this page out of search results (e.g. 404)
 */
export function useDocumentTitle(title, description, { path = '/', noindex = false } = {}) {
  useEffect(() => {
    if (!title) return
    const base = site.url || window.location.origin
    const url = `${base}${path}`

    document.title = title
    setMeta('meta[name="description"]', 'content', description)
    setMeta('meta[property="og:description"]', 'content', description)
    setMeta('meta[name="twitter:description"]', 'content', description)
    setMeta('meta[property="og:title"]', 'content', title)
    setMeta('meta[name="twitter:title"]', 'content', title)
    setMeta('meta[property="og:url"]', 'content', url)
    setMeta('link[rel="canonical"]', 'href', url)
    setMeta('meta[name="robots"]', 'content', noindex ? 'noindex, follow' : 'index, follow, max-image-preview:large')
  }, [title, description, path, noindex])
}
