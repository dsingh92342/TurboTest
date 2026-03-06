import React, { useState, useEffect, useCallback } from 'react'
import SpeedGauge from './components/SpeedGauge'
import TestResults from './components/TestResults'

const TEST_PHASES = {
  IDLE: 'IDLE',
  PINGING: 'PINGING',
  DOWNLOADING: 'DOWNLOADING',
  UPLOADING: 'UPLOADING',
  COMPLETED: 'COMPLETED'
}

function App() {
  const [phase, setPhase] = useState(TEST_PHASES.IDLE)
  const [currentSpeed, setCurrentSpeed] = useState(0)
  const [progress, setProgress] = useState(0)
  const [results, setResults] = useState({
    download: null,
    upload: null,
    ping: null,
    jitter: null
  })

  // Mock Speed Test Logic
  // In a real app, this would involve downloading/uploading small chunks of data and measuring time
  const startTest = useCallback(() => {
    setPhase(TEST_PHASES.PINGING)
    setResults({ download: null, upload: null, ping: null, jitter: null })

    // Phase 1: Ping
    setTimeout(() => {
      const pingValue = Math.floor(Math.random() * 20) + 5
      const jitterValue = Math.floor(Math.random() * 5) + 1
      setResults(prev => ({ ...prev, ping: pingValue, jitter: jitterValue }))

      // Phase 2: Download
      setPhase(TEST_PHASES.DOWNLOADING)
      let downProgress = 0
      const downInterval = setInterval(() => {
        downProgress += 2
        setProgress(downProgress)
        // Simulate fluctuating speed
        const speed = Math.floor(Math.random() * 150) + 100
        setCurrentSpeed(speed)

        if (downProgress >= 100) {
          clearInterval(downInterval)
          setResults(prev => ({ ...prev, download: speed }))

          // Phase 3: Upload
          setPhase(TEST_PHASES.UPLOADING)
          setProgress(0)
          let upProgress = 0
          const upInterval = setInterval(() => {
            upProgress += 4
            setProgress(upProgress)
            const speed = Math.floor(Math.random() * 50) + 30
            setCurrentSpeed(speed)

            if (upProgress >= 100) {
              clearInterval(upInterval)
              setResults(prev => ({ ...prev, upload: speed }))
              setPhase(TEST_PHASES.COMPLETED)
              setProgress(100)
            }
          }, 100)
        }
      }, 50)
    }, 1500)
  }, [])

  return (
    <div className="container" style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      padding: '40px 0'
    }}>
      <header style={{ textAlign: 'center', marginBottom: '40px' }} className="animate-fade-in">
        <h1 style={{ fontSize: '3.5rem', marginBottom: '10px' }}>
          <span style={{ color: 'var(--primary)' }}>Turbo</span>
          <span style={{ color: 'var(--text-main)' }}>Test</span>
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '1.2rem', fontWeight: '500' }}>
          Real-time Internet Speed Measurement
        </p>
      </header>

      <main style={{
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '40px'
      }} className="animate-fade-in">

        <div className="glass" style={{
          padding: '40px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          boxShadow: '0 20px 50px rgba(0,0,0,0.5)'
        }}>
          <SpeedGauge
            speed={currentSpeed}
            label={phase === TEST_PHASES.IDLE ? 'READY' : phase.replace('_', ' ')}
            progress={progress}
          />

          <div style={{ marginTop: '30px' }}>
            {phase === TEST_PHASES.IDLE || phase === TEST_PHASES.COMPLETED ? (
              <button className="btn-primary" onClick={startTest}>
                {phase === TEST_PHASES.COMPLETED ? 'Test Again' : 'Start Test'}
              </button>
            ) : (
              <div style={{ padding: '16px 40px', color: 'var(--primary)', fontWeight: '700', letterSpacing: '2px' }}>
                TESTING...
              </div>
            )}
          </div>
        </div>

        <TestResults results={results} />
      </main>

      <footer style={{ marginTop: 'auto', padding: '40px 0', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
        TurboTest &copy; {new Date().getFullYear()} • Fast & Reliable
      </footer>
    </div>
  )
}

export default App
