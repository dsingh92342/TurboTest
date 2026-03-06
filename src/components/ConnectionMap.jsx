import React, { useMemo } from 'react';

const ConnectionMap = ({ active, server }) => {
    const packets = useMemo(() => Array.from({ length: 6 }), []);

    return (
        <div className="card card-sm anim anim-d1" style={{
            width: '100%', maxWidth: '700px',
            marginTop: '20px',
            padding: '24px',
            position: 'relative',
            overflow: 'hidden',
            height: '160px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'rgba(0,0,0,0.15)',
            backdropFilter: 'blur(2px)'
        }}>
            <div style={{ position: 'absolute', top: '12px', left: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div className="label" style={{ fontSize: '0.6rem' }}>Network Topology</div>
                {active && <div style={{ width: '4px', height: '4px', borderRadius: '2px', background: 'var(--accent)', animation: 'pulse-map 0.6s infinite alternate' }} />}
            </div>

            {/* World Grid */}
            <svg viewBox="0 0 100 100" preserveAspectRatio="none" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', opacity: 0.05 }}>
                <defs>
                    <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
                        <path d="M 10 0 L 0 0 0 10" fill="none" stroke="currentColor" strokeWidth="0.5" />
                    </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#grid)" />
            </svg>

            {/* User Node */}
            <div style={{ position: 'absolute', left: '25%', transform: 'translateX(-50%)', textAlign: 'center' }}>
                <div style={{
                    width: '12px', height: '12px', background: 'var(--accent)', borderRadius: '50%',
                    boxShadow: '0 0 20px var(--accent-glow)', position: 'relative'
                }}>
                    <div style={{ position: 'absolute', inset: '-6px', border: '1px solid var(--accent)', borderRadius: '50%', animation: 'pulse-map 2s infinite' }} />
                </div>
                <div className="label" style={{ marginTop: '10px', fontSize: '0.5rem', letterSpacing: '2px' }}>YOU</div>
            </div>

            {/* Connection Arch */}
            <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none' }}>
                <path
                    d="M 152 80 Q 256 10 360 80"
                    fill="none"
                    stroke="rgba(255,255,255,0.05)"
                    strokeWidth="1.5"
                    vectorEffect="non-scaling-stroke"
                    style={{ transform: 'translateX(-1px)' }}
                />
                {active && (
                    <path
                        d="M 152 80 Q 256 10 360 80"
                        fill="none"
                        stroke="var(--accent)"
                        strokeWidth="2"
                        strokeDasharray="10, 200"
                        style={{
                            animation: 'flow 1s linear infinite',
                            filter: 'drop-shadow(0 0 5px var(--accent-glow))'
                        }}
                    />
                )}
                {/* Packet Flow Animation */}
                {active && packets.map((_, i) => (
                    <circle key={i} r="2" fill="var(--accent)" style={{
                        offsetPath: 'path("M 152 80 Q 256 10 360 80")',
                        animation: `move-packet 1.8s linear infinite`,
                        animationDelay: `${i * 0.3}s`,
                        filter: 'blur(1px) drop-shadow(0 0 4px var(--accent))'
                    }} />
                ))}
            </svg>

            {/* Remote Server */}
            <div style={{ position: 'absolute', right: '25%', transform: 'translateX(50%)', textAlign: 'center' }}>
                <div style={{
                    width: '12px', height: '12px', background: '#fff', borderRadius: '50%',
                    opacity: 0.8, boxShadow: '0 0 15px rgba(255,255,255,0.2)'
                }} />
                <div className="label" style={{ marginTop: '10px', fontSize: '0.5rem', letterSpacing: '2px' }}>{server?.name?.toUpperCase() || 'SERVER'}</div>
            </div>

            <div style={{ position: 'absolute', bottom: '12px', color: 'var(--text-tertiary)', fontSize: '0.6rem', fontWeight: '800', letterSpacing: '1px' }}>
                {active ? `PKT_XFER: 204.8 KB/S` : `CONNECTION: STABLE`}
            </div>

            <style>{`
        @keyframes flow { from { stroke-dashoffset: 210; } to { stroke-dashoffset: 0; } }
        @keyframes move-packet {
          0% { offset-distance: 0%; opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { offset-distance: 100%; opacity: 0; }
        }
        @keyframes pulse-map {
          0% { transform: scale(1); opacity: 1; }
          100% { transform: scale(2.5); opacity: 0; }
        }
      `}</style>
        </div>
    );
};

export default ConnectionMap;
