import React, { useMemo } from 'react';

const SpeedGauge = ({ speed, phase, progress = 0 }) => {
  const size = 280;
  const radius = size / 2;
  const stroke = 12;
  const normalizedRadius = radius - stroke * 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  const ticks = useMemo(() => {
    const t = [];
    for (let i = 0; i <= 48; i++) {
      const angle = (i * 5) - 210;
      const isMajor = i % 8 === 0;
      t.push({ angle, isMajor });
    }
    return t;
  }, []);

  return (
    <div className="gauge-outer" style={{
      position: 'relative',
      width: '100%',
      maxWidth: '320px',
      aspectRatio: '1',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      margin: '0 auto'
    }}>
      <svg
        viewBox={`0 0 ${size} ${size}`}
        style={{
          width: '100%',
          height: '100%',
          filter: progress > 0 ? 'drop-shadow(0 0 15px var(--primary-glow))' : 'none',
          transition: 'filter 0.5s ease'
        }}
      >
        <defs>
          <linearGradient id="gauge-grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="var(--primary)" />
            <stop offset="50%" stopColor="#4facfe" />
            <stop offset="100%" stopColor="var(--secondary)" />
          </linearGradient>
          <filter id="glow">
            <feGaussianBlur stdDeviation="3" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Ticks */}
        {ticks.map((tick, i) => {
          const outerR = radius - 10;
          const innerR = radius - (tick.isMajor ? 28 : 20);
          const x1 = radius + outerR * Math.cos((tick.angle * Math.PI) / 180);
          const y1 = radius + outerR * Math.sin((tick.angle * Math.PI) / 180);
          const x2 = radius + innerR * Math.cos((tick.angle * Math.PI) / 180);
          const y2 = radius + innerR * Math.sin((tick.angle * Math.PI) / 180);
          return (
            <line
              key={i}
              x1={x1} y1={y1} x2={x2} y2={y2}
              stroke={tick.isMajor ? "rgba(255,255,255,0.35)" : "rgba(255,255,255,0.08)"}
              strokeWidth={tick.isMajor ? 2 : 1}
            />
          );
        })}

        {/* Background Ring */}
        <circle
          stroke="rgba(255,255,255,0.04)"
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
            transition: 'stroke-dashoffset 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
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
        zIndex: 10,
        width: '60%'
      }}>
        <div style={{
          fontSize: 'clamp(0.6rem, 1.5vw, 0.8rem)',
          color: 'var(--text-dim)',
          textTransform: 'uppercase',
          letterSpacing: '3px',
          fontWeight: '900',
          marginBottom: '4px'
        }}>
          {phase || 'Ready'}
        </div>
        <div style={{
          fontSize: 'clamp(2.5rem, 8vw, 4.5rem)',
          fontWeight: '900',
          lineHeight: '0.9',
          letterSpacing: '-2px',
          background: 'linear-gradient(to bottom, #fff, #999)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
        }}>
          {Math.round(speed)}
        </div>
        <div style={{
          fontSize: 'clamp(0.8rem, 2vw, 1.1rem)',
          fontWeight: '700',
          color: 'var(--primary)',
          marginTop: '6px',
          letterSpacing: '2px'
        }}>
          Mbps
        </div>
      </div>
    </div>
  );
};

export default SpeedGauge;
