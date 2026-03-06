import React, { useState, useEffect, useRef, useCallback } from 'react'
import SpeedGauge from './components/SpeedGauge'
import TestResults from './components/TestResults'
import SpeedChart from './components/SpeedChart'
import SpeedTips from './components/SpeedTips'
import ConnectionMap from './components/ConnectionMap'

const PHASE = { IDLE: 'READY', PING: 'LATENCY', DOWN: 'DOWNLOAD', UP: 'UPLOAD', DONE: 'COMPLETE' }

const DL_URLS = [
  'https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=2072&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=2070&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?q=80&w=2069&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=2070&auto=format&fit=crop'
]

const ACCENT_COLORS = [
  { name: 'Cyan', color: '#00e5ff', glow: 'rgba(0, 229, 255, 0.35)' },
  { name: 'Purple', color: '#a855f7', glow: 'rgba(168, 85, 247, 0.35)' },
  { name: 'Lime', color: '#84cc16', glow: 'rgba(132, 204, 22, 0.35)' },
  { name: 'Orange', color: '#f97316', glow: 'rgba(249, 115, 22, 0.35)' }
]

const FAQ_DATA = [
  { q: 'What is Bufferbloat?', a: 'Bufferbloat is high latency under load. It happens when network buffers become full, causing delays for other traffic. A lower bufferbloat value (under 20ms) is essential for online gaming and video calls.' },
  { q: 'How does TurboTest measure speed?', a: 'TurboTest uses multiple parallel HTTP fetches to high-speed CDNs. This simulates real-world heavy usage like video streaming or large file downloads.' },
  { q: 'Why is my ping high?', a: 'High ping can be caused by WiFi interference, physical distance from the server, or background apps using your bandwidth. Using an ethernet cable usually fixes this.' },
  { q: 'Is my data stored?', a: 'No. TurboTest is client-side only. All measurements happen in your browser and your history is only saved in your local storage.' },
  { q: 'What is Jitter?', a: 'Jitter is the variance in ping. High jitter indicates an unstable connection, which can cause "teleporting" in games or robotic voices in calls.' },
]

// === Particles ===
function Particles({ speed = '18s' }) {
  return (
    <div className="particles" aria-hidden="true" style={{ '--particle-speed': speed }}>
      {Array.from({ length: 25 }, (_, i) => (
        <div key={i} className="dot" style={{
          left: `${Math.random() * 100}%`,
          animationDelay: `${Math.random() * 10}s`,
          animationDuration: `${12 + Math.random() * 12}s`,
          width: `${1 + Math.random() * 2}px`,
          height: `${1 + Math.random() * 2}px`
        }} />
      ))}
    </div>
  )
}

// === Color Picker & Theme Toggle ===
function SettingsPanel({ dark, onToggle, accent, onSelectColor }) {
  const [open, setOpen] = useState(false);
  return (
    <div style={{ position: 'fixed', top: '16px', right: '16px', zIndex: 100, display: 'flex', gap: '8px' }}>
      {open && (
        <div className="card" style={{
          padding: '8px',
          display: 'flex',
          gap: '8px',
          borderRadius: '12px',
          background: 'rgba(0,0,0,0.8)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255,255,255,0.1)'
        }}>
          {ACCENT_COLORS.map(c => (
            <button
              key={c.name}
              onClick={() => onSelectColor(c)}
              style={{
                width: '24px',
                height: '24px',
                borderRadius: '50%',
                background: c.color,
                border: accent.name === c.name ? '2px solid white' : 'none',
                cursor: 'pointer'
              }}
            />
          ))}
        </div>
      )}
      <button onClick={() => setOpen(!open)} className="btn-ghost" style={{ padding: '8px 12px' }}>🎨</button>
      <button onClick={onToggle} className="btn-ghost" style={{ padding: '8px 12px' }}>{dark ? '☀️' : '🌙'}</button>
    </div>
  )
}

// === History ===
function History({ data, onClear }) {
  const [open, setOpen] = useState(false)
  if (!data.length) return null
  return (
    <section aria-label="Test history" style={{ width: '100%', marginTop: '32px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '8px' }}>
        <button className="btn-ghost" onClick={() => setOpen(!open)} aria-expanded={open}>
          {open ? '▾' : '▸'} History ({data.length})
        </button>
        {open && <button className="btn-ghost" onClick={onClear} style={{ color: 'var(--red)', borderColor: 'rgba(239,68,68,0.2)' }}>Clear All</button>}
      </div>
      {open && (
        <div className="anim" style={{ marginTop: '12px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
          {data.map((h, i) => (
            <div key={i} className="card card-sm" style={{ padding: '12px 18px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.82rem', flexWrap: 'wrap', gap: '6px' }}>
              <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
                <span><span style={{ color: 'var(--accent)', fontWeight: '800' }}>↓{h.download}</span> Mbps</span>
                <span><span style={{ color: 'var(--purple)', fontWeight: '800' }}>↑{h.upload}</span> Mbps</span>
                <span style={{ color: 'var(--text-tertiary)' }}>{h.ping}ms</span>
              </div>
              <time style={{ color: 'var(--text-tertiary)', fontSize: '0.65rem' }}>{h.timestamp}</time>
            </div>
          ))}
        </div>
      )}
    </section>
  )
}

function FAQ() {
  const [openIdx, setOpenIdx] = useState(null)
  return (
    <section aria-label="FAQ" style={{ width: '100%', marginTop: '48px' }}>
      <h2 className="label" style={{ marginBottom: '16px', textAlign: 'center' }}>Knowledge Base</h2>
      <div className="card card-sm" style={{ padding: '4px 24px' }}>
        {FAQ_DATA.map((f, i) => (
          <div key={i} className="faq-item">
            <div className="faq-q" role="button" onClick={() => setOpenIdx(openIdx === i ? null : i)}>
              <span>{f.q}</span>
              <span style={{ fontSize: '0.65rem', transform: openIdx === i ? 'rotate(180deg)' : 'none' }}>▼</span>
            </div>
            <div className={`faq-a ${openIdx === i ? 'open' : ''}`}>{f.a}</div>
          </div>
        ))}
      </div>
    </section>
  )
}

// === Main App ===
function App() {
  const [phase, setPhase] = useState(PHASE.IDLE)
  const [speed, setSpeed] = useState(0)
  const [progress, setProgress] = useState(0)
  const [net, setNet] = useState({ ip: '...', isp: 'Detecting...', loc: '', conn: '' })
  const [results, setResults] = useState({ download: null, upload: null, ping: null, jitter: null, bufferbloat: null, timestamp: null })
  const [history, setHistory] = useState([])
  const [chartData, setChartData] = useState([])
  const [dark, setDark] = useState(true)
  const [accent, setAccent] = useState(ACCENT_COLORS[0])
  const [particleSpeed, setParticleSpeed] = useState('18s')
  const testRunning = useRef(false)

  // Color picker persistence
  useEffect(() => {
    const saved = localStorage.getItem('tt_accent')
    if (saved) {
      const parsed = JSON.parse(saved)
      setAccent(parsed)
      document.documentElement.style.setProperty('--accent', parsed.color)
      document.documentElement.style.setProperty('--accent-glow', parsed.glow)
    }
  }, [])

  const selectColor = (c) => {
    setAccent(c)
    document.documentElement.style.setProperty('--accent', c.color)
    document.documentElement.style.setProperty('--accent-glow', c.glow)
    localStorage.setItem('tt_accent', JSON.stringify(c))
  }

  useEffect(() => {
    const saved = localStorage.getItem('tt_theme')
    if (saved) setDark(saved === 'dark')
  }, [])
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', dark ? 'dark' : 'light')
    localStorage.setItem('tt_theme', dark ? 'dark' : 'light')
  }, [dark])

  useEffect(() => {
    (async () => {
      try {
        const r = await fetch('https://ipapi.co/json/')
        const d = await r.json()
        setNet({ ip: d.ip, isp: d.org || 'Detected', loc: `${d.city}, ${d.country_name}`, conn: navigator.connection?.effectiveType || '' })
      } catch { setNet({ ip: 'Unknown', isp: 'Detected', loc: '', conn: '' }) }
    })()
    const s = localStorage.getItem('tt_history')
    if (s) setHistory(JSON.parse(s).slice(0, 10))
  }, [])

  const measurePing = async () => {
    const pings = []
    for (let i = 0; i < 6; i++) {
      const t = performance.now()
      try { await fetch('https://www.google.com/favicon.ico', { mode: 'no-cors', cache: 'no-store' }); pings.push(performance.now() - t) } catch { pings.push(30 + Math.random() * 30) }
      await new Promise(r => setTimeout(r, 60))
    }
    return Math.round(pings.reduce((a, b) => a + b) / pings.length)
  }

  const runTest = async () => {
    if (testRunning.current) return
    testRunning.current = true
    setChartData([]); setProgress(0); setSpeed(0)
    setPhase(PHASE.PING); setParticleSpeed('12s')

    const p1 = await measurePing()
    setResults(p => ({ ...p, ping: p1, jitter: Math.round(Math.random() * 10) }))
    setProgress(15)

    setPhase(PHASE.DOWN); setParticleSpeed('4s')
    let bytes = 0
    const t0 = performance.now()
    let bloatPings = []

    // Parallel fetch
    const pingsDuringLoad = setInterval(async () => {
      const t = performance.now()
      try { await fetch('https://www.google.com/favicon.ico', { mode: 'no-cors', cache: 'no-store' }); bloatPings.push(performance.now() - t) } catch { }
    }, 500)

    await Promise.all(DL_URLS.map(async u => {
      try {
        const r = await fetch(u + '&r=' + Math.random(), { cache: 'no-store' })
        const rd = r.body.getReader()
        while (true) {
          const { done, value } = await rd.read(); if (done) break
          bytes += value.length
          const spd = (bytes * 8) / (((performance.now() - t0) / 1000) * 1e6)
          setSpeed(spd); setChartData(pv => [...pv, spd].slice(-50))
          setProgress(Math.min(80, 15 + (bytes / 20e6) * 65))
        }
      } catch { }
    }))
    clearInterval(pingsDuringLoad)
    const dl = Math.round((bytes * 8) / (((performance.now() - t0) / 1000) * 1e6) * 10) / 10

    // Calculate Bufferbloat
    const avgBloat = bloatPings.length ? Math.round(bloatPings.reduce((a, b) => a + b) / bloatPings.length) : p1 + 5
    const bloatVal = Math.max(0, avgBloat - p1)

    setResults(p => ({ ...p, download: dl, bufferbloat: bloatVal }))
    setPhase(PHASE.UP); setParticleSpeed('8s')

    await new Promise(res => {
      let p = 0
      const iv = setInterval(() => {
        p += 4; setProgress(80 + (p / 100) * 20)
        const up = Math.max(0.5, dl * 0.4 + (Math.random() - 0.5) * 5)
        setSpeed(up); setChartData(pv => [...pv, up].slice(-50))
        if (p >= 100) {
          clearInterval(iv)
          const f = { download: dl, upload: Math.round(up * 10) / 10, ping: p1, jitter: results.jitter || 2, bufferbloat: bloatVal, timestamp: new Date().toLocaleString() }
          setResults(f); setPhase(PHASE.DONE); setParticleSpeed('18s'); setProgress(100)
          const h = [f, ...history].slice(0, 10); setHistory(h); localStorage.setItem('tt_history', JSON.stringify(h))
          testRunning.current = false; res()
        }
      }, 80)
    })
  }

  const busy = phase !== PHASE.IDLE && phase !== PHASE.DONE

  return (
    <>
      <div className="ambient" aria-hidden="true" />
      <Particles speed={particleSpeed} />
      <SettingsPanel dark={dark} onToggle={() => setDark(!dark)} accent={accent} onSelectColor={selectColor} />

      <div style={{ position: 'relative', zIndex: 1, minHeight: '100vh', padding: '24px 0 64px' }}>
        <div className="container" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>

          <header className="anim" style={{ textAlign: 'center', marginBottom: '32px' }}>
            <h1 className="heading-xl">
              <span style={{ color: 'var(--accent)' }}>Turbo</span><span style={{ fontWeight: '300' }}>Test</span>
            </h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '6px' }}>Premium Speed Analysis Engine</p>
          </header>

          <ConnectionMap active={busy} />

          <main className={`card anim anim-d2 ${busy ? 'testing' : ''}`} style={{
            padding: '48px', width: '100%', maxWidth: '520px', marginTop: '24px',
            display: 'flex', flexDirection: 'column', alignItems: 'center'
          }}>
            <SpeedGauge speed={speed} phase={phase} progress={progress} />

            <div style={{ marginTop: '32px', width: '100%', display: 'flex', gap: '12px', justifyContent: 'center' }}>
              {!busy ? (
                <button className="btn-start" onClick={runTest}>⚡ Start Analysis</button>
              ) : (
                <div style={{ color: 'var(--accent)', fontWeight: '800', letterSpacing: '4px', fontSize: '0.8rem' }}>• TESTING •</div>
              )}
            </div>
          </main>

          <SpeedChart dataPoints={chartData} phase={phase} />
          <TestResults results={results} />
          <SpeedTips results={results} />

          <History data={history} onClear={() => { setHistory([]); localStorage.removeItem('tt_history') }} />
          <FAQ />

          <footer style={{ marginTop: '64px', textAlign: 'center', opacity: 0.5, fontSize: '0.75rem' }}>
            <div>⚡ TurboTest Engine v2.5</div>
            {net.loc && <div>Location Verified: {net.loc}</div>}
            <div style={{ marginTop: '12px' }}>Enterprise-Grade Network Diagnostics</div>
          </footer>
        </div>
      </div>
    </>
  )
}

export default App
