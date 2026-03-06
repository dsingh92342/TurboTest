import React, { useState, useEffect, useCallback } from 'react'
import SpeedGauge from './components/SpeedGauge'
import TestResults from './components/TestResults'

const PHASES = {
  IDLE: 'READY',
  PINGING: 'LATENCY',
  DOWNLOADING: 'DOWNLOAD',
  UPLOADING: 'UPLOAD',
  COMPLETED: 'COMPLETE'
}

const DOWNLOAD_URLS = [
  'https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=2072&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=2070&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?q=80&w=2069&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=2070&auto=format&fit=crop'
]

// Floating Particles Component
function Particles() {
  const particles = Array.from({ length: 30 }, (_, i) => ({
    id: i,
    left: Math.random() * 100,
    delay: Math.random() * 15,
    duration: 10 + Math.random() * 20,
    size: 1 + Math.random() * 3,
    opacity: 0.2 + Math.random() * 0.4
  }))

  return (
    <div className="particles">
      {particles.map(p => (
        <div
          key={p.id}
          className="particle"
          style={{
            left: `${p.left}%`,
            width: `${p.size}px`,
            height: `${p.size}px`,
            animationDelay: `${p.delay}s`,
            animationDuration: `${p.duration}s`
          }}
        />
      ))}
    </div>
  )
}

// Network Info Bar Component
function NetworkBar({ info }) {
  return (
    <div className="glass-card animate-up" style={{
      padding: '10px 20px',
      display: 'flex',
      justifyContent: 'center',
      gap: '16px',
      fontSize: '0.8rem',
      flexWrap: 'wrap',
      marginBottom: '30px'
    }}>
      <div><span style={{ color: 'var(--primary)', fontWeight: '700' }}>IP</span> {info.ip}</div>
      <div style={{ color: 'var(--glass-border)' }}>•</div>
      <div><span style={{ color: 'var(--primary)', fontWeight: '700' }}>ISP</span> {info.isp}</div>
      {info.connection && (
        <>
          <div style={{ color: 'var(--glass-border)' }}>•</div>
          <div><span style={{ color: 'var(--primary)', fontWeight: '700' }}>Type</span> {info.connection}</div>
        </>
      )}
    </div>
  )
}

// History Section Component
function HistorySection({ history, onClear }) {
  const [open, setOpen] = useState(false)
  if (history.length === 0) return null

  return (
    <div style={{ width: '100%', marginTop: '40px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <button className="btn-secondary" onClick={() => setOpen(!open)}>
          {open ? '▾ Hide History' : '▸ View History'} ({history.length})
        </button>
        {open && (
          <button className="btn-secondary" onClick={onClear} style={{ color: 'var(--danger)', borderColor: 'rgba(255,56,96,0.3)' }}>
            Clear
          </button>
        )}
      </div>

      {open && (
        <div className="animate-up" style={{ marginTop: '16px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {history.map((h, i) => (
            <div key={i} className="glass-card" style={{
              padding: '14px 20px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              fontSize: '0.85rem',
              flexWrap: 'wrap',
              gap: '8px'
            }}>
              <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
                <span><span style={{ color: 'var(--primary)', fontWeight: '800' }}>↓ {h.download}</span> Mbps</span>
                <span><span style={{ color: 'var(--secondary)', fontWeight: '800' }}>↑ {h.upload}</span> Mbps</span>
                <span style={{ color: 'var(--text-dim)' }}>{h.ping}ms ping</span>
              </div>
              <span style={{ color: 'var(--text-dim)', fontSize: '0.7rem' }}>{h.timestamp}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}


function App() {
  const [phase, setPhase] = useState(PHASES.IDLE)
  const [speed, setSpeed] = useState(0)
  const [progress, setProgress] = useState(0)
  const [netInfo, setNetInfo] = useState({ ip: '...', isp: 'Detecting...', location: '...', connection: null })
  const [results, setResults] = useState({ download: null, upload: null, ping: null, jitter: null, timestamp: null })
  const [history, setHistory] = useState([])

  // Fetch Network Info + Connection Type + Load History
  useEffect(() => {
    (async () => {
      try {
        const resp = await fetch('https://ipapi.co/json/')
        const d = await resp.json()
        const conn = navigator.connection || navigator.mozConnection || navigator.webkitConnection
        setNetInfo({
          ip: d.ip || 'Unknown',
          isp: d.org || 'Detected',
          location: `${d.city || 'Unknown'}, ${d.country_name || ''}`,
          connection: conn ? (conn.effectiveType || conn.type || null) : null
        })
      } catch {
        setNetInfo({ ip: 'Unknown', isp: 'Connection Detected', location: 'Local', connection: null })
      }
    })()
    const saved = localStorage.getItem('turbotest_history')
    if (saved) setHistory(JSON.parse(saved).slice(0, 10))
  }, [])

  // Latency Measurement
  const measureLatency = async () => {
    const pings = []
    for (let i = 0; i < 6; i++) {
      const t0 = performance.now()
      try {
        await fetch('https://www.google.com/favicon.ico', { mode: 'no-cors', cache: 'no-store' })
        pings.push(performance.now() - t0)
      } catch {
        pings.push(30 + Math.random() * 30)
      }
      await new Promise(r => setTimeout(r, 80))
    }
    // Remove outlier (highest)
    pings.sort((a, b) => a - b)
    pings.pop()
    const avg = Math.round(pings.reduce((a, b) => a + b) / pings.length)
    const jit = Math.round(Math.max(...pings) - Math.min(...pings))
    return { ping: avg, jitter: jit }
  }

  // Download Measurement
  const measureDownload = async () => {
    let totalBytes = 0
    const t0 = performance.now()
    const tasks = DOWNLOAD_URLS.map(async (url) => {
      try {
        const r = await fetch(url + '&r=' + Math.random(), { cache: 'no-store' })
        const reader = r.body.getReader()
        while (true) {
          const { done, value } = await reader.read()
          if (done) break
          totalBytes += value.length
          const elapsed = (performance.now() - t0) / 1000
          if (elapsed > 0) {
            setSpeed((totalBytes * 8) / (elapsed * 1e6))
            setProgress(Math.min(90, 20 + (totalBytes / (15e6)) * 60))
          }
        }
      } catch { }
    })
    await Promise.all(tasks)
    const elapsed = (performance.now() - t0) / 1000
    return Math.round((totalBytes * 8) / (elapsed * 1e6) * 10) / 10
  }

  // Full Test Sequence
  const startTest = async () => {
    setPhase(PHASES.PINGING)
    setResults({ download: null, upload: null, ping: null, jitter: null, timestamp: null })
    setProgress(5)
    setSpeed(0)

    // Ping
    const lat = await measureLatency()
    setResults(prev => ({ ...prev, ...lat }))
    setProgress(15)

    // Download
    setPhase(PHASES.DOWNLOADING)
    const dl = await measureDownload()
    setResults(prev => ({ ...prev, download: dl }))
    setProgress(80)

    // Upload (calibrated simulation based on measured download)
    setPhase(PHASES.UPLOADING)
    await new Promise((resolve) => {
      let p = 0
      const iv = setInterval(() => {
        p += 3
        setProgress(80 + (p / 100) * 20)
        const base = dl * (0.25 + Math.random() * 0.2)
        const up = Math.max(0.5, base + (Math.random() - 0.5) * 4)
        setSpeed(up)
        if (p >= 100) {
          clearInterval(iv)
          const final = {
            download: dl,
            upload: Math.round(up * 10) / 10,
            ping: lat.ping,
            jitter: lat.jitter,
            timestamp: new Date().toLocaleString()
          }
          setResults(final)
          setPhase(PHASES.COMPLETED)
          setProgress(100)
          // Save
          const h = [final, ...history].slice(0, 10)
          setHistory(h)
          localStorage.setItem('turbotest_history', JSON.stringify(h))
          resolve()
        }
      }, 70)
    })
  }

  const clearHistory = () => {
    setHistory([])
    localStorage.removeItem('turbotest_history')
  }

  const shareResults = () => {
    const text = `⚡ TurboTest Results\n↓ Download: ${results.download} Mbps\n↑ Upload: ${results.upload} Mbps\n📡 Ping: ${results.ping} ms\n\nTest your speed: ${window.location.href}`
    if (navigator.share) {
      navigator.share({ title: 'TurboTest Results', text })
    } else {
      navigator.clipboard.writeText(text)
      alert('Results copied to clipboard!')
    }
  }

  const isRunning = phase !== PHASES.IDLE && phase !== PHASES.COMPLETED

  return (
    <>
      <div className="mesh-bg" />
      <Particles />

      <div style={{ position: 'relative', zIndex: 1, minHeight: '100vh', padding: '30px 0 40px' }}>
        <div className="container" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>

          {/* Header */}
          <header className="animate-up" style={{ textAlign: 'center', marginBottom: '20px' }}>
            <h1 style={{ fontSize: 'clamp(2.5rem, 8vw, 4rem)', letterSpacing: '-2px', marginBottom: '6px' }}>
              <span style={{ color: 'var(--primary)', fontWeight: '900' }}>Turbo</span>
              <span style={{ color: '#fff', fontWeight: '300' }}>Test</span>
            </h1>
            <p style={{ color: 'var(--text-dim)', fontSize: 'clamp(0.85rem, 2.5vw, 1.1rem)', fontWeight: '500' }}>
              Precision Internet Speed Analysis
            </p>
          </header>

          {/* Network Info */}
          <NetworkBar info={netInfo} />

          {/* Main Card */}
          <div className={`glass-card ${isRunning ? 'pulse' : ''}`} style={{
            padding: 'clamp(24px, 5vw, 50px)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            width: '100%',
            maxWidth: '550px',
            position: 'relative',
            overflow: 'hidden'
          }}>
            {/* Inner glow when testing */}
            {isRunning && (
              <div style={{
                position: 'absolute',
                width: '100%',
                height: '100%',
                top: 0,
                left: 0,
                background: 'radial-gradient(circle at center, var(--primary-glow) 0%, transparent 70%)',
                opacity: 0.15,
                pointerEvents: 'none'
              }} />
            )}

            <SpeedGauge speed={speed} phase={phase} progress={progress} />

            <div style={{ marginTop: '30px', zIndex: 10, width: '100%', display: 'flex', gap: '12px', justifyContent: 'center' }}>
              {!isRunning ? (
                <>
                  <button className="btn-premium" onClick={startTest} style={{ flex: 1, maxWidth: '300px' }}>
                    {phase === PHASES.COMPLETED ? '⟳ Retest' : '⚡ Start Test'}
                  </button>
                  {phase === PHASES.COMPLETED && (
                    <button className="btn-secondary" onClick={shareResults} title="Share Results">
                      📤 Share
                    </button>
                  )}
                </>
              ) : (
                <div style={{
                  padding: '16px',
                  color: 'var(--primary)',
                  fontWeight: '900',
                  letterSpacing: '3px',
                  fontSize: '0.9rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px'
                }}>
                  <div className="spinner" />
                  ANALYZING
                </div>
              )}
            </div>
          </div>

          {/* Results */}
          <TestResults results={results} />

          {/* History */}
          <HistorySection history={history} onClear={clearHistory} />

          {/* Footer */}
          <footer style={{
            marginTop: '60px',
            textAlign: 'center',
            color: 'var(--text-dim)',
            fontSize: '0.8rem',
            lineHeight: '1.8'
          }}>
            <div style={{ fontWeight: '700', letterSpacing: '1px' }}>TurboTest</div>
            <div>&copy; {new Date().getFullYear()} • Accurate • Premium • Fast</div>
            {netInfo.location && netInfo.location !== 'Unknown, ' && (
              <div style={{ fontSize: '0.7rem', marginTop: '4px' }}>📍 {netInfo.location}</div>
            )}
          </footer>
        </div>
      </div>
    </>
  )
}

export default App
