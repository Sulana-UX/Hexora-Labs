// Vercel function: /api/health (see src/handler.js)
import { handle } from '../src/handler.js'

export const GET = (request) => handle(request)
