import React from 'react';

const getSpeedRating = (download) => {
    if (!download) return null;
    if (download >= 100) return { label: 'Excellent', class: 'badge-excellent', emoji: '🚀' };
    if (download >= 50) return { label: 'Great', class: 'badge-good', emoji: '⚡' };
    if (download >= 25) return { label: 'Good', class: 'badge-good', emoji: '✓' };
    if (download >= 10) return { label: 'Average', class: 'badge-average', emoji: '⚠' };
    return { label: 'Slow', class: 'badge-poor', emoji: '🐌' };
};

const getBarWidth = (speed, max = 200) => Math.min(100, (speed / max) * 100);

const TestResults = ({ results }) => {
    const rating = getSpeedRating(results.download);

    const Card = ({ label, value, unit, color, barMax }) => (
        <div className="glass-card" style={{
            padding: '20px 24px',
            display: 'flex',
            flexDirection: 'column',
            gap: '10px',
            flex: '1',
            minWidth: '0'
        }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span className="stat-label">{label}</span>
                <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: color, boxShadow: `0 0 8px ${color}` }} />
            </div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px' }}>
                <span className="stat-value">{value || '---'}</span>
                <span style={{ color: 'var(--text-dim)', fontWeight: '600', fontSize: '0.8rem' }}>{unit}</span>
            </div>
            {barMax && value && (
                <div className="speed-bar-track">
                    <div className="speed-bar-fill" style={{
                        width: `${getBarWidth(parseFloat(value), barMax)}%`,
                        background: `linear-gradient(90deg, ${color}, ${color}88)`
                    }} />
                </div>
            )}
        </div>
    );

    return (
        <div style={{ width: '100%', marginTop: '40px' }}>
            {/* Speed Rating */}
            {rating && (
                <div className="animate-fade" style={{ textAlign: 'center', marginBottom: '24px' }}>
                    <span className={`speed-badge ${rating.class}`}>
                        {rating.emoji} {rating.label} Connection
                    </span>
                </div>
            )}

            {/* Result Cards Grid */}
            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(2, 1fr)',
                gap: '16px',
                width: '100%',
            }}>
                <Card label="Download" value={results.download} unit="Mbps" color="var(--primary)" barMax={200} />
                <Card label="Upload" value={results.upload} unit="Mbps" color="var(--secondary)" barMax={100} />
                <Card label="Ping" value={results.ping} unit="ms" color="#00ff88" />
                <Card label="Jitter" value={results.jitter} unit="ms" color="#ff007a" />
            </div>

            {/* Speed Suitability */}
            {results.download && (
                <div className="glass-card animate-up" style={{ marginTop: '20px', padding: '20px 24px' }}>
                    <div className="stat-label" style={{ marginBottom: '14px' }}>What your speed supports</div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                        {[
                            { name: 'HD Video Streaming', min: 5, icon: '📺' },
                            { name: '4K Ultra HD', min: 25, icon: '🎬' },
                            { name: 'Online Gaming', min: 15, icon: '🎮' },
                            { name: 'Video Conferencing', min: 10, icon: '💼' },
                            { name: 'Cloud Gaming', min: 50, icon: '☁️' },
                        ].map((item) => {
                            const supported = results.download >= item.min;
                            return (
                                <div key={item.name} style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'space-between',
                                    fontSize: '0.85rem',
                                    opacity: supported ? 1 : 0.4
                                }}>
                                    <span>{item.icon} {item.name}</span>
                                    <span style={{ color: supported ? 'var(--success)' : 'var(--danger)', fontWeight: '700', fontSize: '0.75rem' }}>
                                        {supported ? '✓ Supported' : '✗ Not enough'}
                                    </span>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}
        </div>
    );
};

export default TestResults;
