import { useId, useLayoutEffect, useRef, useState } from 'react'
import { motion, useReducedMotion } from 'motion/react'
import {
  Activity,
  BrainCircuit,
  Cpu,
  Database,
  Globe,
  Monitor,
  ShieldCheck,
  Smartphone,
} from 'lucide-react'
import markUrl from '../../assets/brand/logo-mark.webp'

/**
 * Hero visual: a live system-architecture diagram.
 * Client apps → Hexora API gateway → services → data, with animated request /
 * response packets, draw-in connections and hover highlighting.
 * Drawn at a fixed 600×550 design size and scaled to fit its container.
 */
const W = 600
const H = 550
const ease = [0.22, 1, 0.36, 1]

const NODE = { w: 148, h: 60 }
const nodes = [
  { id: 'web', x: 150, y: 120, icon: Globe, label: 'Web App', sub: 'React' },
  { id: 'mobile', x: 308, y: 120, icon: Smartphone, label: 'Mobile', sub: 'Flutter' },
  { id: 'desktop', x: 466, y: 120, icon: Monitor, label: 'Desktop', sub: 'Electron' },
  { id: 'gateway', x: 308, y: 232, w: 216, h: 66, label: 'API Gateway', sub: 'REST · Node.js', gateway: true },
  { id: 'auth', x: 150, y: 344, icon: ShieldCheck, label: 'Auth', sub: 'JWT · RBAC' },
  { id: 'core', x: 308, y: 344, icon: Cpu, label: 'Core Logic', sub: 'Services' },
  { id: 'ai', x: 466, y: 344, icon: BrainCircuit, label: 'AI / ML', sub: 'Python' },
  { id: 'db', x: 229, y: 452, icon: Database, label: 'Database', sub: 'PostgreSQL' },
  { id: 'analytics', x: 387, y: 452, icon: Activity, label: 'Analytics', sub: 'Dashboards' },
]
const byId = Object.fromEntries(nodes.map((n) => [n.id, n]))

const edges = [
  ['web', 'gateway'],
  ['mobile', 'gateway'],
  ['desktop', 'gateway'],
  ['gateway', 'auth'],
  ['gateway', 'core'],
  ['gateway', 'ai'],
  ['auth', 'db'],
  ['core', 'db'],
  ['core', 'analytics'],
  ['ai', 'analytics'],
]

function edgePath([a, b]) {
  const s = byId[a]
  const t = byId[b]
  const x1 = s.x
  const y1 = s.y + (s.h ?? NODE.h) / 2
  const x2 = t.x
  const y2 = t.y - (t.h ?? NODE.h) / 2
  const my = (y1 + y2) / 2
  return `M ${x1} ${y1} C ${x1} ${my}, ${x2} ${my}, ${x2} ${y2}`
}

function Node({ node, index, active, dimmed, onEnter, onLeave }) {
  const w = node.w ?? NODE.w
  const h = node.h ?? NODE.h
  const Icon = node.icon
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9, y: 10 }}
      animate={{ opacity: dimmed ? 0.55 : 1, scale: 1, y: 0 }}
      transition={{ duration: 0.6, ease, delay: 0.25 + index * 0.07, opacity: { duration: 0.3 } }}
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
      className={`absolute flex items-center gap-2.5 rounded-2xl border px-3 transition-[box-shadow,border-color] duration-300 ${
        node.gateway
          ? 'border-navy bg-navy text-white shadow-[0_22px_40px_-18px_rgb(11_35_67/0.7)]'
          : `bg-white text-navy ${active ? 'border-primary/50 shadow-lift' : 'border-line shadow-soft'}`
      }`}
      style={{ left: node.x - w / 2, top: node.y - h / 2, width: w, height: h }}
    >
      {node.gateway ? (
        <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-white">
          <img src={markUrl} alt="" width="256" height="256" className="size-8" />
        </span>
      ) : (
        <span
          className={`grid size-9 shrink-0 place-items-center rounded-xl transition-colors duration-300 ${
            active ? 'bg-primary text-white' : 'bg-ice text-primary'
          }`}
        >
          <Icon className="size-[18px]" strokeWidth={2} />
        </span>
      )}
      <span className="min-w-0 leading-tight">
        <span className={`block font-display font-semibold ${node.gateway ? 'text-[15px]' : 'text-[13.5px]'}`}>{node.label}</span>
        <span className={`mt-0.5 block truncate font-mono text-[10.5px] ${node.gateway ? 'text-cyan' : 'text-muted'}`}>
          {node.sub}
        </span>
      </span>
    </motion.div>
  )
}

export function HeroIllustration() {
  const ref = useRef(null)
  const [scale, setScale] = useState(1)
  const [hover, setHover] = useState(null)
  const reduce = useReducedMotion()
  const uid = useId().replace(/:/g, '')

  useLayoutEffect(() => {
    const el = ref.current
    if (!el) return
    const ro = new ResizeObserver(([entry]) => setScale(entry.contentRect.width / W))
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  const isLinked = (e) => hover && (e[0] === hover || e[1] === hover)
  const neighbours = new Set(hover ? edges.filter(isLinked).flat() : [])

  return (
    <div
      ref={ref}
      className="relative w-full select-none"
      style={{ aspectRatio: `${W} / ${H}` }}
      role="img"
      aria-label="Diagram of a software system built by Hexora Labs: web, mobile and desktop apps connect through an API gateway to authentication, core logic and AI services, backed by a database and analytics"
    >
      <div className="absolute left-0 top-0 origin-top-left" style={{ width: W, height: H, transform: `scale(${scale})` }}>
        {/* ground shadow */}
        <div className="absolute inset-x-10 bottom-6 h-20 rounded-[50%] bg-navy/15 blur-2xl" />

        {/* blueprint canvas */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease }}
          className="absolute left-[30px] top-[26px] h-[500px] w-[560px] overflow-hidden rounded-[28px] border border-white bg-white/80 shadow-device backdrop-blur-sm"
        >
          <div className="flex h-11 items-center justify-between border-b border-line/80 bg-white/90 px-4">
            <div className="flex items-center gap-1.5">
              <span className="size-2.5 rounded-full bg-[#d5e1ee]" />
              <span className="size-2.5 rounded-full bg-[#d5e1ee]" />
              <span className="size-2.5 rounded-full bg-[#d5e1ee]" />
              <span className="ml-3 rounded-md bg-ice px-2 py-0.5 font-mono text-[10.5px] text-navy/70">architecture.hx</span>
            </div>
            <div className="flex gap-1">
              {['Clients', 'API', 'Data'].map((t, i) => (
                <span
                  key={t}
                  className={`rounded-md px-2 py-0.5 text-[10px] font-medium ${i === 1 ? 'bg-navy text-white' : 'text-muted'}`}
                >
                  {t}
                </span>
              ))}
            </div>
          </div>
          {/* blueprint grid */}
          <div className="absolute inset-0 top-11 [background-image:linear-gradient(rgb(0_102_230/0.06)_1px,transparent_1px),linear-gradient(90deg,rgb(0_102_230/0.06)_1px,transparent_1px)] [background-size:28px_28px]" />
          {/* layer labels */}
          {[
            ['Clients', 94],
            ['Services', 318],
            ['Data', 426],
          ].map(([t, y]) => (
            <span
              key={t}
              className="absolute left-3 font-mono text-[9px] font-medium uppercase tracking-[0.18em] text-primary/45 [writing-mode:vertical-rl] rotate-180"
              style={{ top: y - 26 }}
            >
              {t}
            </span>
          ))}
        </motion.div>

        {/* connections + packets */}
        <svg viewBox={`0 0 ${W} ${H}`} className="pointer-events-none absolute inset-0 h-full w-full" aria-hidden="true">
          <defs>
            {edges.map((e, i) => (
              <path key={i} id={`${uid}-e${i}`} d={edgePath(e)} />
            ))}
          </defs>
          {edges.map((e, i) => {
            const on = isLinked(e)
            return (
              <motion.path
                key={i}
                d={edgePath(e)}
                fill="none"
                stroke={on ? '#0066E6' : '#9FBFE6'}
                strokeWidth={on ? 2.25 : 1.5}
                strokeDasharray={on ? '0' : '4 5'}
                strokeLinecap="round"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: hover && !on ? 0.35 : 1 }}
                transition={{ pathLength: { duration: 0.9, ease, delay: 0.6 + i * 0.06 }, opacity: { duration: 0.3 } }}
              />
            )
          })}
          {!reduce &&
            edges.map((e, i) => {
              const up = i % 3 === 1 // some packets travel back as responses
              const dur = 2.6 + (i % 4) * 0.45
              return (
                <circle key={`p${i}`} r={up ? 3 : 3.5} fill={up ? '#00B9F1' : '#0066E6'} opacity="0">
                  <animate attributeName="opacity" values="0;1;1;0" keyTimes="0;0.1;0.85;1" dur={`${dur}s`} begin={`${1.6 + i * 0.35}s`} repeatCount="indefinite" />
                  <animateMotion
                    dur={`${dur}s`}
                    begin={`${1.6 + i * 0.35}s`}
                    repeatCount="indefinite"
                    calcMode="linear"
                    keyPoints={up ? '1;0' : '0;1'}
                    keyTimes="0;1"
                  >
                    <mpath href={`#${uid}-e${i}`} />
                  </animateMotion>
                </circle>
              )
            })}
        </svg>

        {/* nodes */}
        {nodes.map((n, i) => (
          <Node
            key={n.id}
            node={n}
            index={i}
            active={hover === n.id || neighbours.has(n.id)}
            dimmed={hover !== null && hover !== n.id && !neighbours.has(n.id)}
            onEnter={() => setHover(n.id)}
            onLeave={() => setHover(null)}
          />
        ))}

      </div>
    </div>
  )
}
