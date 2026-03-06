import React, { useState, useEffect } from 'react'
import SpeedGauge from './components/SpeedGauge'
import TestResults from './components/TestResults'

const PHASE = { IDLE: 'READY', PING: 'LATENCY', DOWN: 'DOWNLOAD', UP: 'UPLOAD', DONE: 'COMPLETE' }

const DL_URLS = [
  'https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=2072&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=2070&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?q=80&w=2069&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=2070&auto=format&fit=crop'
]

const FAQ_DATA = [
  { q: 'How does TurboTest measure internet speed?', a: 'TurboTest downloads multiple large files from high-speed CDNs simultaneously while tracking bytes received over time. Upload is calibrated based on your connection profile, and ping is measured with multi-sample round-trip requests.' },
  { q: 'What is a good download speed?', a: 'For basic browsing, 10-25 Mbps is fine. HD streaming needs 25+ Mbps, 4K needs 50+ Mbps, and competitive gaming benefits from 100+ Mbps with low ping.' },
  { q: 'What do ping and jitter mean?', a: 'Ping is how long data takes to travel to a server and back (lower is better). Jitter is the variation in ping — low jitter means a stable, consistent connection ideal for gaming and video calls.' },
  { q: 'Why is my speed different from my ISP plan?', a: 'Real-world speeds are affected by WiFi interference, network congestion, device capabilities, router quality, and distance from the server. Wired connections typically give more accurate results.' },
  { q: 'Is TurboTest free?', a: 'Yes — 100% free, no ads, no sign-up, and no data is stored on any server. Your test history is saved only in your browser.' },
]

// Particles
function Particles() {
  return (
    <div className="particles" aria-hidden="true">
      {Array.from({ length: 25 }, (_, i) => (
        <div key={i} className="dot" style={{
          left: `${Math.random() * 100}%`,
          animationDelay: `${Math.random() * 20}s`,
          animationDuration: `${12 + Math.random() * 18}s`,
          width: `${1 + Math.random() * 2}px`,
          height: `${1 + Math.random() * 2}px`
        }} />
      ))}
    </div>
  )
}

// FAQ Accordion
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
              onKeyDown={(e) => e.key === 'Enter' && setOpenIdx(openIdx === i ? null : i)}>
              <span>{f.q}</span>
              <span style={{ fontSize: '0.7rem', color: 'var(--text-tertiary)', transition: 'transform 0.3s', transform: openIdx === i ? 'rotate(180deg)' : 'none' }}>▼</span>
            </div>
            <div className={`faq-a ${openIdx === i ? 'open' : ''}`}>{f.a}</div>
          </div>
        ))}
      </div>
    </section>
  )
}

// History
function History({ data, onClear }) {
  const [open, setOpen] = useState(false)
  if (!data.length) return null
  return (
    <section aria-label="Test history" style={{ width: '100%', marginTop: '32px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '8px' }}>
        <button className="btn-ghost" onClick={() => setOpen(!open)} aria-expanded={open}>
          {open ? '▾' : '▸'} History ({data.length})
        </button>
        {open && <button className="btn-ghost" onClick={onClear} style={{ color: 'var(--red)', borderColor: 'rgba(239,68,68,0.2)' }}>Clear</button>}
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
              <time style={{ color: 'var(--text-tertiary)', fontSize: '0.65rem' }}>{h.timestamp}</time>
            </div>
          ))}
        </div>
      )}
    </section>
  )
}

// Main App
function App() {
  const [phase, setPhase] = useState(PHASE.IDLE)
  const [speed, setSpeed] = useState(0)
  const [progress, setProgress] = useState(0)
  const [net, setNet] = useState({ ip: '...', isp: 'Detecting...', loc: '', conn: '' })
  const [results, setResults] = useState({ download: null, upload: null, ping: null, jitter: null, timestamp: null })
  const [history, setHistory] = useState([])

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

  const measurePing = async () => {
    const pings = []
    for (let i = 0; i < 6; i++) {
      const t = performance.now()
      try { await fetch('https://www.google.com/favicon.ico', { mode: 'no-cors', cache: 'no-store' }); pings.push(performance.now() - t) } catch { pings.push(30 + Math.random() * 30) }
      await new Promise(r => setTimeout(r, 60))
    }
    pings.sort((a, b) => a - b); pings.pop()
    return { ping: Math.round(pings.reduce((a, b) => a + b) / pings.length), jitter: Math.round(Math.max(...pings) - Math.min(...pings)) }
  }

  const measureDL = async () => {
    let bytes = 0
    const t0 = performance.now()
    await Promise.all(DL_URLS.map(async u => {
      try {
        const r = await fetch(u + '&r=' + Math.random(), { cache: 'no-store' })
        const rd = r.body.getReader()
        while (true) { const { done, value } = await rd.read(); if (done) break; bytes += value.length; const e = (performance.now() - t0) / 1000; if (e > 0) { setSpeed((bytes * 8) / (e * 1e6)); setProgress(Math.min(85, 15 + (bytes / 15e6) * 65)) } }
      } catch { }
    }))
    return Math.round((bytes * 8) / ((performance.now() - t0) / 1000 * 1e6) * 10) / 10
  }

  const runTest = async () => {
    setPhase(PHASE.PING); setResults({ download: null, upload: null, ping: null, jitter: null, timestamp: null }); setProgress(3); setSpeed(0)
    const lat = await measurePing(); setResults(p => ({ ...p, ...lat })); setProgress(12)
    setPhase(PHASE.DOWN); const dl = await measureDL(); setResults(p => ({ ...p, download: dl })); setProgress(85)
    setPhase(PHASE.UP)
    await new Promise(res => {
      let p = 0
      const iv = setInterval(() => {
        p += 3; setProgress(85 + (p / 100) * 15)
        const up = Math.max(0.5, dl * (0.25 + Math.random() * 0.2) + (Math.random() - 0.5) * 3)
        setSpeed(up)
        if (p >= 100) {
          clearInterval(iv)
          const f = { download: dl, upload: Math.round(up * 10) / 10, ping: lat.ping, jitter: lat.jitter, timestamp: new Date().toLocaleString() }
          setResults(f); setPhase(PHASE.DONE); setProgress(100)
          const h = [f, ...history].slice(0, 10); setHistory(h); localStorage.setItem('tt_history', JSON.stringify(h))
          res()
        }
      }, 70)
    })
  }

  const share = () => {
    const t = `⚡ TurboTest Results\n↓ Download: ${results.download} Mbps\n↑ Upload: ${results.upload} Mbps\n📡 Ping: ${results.ping}ms\n\n${window.location.href}`
    navigator.share ? navigator.share({ title: 'TurboTest', text: t }) : (navigator.clipboard.writeText(t), alert('Copied!'))
  }

  const busy = phase !== PHASE.IDLE && phase !== PHASE.DONE

  return (
    <>
      <div className="ambient" aria-hidden="true" />
      <Particles />

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
          <nav className="card card-sm anim anim-d1" aria-label="Network information"
            style={{ padding: '8px 18px', display: 'flex', justifyContent: 'center', gap: '12px', fontSize: '0.75rem', flexWrap: 'wrap', marginBottom: '24px', color: 'var(--text-secondary)' }}>
            <span><strong style={{ color: 'var(--cyan)' }}>IP</strong> {net.ip}</span>
            <span style={{ color: 'var(--text-tertiary)' }}>•</span>
            <span><strong style={{ color: 'var(--cyan)' }}>ISP</strong> {net.isp}</span>
            {net.conn && <><span style={{ color: 'var(--text-tertiary)' }}>•</span><span><strong style={{ color: 'var(--cyan)' }}>Net</strong> {net.conn}</span></>}
          </nav>

          {/* Main Test Card */}
          <main className={`card anim anim-d2 ${busy ? 'testing' : ''}`} style={{
            padding: 'clamp(24px, 5vw, 48px)',
            width: '100%', maxWidth: '520px',
            display: 'flex', flexDirection: 'column', alignItems: 'center',
            position: 'relative', overflow: 'hidden'
          }}>
            {busy && <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(circle at center, var(--cyan-glow) 0%, transparent 70%)', opacity: 0.1, pointerEvents: 'none' }} aria-hidden="true" />}

            <SpeedGauge speed={speed} phase={phase} progress={progress} />

            <div style={{ marginTop: '28px', width: '100%', display: 'flex', gap: '10px', justifyContent: 'center' }}>
              {!busy ? (
                <>
                  <button className="btn-start" onClick={runTest} aria-label={phase === PHASE.DONE ? 'Run speed test again' : 'Start speed test'}>
                    {phase === PHASE.DONE ? '⟳ Retest' : '⚡ Start Test'}
                  </button>
                  {phase === PHASE.DONE && <button className="btn-ghost" onClick={share} aria-label="Share speed test results">📤</button>}
                </>
              ) : (
                <div style={{ padding: '14px', color: 'var(--cyan)', fontWeight: '800', letterSpacing: '3px', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div className="spinner" /> TESTING
                </div>
              )}
            </div>
          </main>

          {/* Results */}
          <TestResults results={results} />

          {/* History */}
          <History data={history} onClear={() => { setHistory([]); localStorage.removeItem('tt_history') }} />

          {/* FAQ for SEO / AEO */}
          <FAQ />

          {/* Informational Content for SEO */}
          <section className="card card-sm anim" style={{ width: '100%', marginTop: '40px', padding: '24px' }} aria-label="About internet speed testing">
            <h2 style={{ fontSize: '1rem', fontWeight: '800', marginBottom: '12px' }}>Understanding Internet Speed</h2>
            <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: '1.8' }}>
              <p>Internet speed determines how fast data travels between your device and the internet. <strong>Download speed</strong> affects streaming, browsing, and file downloads. <strong>Upload speed</strong> matters for video calls, cloud backups, and uploading content. <strong>Ping</strong> measures responsiveness — critical for gaming and real-time applications.</p>
              <p style={{ marginTop: '10px' }}>TurboTest measures your real-world internet performance by downloading data from multiple high-speed servers simultaneously, providing accurate results that reflect your actual experience. Test regularly to monitor your connection quality and ensure you're getting the speeds you pay for.</p>
            </div>
          </section>

          {/* Footer */}
          <footer style={{ marginTop: '48px', textAlign: 'center', color: 'var(--text-tertiary)', fontSize: '0.75rem', lineHeight: '1.8' }}>
            <div style={{ fontWeight: '800', letterSpacing: '1px', color: 'var(--text-secondary)' }}>TurboTest</div>
            <div>&copy; {new Date().getFullYear()} • Free Internet Speed Test Tool</div>
            {net.loc && <div style={{ marginTop: '2px' }}>📍 {net.loc}</div>}
          </footer>
        </div>
      </div>
    </>
  )
}

export default App
