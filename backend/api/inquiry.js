// Vercel function: /api/inquiry (see src/handler.js)
import { handle } from '../src/handler.js'

export const POST = (request) => handle(request)
export const OPTIONS = (request) => handle(request)
export const GET = (request) => handle(request)
