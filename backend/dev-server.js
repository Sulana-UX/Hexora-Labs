/**
 * Local development server for the API (production runs on Vercel).
 * Serves the same handler as the Vercel functions on http://127.0.0.1:8787.
 * Reads secrets from backend/.env (git-ignored) — see .env.example.
 */
import { createServer } from 'node:http'
import { handle } from './src/handler.js'

const PORT = 8787

createServer(async (req, res) => {
  try {
    const chunks = []
    for await (const c of req) chunks.push(c)
    const body = chunks.length ? Buffer.concat(chunks) : undefined
    const request = new Request(`http://127.0.0.1:${PORT}${req.url}`, {
      method: req.method,
      headers: req.headers,
      body: ['GET', 'HEAD'].includes(req.method) ? undefined : body,
    })
    const response = await handle(request)
    res.writeHead(response.status, Object.fromEntries(response.headers))
    res.end(Buffer.from(await response.arrayBuffer()))
  } catch (err) {
    console.error(err)
    res.writeHead(500, { 'Content-Type': 'application/json' })
    res.end(JSON.stringify({ success: false, message: 'Server error' }))
  }
}).listen(PORT, '127.0.0.1', () => console.log(`API running at http://127.0.0.1:${PORT}`))
