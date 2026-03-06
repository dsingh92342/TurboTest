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
      style={{ position: 'relative', width: '100%', maxWidth: '280px', aspectRatio: '1', margin: '0 auto' }}>
      <svg viewBox={`0 0 ${s} ${s}`} style={{
        width: '100%', height: '100%',
        filter: progress > 0 ? 'drop-shadow(0 0 12px var(--cyan-glow))' : 'none',
        transition: 'filter 0.5s'
      }}>
        <defs>
          <linearGradient id="g" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="var(--cyan)" />
            <stop offset="100%" stopColor="var(--purple)" />
          </linearGradient>
          <filter id="gl">
            <feGaussianBlur stdDeviation="2.5" result="b" />
            <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
        </defs>

        {ticks.map((t, i) => {
          const oR = r - 8, iR = r - (t.major ? 24 : 16);
          const rad = (t.a * Math.PI) / 180;
          return <line key={i}
            x1={r + oR * Math.cos(rad)} y1={r + oR * Math.sin(rad)}
            x2={r + iR * Math.cos(rad)} y2={r + iR * Math.sin(rad)}
            stroke={t.major ? "rgba(255,255,255,0.3)" : "rgba(255,255,255,0.06)"}
            strokeWidth={t.major ? 1.5 : 0.8} />;
        })}

        <circle stroke="rgba(255,255,255,0.03)" fill="transparent" strokeWidth={sw} r={nr} cx={r} cy={r} />
        <circle stroke="url(#g)" fill="transparent" strokeWidth={sw}
          strokeDasharray={`${circ} ${circ}`}
          style={{ strokeDashoffset: offset, transition: 'stroke-dashoffset 0.5s cubic-bezier(0.4,0,0.2,1)', transform: 'rotate(-90deg)', transformOrigin: 'center' }}
          strokeLinecap="round" r={nr} cx={r} cy={r} filter="url(#gl)" />
      </svg>

      <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        <span className="label" style={{ marginBottom: '2px' }}>{phase || 'Ready'}</span>
        <span style={{
          fontSize: 'clamp(2.2rem, 7vw, 3.8rem)', fontWeight: '900', lineHeight: '1',
          letterSpacing: '-1px',
          background: 'linear-gradient(180deg, #fff 30%, #888)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent'
        }}>{Math.round(speed)}</span>
        <span style={{ fontSize: 'clamp(0.7rem, 2vw, 0.9rem)', fontWeight: '700', color: 'var(--cyan)', letterSpacing: '2px', marginTop: '4px' }}>Mbps</span>
      </div>
    </div>
  );
};

export default SpeedGauge;
