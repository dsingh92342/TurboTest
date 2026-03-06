import React, { useMemo } from 'react';

const SpeedGauge = ({ speed, phase, progress = 0 }) => {
  const s = 240;
  const r = s / 2;
  const sw = 10;
  const nr = r - sw * 2;
  const circ = nr * 2 * Math.PI;
  const offset = circ - (progress / 100) * circ;

  const ticks = useMemo(() => {
    const arr = [];
    for (let i = 0; i <= 40; i++) {
      const a = (i * 6) - 210;
      arr.push({ a, major: i % 10 === 0 });
    }
    return arr;
  }, []);

  return (
    <div role="meter" aria-label="Current speed" aria-valuenow={Math.round(speed)} aria-valuemin={0} aria-valuemax={500}
      style={{ position: 'relative', width: '100%', maxWidth: '320px', aspectRatio: '1', margin: '0 auto' }}>

      {/* Outer Pulse during idle */}
      {!phase || phase === 'READY' ? (
        <div style={{
          position: 'absolute',
          inset: '10%',
          border: '1px solid var(--accent)',
          borderRadius: '50%',
          opacity: 0.2,
          animation: 'pulse-gauge 2s infinite'
        }} />
      ) : null}

      <svg viewBox={`0 0 ${s} ${s}`} style={{
        width: '100%', height: '100%',
        filter: progress > 0 ? 'drop-shadow(0 0 15px var(--accent-glow))' : 'none',
        transition: 'filter 0.5s'
      }}>
        <defs>
          <linearGradient id="gauge-grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="var(--accent)" />
            <stop offset="100%" stopColor="var(--purple)" />
          </linearGradient>
          <filter id="gauge-glow">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Backdrop circle */}
        <circle cx={r} cy={r} r={nr} fill="rgba(0,0,0,0.2)" />

        {/* Ticks */}
        {ticks.map((t, i) => {
          const oR = r - 8, iR = r - (t.major ? 26 : 18);
          const rad = (t.a * Math.PI) / 180;
          const isActive = (i / 40) * 100 <= progress;
          return <line key={i}
            x1={r + oR * Math.cos(rad)} y1={r + oR * Math.sin(rad)}
            x2={r + iR * Math.cos(rad)} y2={r + iR * Math.sin(rad)}
            stroke={isActive ? "var(--accent)" : "rgba(255,255,255,0.08)"}
            strokeWidth={t.major ? 2 : 1}
            style={{ transition: 'stroke 0.3s ease' }} />;
        })}

        {/* Track */}
        <circle stroke="rgba(255,255,255,0.02)" fill="transparent" strokeWidth={sw} r={nr} cx={r} cy={r} />

        {/* Progress Fill */}
        <circle stroke="url(#gauge-grad)" fill="transparent" strokeWidth={sw}
          strokeDasharray={`${circ} ${circ}`}
          style={{ strokeDashoffset: offset, transition: 'stroke-dashoffset 0.6s cubic-bezier(0.2, 0, 0, 1)', transform: 'rotate(-90deg)', transformOrigin: 'center' }}
          strokeLinecap="round" r={nr} cx={r} cy={r} filter="url(#gauge-glow)" />
      </svg>

      <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{
          fontSize: '0.65rem', fontWeight: '800', letterSpacing: '3px', color: 'var(--accent)',
          background: 'rgba(0,0,0,0.3)', padding: '4px 12px', borderRadius: '20px', marginBottom: '8px',
          border: '1px solid var(--accent-glow)'
        }} className={phase !== 'READY' ? 'anim-pulse' : ''}>
          {phase || 'READY'}
        </div>

        <div style={{
          fontSize: 'clamp(2.5rem, 8vw, 4.5rem)', fontWeight: '900', lineHeight: '0.9',
          letterSpacing: '-2px', color: '#fff', textShadow: '0 4px 15px rgba(0,0,0,0.5)'
        }}>
          {Math.round(speed)}
        </div>

        <div style={{ fontSize: '0.8rem', fontWeight: '800', color: 'var(--text-tertiary)', letterSpacing: '4px', marginTop: '6px' }}>
          MBPS
        </div>
      </div>

      <style>{`
        @keyframes pulse-gauge {
          0% { transform: scale(1); opacity: 0.2; }
          100% { transform: scale(1.3); opacity: 0; }
        }
        .anim-pulse {
          animation: glow-pulse 1s infinite alternate;
        }
        @keyframes glow-pulse {
          from { box-shadow: 0 0 5px var(--accent-glow); }
          to { box-shadow: 0 0 15px var(--accent-glow); }
        }
      `}</style>
    </div>
  );
};

export default SpeedGauge;
