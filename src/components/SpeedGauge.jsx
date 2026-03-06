import React, { useMemo } from 'react';

const SpeedGauge = ({ speed, phase, progress = 0 }) => {
  const radius = 135;
  const stroke = 14;
  const normalizedRadius = radius - stroke * 2;
  const circumference = normalizedRadius * 2 * Math.PI;

  // Adjusted offset to show only ~240 degrees (120 to -60 degrees roughly)
  // For simplicity, let's stick to full circle but use a mask or gradient
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  const ticks = useMemo(() => {
    const t = [];
    for (let i = 0; i <= 60; i++) {
      const angle = (i * 4) - 210; // -210 to 30 degrees
      const isMajor = i % 10 === 0;
      t.push({ angle, isMajor });
    }
    return t;
  }, []);

  return (
    <div className="gauge-outer" style={{ position: 'relative', width: '380px', height: '380px', display: 'flex', alignItems: 'center', justifySelf: 'center' }}>
      {/* Background Decorative Rings */}
      <div style={{
        position: 'absolute',
        top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
        width: '320px', height: '320px',
        border: '1px solid rgba(255,255,255,0.03)',
        borderRadius: '50%'
      }} />

      <svg
        height={radius * 2}
        width={radius * 2}
        viewBox={`0 0 ${radius * 2} ${radius * 2}`}
        style={{ transform: 'rotate(0deg)', filter: 'drop-shadow(0 0 20px var(--primary-glow))', width: '100%', height: '100%' }}
      >
        <defs>
          <linearGradient id="gauge-grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="var(--primary)" />
            <stop offset="50%" stopColor="#4facfe" />
            <stop offset="100%" stopColor="var(--secondary)" />
          </linearGradient>
          <filter id="glow">
            <feGaussianBlur stdDeviation="4" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Ticks */}
        {ticks.map((tick, i) => {
          const x1 = radius + (radius - 15) * Math.cos((tick.angle * Math.PI) / 180);
          const y1 = radius + (radius - 15) * Math.sin((tick.angle * Math.PI) / 180);
          const x2 = radius + (radius - (tick.isMajor ? 35 : 25)) * Math.cos((tick.angle * Math.PI) / 180);
          const y2 = radius + (radius - (tick.isMajor ? 35 : 25)) * Math.sin((tick.angle * Math.PI) / 180);
          return (
            <line
              key={i}
              x1={x1} y1={y1} x2={x2} y2={y2}
              stroke={tick.isMajor ? "rgba(255,255,255,0.4)" : "rgba(255,255,255,0.1)"}
              strokeWidth={tick.isMajor ? 2 : 1}
            />
          );
        })}

        {/* Outer Ring */}
        <circle
          stroke="rgba(255,255,255,0.05)"
          fill="transparent"
          strokeWidth={stroke}
          r={normalizedRadius}
          cx={radius}
          cy={radius}
        />

        {/* Progress Ring */}
        <circle
          stroke="url(#gauge-grad)"
          fill="transparent"
          strokeWidth={stroke}
          strokeDasharray={circumference + ' ' + circumference}
          style={{
            strokeDashoffset,
            transition: 'stroke-dashoffset 0.8s cubic-bezier(0.4, 0, 0.2, 1)',
            transform: 'rotate(-90deg)',
            transformOrigin: 'center'
          }}
          strokeLinecap="round"
          r={normalizedRadius}
          cx={radius}
          cy={radius}
          filter="url(#glow)"
        />
      </svg>

      {/* Center Display */}
      <div style={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        textAlign: 'center',
        zIndex: 10
      }}>
        <div style={{
          fontSize: '0.8rem',
          color: 'var(--text-dim)',
          textTransform: 'uppercase',
          letterSpacing: '4px',
          fontWeight: '900',
          marginBottom: '5px'
        }}>
          {phase || 'Ready'}
        </div>
        <div style={{
          fontSize: '5.5rem',
          fontWeight: '900',
          lineHeight: '0.9',
          letterSpacing: '-2px',
          background: 'linear-gradient(to bottom, #fff, #aaa)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
        }}>
          {Math.round(speed)}
        </div>
        <div style={{
          fontSize: '1.2rem',
          fontWeight: '700',
          color: 'var(--primary)',
          marginTop: '10px',
          letterSpacing: '1px'
        }}>
          Mbps
        </div>
      </div>
    </div>
  );
};

export default SpeedGauge;
