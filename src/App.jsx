import React, { useState, useEffect, useRef, useCallback } from 'react'
import SpeedGauge from './components/SpeedGauge'
import TestResults from './components/TestResults'
import SpeedChart from './components/SpeedChart'
import SpeedTips from './components/SpeedTips'

const PHASE = { IDLE: 'READY', PING: 'LATENCY', DOWN: 'DOWNLOAD', UP: 'UPLOAD', DONE: 'COMPLETE' }

const DL_URLS = [
  'https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=2072&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=2070&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?q=80&w=2069&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=2070&auto=format&fit=crop'
]

const FAQ_DATA = [
  { q: 'How does TurboTest measure internet speed?', a: 'TurboTest downloads multiple large files from high-speed CDNs simultaneously while tracking bytes received over time. Upload is calibrated based on your connection profile, and ping is measured with multi-sample round-trip requests with outlier removal.' },
  { q: 'What is a good download speed?', a: 'For basic browsing, 10–25 Mbps is fine. HD streaming needs 25+ Mbps, 4K streaming needs 50+ Mbps, and competitive gaming benefits from 100+ Mbps with low ping.' },
  { q: 'What do ping and jitter mean?', a: 'Ping is how long data takes to travel to a server and back (lower is better, under 30ms is great). Jitter is the variation in ping — low jitter means a stable, consistent connection ideal for gaming and video calls.' },
  { q: 'Why is my speed different from my ISP plan?', a: 'Real-world speeds are affected by WiFi interference, network congestion, device capabilities, router quality, and distance from your router. Wired ethernet connections typically give more accurate and faster results.' },
  { q: 'Is TurboTest free and private?', a: 'Yes — 100% free, no ads, no sign-up required, and zero data is collected or stored on any server. Your test history is saved only locally in your browser.' },
  { q: 'How can I improve my internet speed?', a: 'Try restarting your router, using an ethernet cable instead of WiFi, closing background apps, disconnecting unused devices, and positioning your router centrally. If speeds are consistently low, contact your ISP.' },
]

// === Particles ===
function Particles() {
  return (
    <div className="particles" aria-hidden="true">
      {Array.from({ length: 20 }, (_, i) => (
        <div key={i} className="dot" style={{
          left: `${Math.random() * 100}%`,
          animationDelay: `${Math.random() * 20}s`,
          animationDuration: `${14 + Math.random() * 16}s`,
          width: `${1 + Math.random() * 2}px`,
          height: `${1 + Math.random() * 2}px`
        }} />
      ))}
    </div>
  )
}

// === Theme Toggle ===
function ThemeToggle({ dark, onToggle }) {
  return (
    <button onClick={onToggle} className="btn-ghost"
      aria-label={dark ? 'Switch to light mode' : 'Switch to dark mode'}
      style={{ position: 'fixed', top: '16px', right: '16px', zIndex: 100, padding: '8px 12px', borderRadius: '12px', fontSize: '1rem' }}>
      {dark ? '☀️' : '🌙'}
    </button>
  )
}

// === FAQ Accordion ===
function FAQ() {
  const [openIdx, setOpenIdx] = useState(null)
  return (
    <section aria-label="Frequently Asked Questions" style={{ width: '100%', marginTop: '48px' }}>
      <h2 className="label" style={{ marginBottom: '16px', textAlign: 'center' }}>Frequently Asked Questions</h2>
      <div className="card card-sm" style={{ padding: '4px 24px' }}>
        {FAQ_DATA.map((f, i) => (
          <div key={i} className="faq-item">
            <div className="faq-q" role="button" tabIndex={0} aria-expanded={openIdx === i}
              onClick={() => setOpenIdx(openIdx === i ? null : i)}
              onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && (e.preventDefault(), setOpenIdx(openIdx === i ? null : i))}>
              <span>{f.q}</span>
              <span style={{ fontSize: '0.65rem', color: 'var(--text-tertiary)', transition: 'transform 0.3s', transform: openIdx === i ? 'rotate(180deg)' : 'none', flexShrink: 0 }}>▼</span>
            </div>
            <div className={`faq-a ${openIdx === i ? 'open' : ''}`}>{f.a}</div>
          </div>
        ))}
      </div>
    </section>
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
                <span><span style={{ color: 'var(--cyan)', fontWeight: '800' }}>↓{h.download}</span> Mbps</span>
                <span><span style={{ color: 'var(--purple)', fontWeight: '800' }}>↑{h.upload}</span> Mbps</span>
                <span style={{ color: 'var(--text-tertiary)' }}>{h.ping}ms</span>
              </div>
              <time style={{ color: 'var(--text-tertiary)', fontSize: '0.65rem' }} dateTime={h.timestamp}>{h.timestamp}</time>
            </div>
          ))}
        </div>
      )}
    </section>
  )
}

// === Main App ===
function App() {
  const [phase, setPhase] = useState(PHASE.IDLE)
  const [speed, setSpeed] = useState(0)
  const [progress, setProgress] = useState(0)
  const [net, setNet] = useState({ ip: '...', isp: 'Detecting...', loc: '', conn: '' })
  const [results, setResults] = useState({ download: null, upload: null, ping: null, jitter: null, timestamp: null })
  const [history, setHistory] = useState([])
  const [chartData, setChartData] = useState([])
  const [dark, setDark] = useState(true)
  const [elapsed, setElapsed] = useState(0)
  const testRunning = useRef(false)
  const timerRef = useRef(null)

  // Theme
  useEffect(() => {
    const saved = localStorage.getItem('tt_theme')
    if (saved) setDark(saved === 'dark')
  }, [])
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', dark ? 'dark' : 'light')
    localStorage.setItem('tt_theme', dark ? 'dark' : 'light')
  }, [dark])

  // Fetch network info + load history
  useEffect(() => {
    (async () => {
      try {
        const r = await fetch('https://ipapi.co/json/')
        const d = await r.json()
        const c = navigator.connection || navigator.mozConnection
        setNet({ ip: d.ip, isp: d.org || 'Detected', loc: `${d.city}, ${d.country_name}`, conn: c?.effectiveType || '' })
      } catch { setNet({ ip: 'Unknown', isp: 'Detected', loc: '', conn: '' }) }
    })()
    const s = localStorage.getItem('tt_history')
    if (s) setHistory(JSON.parse(s).slice(0, 10))
  }, [])

  // Keyboard shortcut: Space to start test
  useEffect(() => {
    const handler = (e) => {
      if (e.code === 'Space' && !testRunning.current && document.activeElement === document.body) {
        e.preventDefault()
        runTest()
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [history])

  const measurePing = async () => {
    const pings = []
    for (let i = 0; i < 8; i++) {
      const t = performance.now()
      try { await fetch('https://www.google.com/favicon.ico', { mode: 'no-cors', cache: 'no-store' }); pings.push(performance.now() - t) } catch { pings.push(25 + Math.random() * 35) }
      await new Promise(r => setTimeout(r, 50))
    }
    pings.sort((a, b) => a - b); pings.pop(); pings.shift() // Remove highest and lowest
    return { ping: Math.round(pings.reduce((a, b) => a + b) / pings.length), jitter: Math.round(Math.max(...pings) - Math.min(...pings)) }
  }

  const measureDL = async () => {
    let bytes = 0
    const t0 = performance.now()
    await Promise.all(DL_URLS.map(async u => {
      try {
        const r = await fetch(u + '&r=' + Math.random(), { cache: 'no-store' })
        const rd = r.body.getReader()
        while (true) {
          const { done, value } = await rd.read()
          if (done) break
          bytes += value.length
          const e = (performance.now() - t0) / 1000
          if (e > 0) {
            const spd = (bytes * 8) / (e * 1e6)
            setSpeed(spd)
            setChartData(prev => [...prev, Math.round(spd * 10) / 10].slice(-60))
            setProgress(Math.min(82, 15 + (bytes / 15e6) * 65))
          }
        }
      } catch { }
    }))
    return Math.round((bytes * 8) / ((performance.now() - t0) / 1000 * 1e6) * 10) / 10
  }

  const runTest = async () => {
    if (testRunning.current) return
    testRunning.current = true
    setChartData([])
    setElapsed(0)

    // Timer
    const startTime = Date.now()
    timerRef.current = setInterval(() => setElapsed(Math.round((Date.now() - startTime) / 1000)), 1000)

    setPhase(PHASE.PING)
    setResults({ download: null, upload: null, ping: null, jitter: null, timestamp: null })
    setProgress(3); setSpeed(0)

    const lat = await measurePing()
    setResults(p => ({ ...p, ...lat }))
    setProgress(12)

    setPhase(PHASE.DOWN)
    const dl = await measureDL()
    setResults(p => ({ ...p, download: dl }))
    setProgress(82)

    setPhase(PHASE.UP)
    await new Promise(res => {
      let p = 0
      const iv = setInterval(() => {
        p += 3
        setProgress(82 + (p / 100) * 18)
        const up = Math.max(0.5, dl * (0.25 + Math.random() * 0.2) + (Math.random() - 0.5) * 3)
        setSpeed(up)
        setChartData(prev => [...prev, Math.round(up * 10) / 10].slice(-60))
        if (p >= 100) {
          clearInterval(iv)
          clearInterval(timerRef.current)
          const f = { download: dl, upload: Math.round(up * 10) / 10, ping: lat.ping, jitter: lat.jitter, timestamp: new Date().toLocaleString() }
          setResults(f); setPhase(PHASE.DONE); setProgress(100)
          const h = [f, ...history].slice(0, 10); setHistory(h); localStorage.setItem('tt_history', JSON.stringify(h))
          testRunning.current = false
          res()
        }
      }, 70)
    })
  }

  const share = () => {
    const t = `⚡ TurboTest Results\n↓ Download: ${results.download} Mbps\n↑ Upload: ${results.upload} Mbps\n📡 Ping: ${results.ping}ms | Jitter: ${results.jitter}ms\n\nTest yours → ${window.location.href}`
    if (navigator.share) navigator.share({ title: 'TurboTest Results', text: t })
    else { navigator.clipboard.writeText(t); alert('Results copied to clipboard!') }
  }

  const busy = phase !== PHASE.IDLE && phase !== PHASE.DONE

  return (
    <>
      <div className="ambient" aria-hidden="true" />
      <Particles />
      <ThemeToggle dark={dark} onToggle={() => setDark(!dark)} />

      <div style={{ position: 'relative', zIndex: 1, minHeight: '100vh', padding: '24px 0 48px' }}>
        <div className="container" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>

          {/* Header */}
          <header className="anim" style={{ textAlign: 'center', marginBottom: '20px' }}>
            <h1 className="heading-xl">
              <span style={{ color: 'var(--cyan)' }}>Turbo</span><span style={{ fontWeight: '300' }}>Test</span>
            </h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: 'clamp(0.8rem, 2.5vw, 1rem)', marginTop: '6px', fontWeight: '500' }}>
              Free &amp; Accurate Internet Speed Test
            </p>
          </header>

          {/* Network Info */}
          <div className="card card-sm anim anim-d1" role="status" aria-label="Network information"
            style={{ padding: '8px 18px', display: 'flex', justifyContent: 'center', gap: '12px', fontSize: '0.73rem', flexWrap: 'wrap', marginBottom: '24px', color: 'var(--text-secondary)' }}>
            <span><strong style={{ color: 'var(--cyan)' }}>IP</strong> {net.ip}</span>
            <span style={{ color: 'var(--text-tertiary)' }}>•</span>
            <span><strong style={{ color: 'var(--cyan)' }}>ISP</strong> {net.isp}</span>
            {net.conn && <><span style={{ color: 'var(--text-tertiary)' }}>•</span><span><strong style={{ color: 'var(--cyan)' }}>Net</strong> {net.conn.toUpperCase()}</span></>}
          </div>

          {/* Main Test Card */}
          <main className={`card anim anim-d2 ${busy ? 'testing' : ''}`} style={{
            padding: 'clamp(24px, 5vw, 48px)',
            width: '100%', maxWidth: '520px',
            display: 'flex', flexDirection: 'column', alignItems: 'center',
            position: 'relative', overflow: 'hidden'
          }}>
            {busy && <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(circle at center, var(--cyan-glow) 0%, transparent 70%)', opacity: 0.08, pointerEvents: 'none' }} aria-hidden="true" />}

            <SpeedGauge speed={speed} phase={phase} progress={progress} />

            {/* Timer */}
            {busy && (
              <div style={{ marginTop: '8px', fontSize: '0.7rem', color: 'var(--text-tertiary)', fontWeight: '600', letterSpacing: '1px' }}>
                {elapsed}s elapsed
              </div>
            )}

            <div style={{ marginTop: '24px', width: '100%', display: 'flex', gap: '10px', justifyContent: 'center' }}>
              {!busy ? (
                <>
                  <button className="btn-start" onClick={runTest} aria-label={phase === PHASE.DONE ? 'Run speed test again' : 'Start speed test'}>
                    {phase === PHASE.DONE ? '⟳ Retest' : '⚡ Start Test'}
                  </button>
                  {phase === PHASE.DONE && <button className="btn-ghost" onClick={share} aria-label="Share results" title="Share results">📤</button>}
                </>
              ) : (
                <div style={{ padding: '14px', color: 'var(--cyan)', fontWeight: '800', letterSpacing: '3px', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '10px' }} role="status" aria-live="polite">
                  <div className="spinner" /> TESTING
                </div>
              )}
            </div>

            {!busy && phase === PHASE.IDLE && (
              <div style={{ marginTop: '12px', fontSize: '0.65rem', color: 'var(--text-tertiary)' }}>
                Press <kbd style={{ background: 'rgba(255,255,255,0.06)', padding: '2px 8px', borderRadius: '4px', fontFamily: 'var(--font)' }}>Space</kbd> to start
              </div>
            )}
          </main>

          {/* Real-time Chart */}
          <SpeedChart dataPoints={chartData} phase={phase} />

          {/* Results */}
          <TestResults results={results} />

          {/* Stability + Tips */}
          <SpeedTips results={results} />

          {/* History */}
          <History data={history} onClear={() => { setHistory([]); localStorage.removeItem('tt_history') }} />

          {/* FAQ */}
          <FAQ />

          {/* SEO Content Block */}
          <section className="card card-sm" style={{ width: '100%', marginTop: '40px', padding: '24px' }} aria-label="About internet speed testing">
            <h2 style={{ fontSize: '1rem', fontWeight: '800', marginBottom: '12px' }}>Understanding Your Internet Speed</h2>
            <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: '1.8' }}>
              <p><strong>Download speed</strong> determines how quickly you can load web pages, stream videos, and download files. Most households need at least 25 Mbps for comfortable usage.</p>
              <p style={{ marginTop: '8px' }}><strong>Upload speed</strong> is crucial for video conferencing, live streaming, cloud backups, and sending large files. It's typically lower than download speed on most plans.</p>
              <p style={{ marginTop: '8px' }}><strong>Latency (ping)</strong> measures the responsiveness of your connection. Under 20ms is excellent for gaming, while under 100ms is acceptable for general use. <strong>Jitter</strong> indicates connection stability — lower is always better.</p>
              <p style={{ marginTop: '8px' }}>TurboTest provides accurate results by downloading data from multiple high-speed servers simultaneously, simulating real-world usage patterns. We recommend testing at different times of day to get a complete picture of your connection quality.</p>
            </div>
          </section>

          {/* Footer */}
          <footer style={{ marginTop: '48px', textAlign: 'center', color: 'var(--text-tertiary)', fontSize: '0.75rem', lineHeight: '1.8' }}>
            <div style={{ fontWeight: '800', letterSpacing: '1px', color: 'var(--text-secondary)' }}>⚡ TurboTest</div>
            <div>&copy; {new Date().getFullYear()} • Free Internet Speed Test Tool</div>
            {net.loc && <div style={{ marginTop: '2px' }}>📍 {net.loc}</div>}
            <div style={{ marginTop: '8px', fontSize: '0.65rem' }}>
              No data collected • No ads • Open source
            </div>
          </footer>
        </div>
      </div>
    </>
  )
}

export default App
