/**
 * Original, code-drawn UI previews for concept projects.
 * Each preview fills its parent (the "stage") and is purely decorative.
 */

const bar = (w, c = 'bg-navy/80', h = 'h-2') => <div className={`${h} ${w} rounded-full ${c}`} />

function Browser({ children, className = '' }) {
  return (
    <div className={`overflow-hidden rounded-xl border border-white bg-white shadow-device ${className}`}>
      <div className="flex items-center gap-1.5 border-b border-[#eef3f9] px-3 py-2">
        <span className="size-2 rounded-full bg-[#d5e1ee]" />
        <span className="size-2 rounded-full bg-[#d5e1ee]" />
        <span className="size-2 rounded-full bg-[#d5e1ee]" />
        <span className="ml-3 h-3 w-1/3 rounded bg-[#f1f5fa]" />
      </div>
      {children}
    </div>
  )
}

function PhoneFrame({ children, className = '' }) {
  return (
    <div className={`rounded-[26px] bg-navy p-[5px] shadow-device ${className}`}>
      <div className="relative h-full overflow-hidden rounded-[21px] bg-[#f6f9fd]">
        <div className="absolute left-1/2 top-1.5 h-3 w-12 -translate-x-1/2 rounded-full bg-navy" />
        {children}
      </div>
    </div>
  )
}

export function Campus() {
  const days = Array.from({ length: 14 })
  return (
    <Browser className="absolute inset-x-[7%] top-[12%] bottom-[-6%]">
      <div className="grid grid-cols-[1fr_1.15fr] gap-4 p-4">
        <div>
          {bar('w-20', 'bg-primary/60', 'h-1.5')}
          <div className="mt-2">{bar('w-32', 'bg-navy/85', 'h-3')}</div>
          <div className="mt-4 space-y-2">
            {['bg-primary', 'bg-cyan', 'bg-navy'].map((c, i) => (
              <div key={i} className="flex items-center gap-2.5 rounded-lg border border-[#eef3f9] p-2">
                <span className={`grid h-8 w-8 shrink-0 place-items-center rounded-md ${c} text-[9px] font-bold text-white`}>
                  {12 + i * 3}
                </span>
                <div className="flex-1 space-y-1.5">
                  {bar('w-[80%]')}
                  {bar('w-[50%]', 'bg-[#dbe6f2]', 'h-1.5')}
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="rounded-lg border border-[#eef3f9] p-2.5">
          <div className="flex justify-between">{bar('w-14', 'bg-navy/70', 'h-1.5')}{bar('w-8', 'bg-[#dbe6f2]', 'h-1.5')}</div>
          <div className="mt-3 grid grid-cols-7 gap-1">
            {days.map((_, i) => (
              <span
                key={i}
                className={`aspect-square rounded-[4px] ${
                  i === 4 ? 'bg-primary' : i === 9 ? 'bg-cyan' : i === 12 ? 'bg-navy' : 'bg-[#f1f5fa]'
                }`}
              />
            ))}
          </div>
          <div className="mt-3 h-6 rounded-md bg-primary/10" />
        </div>
      </div>
    </Browser>
  )
}

export function Cafe() {
  return (
    <Browser className="absolute inset-x-[7%] top-[12%] bottom-[-6%]">
      <div className="flex items-center justify-between px-4 pt-3">
        <span className="font-display text-[11px] font-semibold text-[#4a2e1f]">Brew&amp;Bloom</span>
        <div className="flex gap-2">{bar('w-6', 'bg-[#d8c8bb]', 'h-1.5')}{bar('w-6', 'bg-[#d8c8bb]', 'h-1.5')}{bar('w-6', 'bg-[#d8c8bb]', 'h-1.5')}</div>
      </div>
      <div className="grid grid-cols-[1.1fr_1fr] items-center gap-4 p-4">
        <div>
          <p className="font-display text-[15px] font-semibold leading-tight text-[#3a2418]">
            Slow coffee,
            <br />
            fresh blooms.
          </p>
          <div className="mt-2.5 space-y-1.5">{bar('w-[90%]', 'bg-[#e8ddd4]', 'h-1.5')}{bar('w-[70%]', 'bg-[#e8ddd4]', 'h-1.5')}</div>
          <span className="mt-3 inline-block h-5 w-16 rounded-full bg-[#4a2e1f]" />
        </div>
        <div className="relative aspect-square rounded-2xl bg-[#f3e9e1]">
          <svg viewBox="0 0 100 100" className="absolute inset-0 m-auto w-[70%]" aria-hidden="true">
            <ellipse cx="50" cy="82" rx="34" ry="6" fill="#e2d3c7" />
            <path d="M24 40 h46 v18 a23 23 0 0 1 -46 0 Z" fill="#fff" stroke="#4a2e1f" strokeWidth="3" />
            <path d="M70 46 a9 9 0 0 1 0 16" fill="none" stroke="#4a2e1f" strokeWidth="3" />
            <ellipse cx="47" cy="40" rx="23" ry="4" fill="#8a5a3c" />
            <path d="M40 30 q4 -6 0 -12 M50 30 q4 -6 0 -12" stroke="#c9a58b" strokeWidth="2.5" fill="none" strokeLinecap="round" />
          </svg>
        </div>
      </div>
    </Browser>
  )
}

export function Finance() {
  return (
    <div className="absolute inset-0 flex items-end justify-center gap-5">
      <PhoneFrame className="relative mb-[-14%] h-[108%] w-[34%] min-w-[130px]">
        <div className="px-3 pt-7">
          {bar('w-10', 'bg-[#c9d8ea]', 'h-1.5')}
          <p className="mt-1.5 font-display text-[15px] font-semibold text-navy">$ 1,240</p>
          <svg viewBox="0 0 100 100" className="mx-auto mt-2 w-[62%]" aria-hidden="true">
            <circle cx="50" cy="50" r="38" fill="none" stroke="#e3ecf6" strokeWidth="12" />
            <circle cx="50" cy="50" r="38" fill="none" stroke="#0066E6" strokeWidth="12" strokeDasharray="120 240" transform="rotate(-90 50 50)" strokeLinecap="round" />
            <circle cx="50" cy="50" r="38" fill="none" stroke="#00B9F1" strokeWidth="12" strokeDasharray="60 240" strokeDashoffset="-128" transform="rotate(-90 50 50)" strokeLinecap="round" />
          </svg>
          <div className="mt-2 space-y-1.5">
            {['bg-primary', 'bg-cyan', 'bg-navy'].map((c) => (
              <div key={c} className="flex items-center gap-2 rounded-lg bg-white p-1.5">
                <span className={`size-4 rounded ${c}`} />
                {bar('w-[55%]', 'bg-navy/60', 'h-1.5')}
              </div>
            ))}
          </div>
        </div>
      </PhoneFrame>
      <PhoneFrame className="relative mb-[-22%] hidden h-[96%] w-[30%] min-w-[116px] sm:block">
        <div className="px-3 pt-7">
          {bar('w-14', 'bg-navy/80', 'h-2')}
          <div className="mt-3 flex h-20 items-end gap-1.5">
            {[40, 65, 50, 80, 58, 92, 70].map((h, i) => (
              <span key={i} className={`flex-1 rounded-t ${i === 5 ? 'bg-primary' : 'bg-primary/20'}`} style={{ height: `${h}%` }} />
            ))}
          </div>
          <div className="mt-3 rounded-xl bg-navy p-2.5">
            {bar('w-10', 'bg-white/40', 'h-1.5')}
            <div className="mt-1.5">{bar('w-16', 'bg-white', 'h-2')}</div>
          </div>
        </div>
      </PhoneFrame>
    </div>
  )
}

export function Inventory() {
  return (
    <div className="absolute inset-x-[6%] top-[12%] bottom-[-6%] overflow-hidden rounded-xl border border-white bg-white shadow-device">
      <div className="flex h-7 items-center justify-between bg-navy px-3">
        <span className="text-[9px] font-semibold tracking-wide text-white/80">StockRoom</span>
        <div className="flex gap-1.5">
          <span className="h-1.5 w-3 rounded-full bg-white/30" />
          <span className="h-1.5 w-3 rounded-full bg-white/30" />
          <span className="h-1.5 w-3 rounded-full bg-white/30" />
        </div>
      </div>
      <div className="flex h-full">
        <div className="w-[22%] space-y-2 border-r border-[#eef3f9] bg-[#f8fbfe] p-3">
          {[1, 0, 0, 0].map((a, i) => (
            <div key={i} className={`h-5 rounded ${a ? 'bg-primary/15' : 'bg-transparent'} flex items-center px-1.5`}>
              {bar(i ? 'w-[70%]' : 'w-[80%]', a ? 'bg-primary' : 'bg-navy/30', 'h-1.5')}
            </div>
          ))}
        </div>
        <div className="flex-1 p-3">
          <div className="flex items-center justify-between">
            {bar('w-20', 'bg-navy/85', 'h-2.5')}
            <span className="h-5 w-14 rounded-md bg-primary" />
          </div>
          <div className="mt-3 overflow-hidden rounded-lg border border-[#eef3f9]">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className={`grid grid-cols-[1.6fr_1fr_0.8fr_0.7fr] items-center gap-3 px-2.5 py-2 ${i === 0 ? 'bg-[#f6f9fd]' : 'border-t border-[#eef3f9]'}`}>
                {bar('w-[80%]', i === 0 ? 'bg-navy/40' : 'bg-navy/70', 'h-1.5')}
                {bar('w-[60%]', 'bg-[#dbe6f2]', 'h-1.5')}
                {bar('w-[50%]', 'bg-[#dbe6f2]', 'h-1.5')}
                {i === 0 ? (
                  bar('w-[60%]', 'bg-navy/40', 'h-1.5')
                ) : (
                  <span className={`h-3.5 w-full rounded-full ${i === 2 ? 'bg-amber-400/30' : 'bg-cyan/20'}`} />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export function Forecast() {
  return (
    <div className="absolute inset-x-[6%] top-[12%] bottom-[-6%] overflow-hidden rounded-xl bg-navy p-4 shadow-device ring-1 ring-white/10">
      <div className="flex items-center justify-between">
        <div>
          {bar('w-14', 'bg-white/35', 'h-1.5')}
          <div className="mt-1.5">{bar('w-24', 'bg-white', 'h-2.5')}</div>
        </div>
        <div className="flex gap-1.5">
          <span className="h-5 w-10 rounded-full bg-white/10" />
          <span className="h-5 w-10 rounded-full bg-cyan/25" />
        </div>
      </div>
      <svg viewBox="0 0 300 120" className="mt-4 w-full" aria-hidden="true">
        <defs>
          <linearGradient id="pf-band" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0" stopColor="#00B9F1" stopOpacity="0.35" />
            <stop offset="1" stopColor="#00B9F1" stopOpacity="0.05" />
          </linearGradient>
        </defs>
        {[20, 50, 80, 110].map((y) => (
          <line key={y} x1="0" x2="300" y1={y} y2={y} stroke="#fff" strokeOpacity="0.07" />
        ))}
        <line x1="180" x2="180" y1="6" y2="116" stroke="#fff" strokeOpacity="0.25" strokeDasharray="3 4" />
        <path d="M180 62 C 210 50, 240 38, 296 18 L 296 56 C 240 70, 210 76, 180 74 Z" fill="url(#pf-band)" />
        <path d="M4 96 C 30 90, 46 70, 72 76 S 120 92, 140 70 S 166 60, 180 68" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" />
        <path d="M180 68 C 210 60, 240 50, 296 36" fill="none" stroke="#00B9F1" strokeWidth="2.5" strokeDasharray="6 5" strokeLinecap="round" />
        <circle cx="180" cy="68" r="4.5" fill="#00B9F1" />
      </svg>
      <div className="mt-3 grid grid-cols-3 gap-2">
        {[0, 1, 2].map((i) => (
          <div key={i} className="rounded-lg bg-white/[0.06] p-2">
            {bar('w-10', 'bg-white/30', 'h-1.5')}
            <div className="mt-1.5">{bar(i === 1 ? 'w-12' : 'w-9', i === 1 ? 'bg-cyan' : 'bg-white/80', 'h-2')}</div>
          </div>
        ))}
      </div>
    </div>
  )
}

export function Clinic() {
  return (
    <div className="absolute inset-0">
      <Browser className="absolute left-[6%] right-[24%] top-[12%] bottom-[-6%]">
        <div className="p-4">
          <div className="flex items-center justify-between">
            {bar('w-24', 'bg-navy/85', 'h-2.5')}
            <span className="h-5 w-16 rounded-full bg-primary/10" />
          </div>
          <div className="mt-3 grid grid-cols-3 gap-2">
            {['Now serving', 'Waiting', 'Next'].map((label, i) => (
              <div key={label} className={`rounded-lg p-2 ${i === 0 ? 'bg-primary text-white' : 'border border-[#eef3f9]'}`}>
                <p className={`text-[8px] font-medium ${i === 0 ? 'text-white/80' : 'text-muted'}`}>{label}</p>
                <p className={`font-display text-sm font-semibold ${i === 0 ? 'text-white' : 'text-navy'}`}>
                  {['A-14', '06', 'A-15'][i]}
                </p>
              </div>
            ))}
          </div>
          <div className="mt-3 space-y-1.5">
            {[0, 1, 2].map((i) => (
              <div key={i} className="flex items-center gap-2 rounded-md border border-[#eef3f9] px-2 py-1.5">
                <span className="size-4 rounded-full bg-ice-200" />
                {bar('w-[40%]', 'bg-navy/60', 'h-1.5')}
                <span className="ml-auto">{bar('w-8', 'bg-cyan/40', 'h-1.5')}</span>
              </div>
            ))}
          </div>
        </div>
      </Browser>
      <PhoneFrame className="absolute bottom-[-10%] right-[6%] h-[78%] w-[24%] min-w-[96px]">
        <div className="px-2.5 pt-6 text-center">
          <p className="text-[7px] font-medium text-muted">Your number</p>
          <p className="font-display text-lg font-semibold text-primary">A-17</p>
          <div className="mx-auto mt-2 size-14 rounded-full border-[5px] border-ice-200 border-t-primary" />
          <div className="mt-3 h-5 rounded-full bg-navy" />
        </div>
      </PhoneFrame>
    </div>
  )
}
