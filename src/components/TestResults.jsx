import React from 'react';

const getRating = (dl) => {
    if (!dl) return null;
    if (dl >= 100) return { text: 'Excellent', cls: 'badge-excellent', icon: '🚀' };
    if (dl >= 50) return { text: 'Great', cls: 'badge-great', icon: '⚡' };
    if (dl >= 25) return { text: 'Good', cls: 'badge-good', icon: '✓' };
    if (dl >= 10) return { text: 'Average', cls: 'badge-average', icon: '⚠' };
    return { text: 'Slow', cls: 'badge-poor', icon: '🐌' };
};

const barW = (v, max) => Math.min(100, (v / max) * 100);

const activities = [
    { name: 'HD Video Streaming', min: 5, icon: '📺' },
    { name: '4K Ultra HD Streaming', min: 25, icon: '🎬' },
    { name: 'Online Gaming', min: 15, icon: '🎮' },
    { name: 'Video Conferencing', min: 10, icon: '💼' },
    { name: 'Cloud Gaming (GeForce Now)', min: 50, icon: '☁️' },
    { name: 'Large File Downloads', min: 100, icon: '📦' }
];

const TestResults = ({ results }) => {
    const rating = getRating(results.download);

    const Metric = ({ label, value, unit, color, max }) => (
        <article className="card card-sm" style={{ padding: '18px 20px' }} aria-label={`${label}: ${value || 'not tested'} ${unit}`}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <span className="label">{label}</span>
                <span style={{ width: 6, height: 6, borderRadius: '50%', background: color, boxShadow: `0 0 8px ${color}` }} />
            </div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '5px' }}>
                <span className="value-lg">{value ?? '—'}</span>
                <span style={{ color: 'var(--text-tertiary)', fontSize: '0.75rem', fontWeight: '600' }}>{unit}</span>
            </div>
            {max && value && (
                <div className="bar-track">
                    <div className="bar-fill" style={{ width: `${barW(parseFloat(value), max)}%`, background: `linear-gradient(90deg, ${color}, ${color}66)` }} />
                </div>
            )}
        </article>
    );

    return (
        <section aria-label="Speed test results" style={{ width: '100%', marginTop: '32px' }}>
            {rating && (
                <div className="anim" style={{ textAlign: 'center', marginBottom: '20px' }}>
                    <span className={`badge ${rating.cls}`}>{rating.icon} {rating.text} Connection</span>
                </div>
            )}

            <div className="results-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px' }}>
                <Metric label="Download" value={results.download} unit="Mbps" color="var(--cyan)" max={200} />
                <Metric label="Upload" value={results.upload} unit="Mbps" color="var(--purple)" max={100} />
                <Metric label="Ping" value={results.ping} unit="ms" color="var(--green)" />
                <Metric label="Jitter" value={results.jitter} unit="ms" color="var(--pink)" />
            </div>

            {results.download && (
                <article className="card card-sm anim anim-d2" style={{ marginTop: '16px', padding: '20px 24px' }}>
                    <h3 className="label" style={{ marginBottom: '14px' }}>What Your Speed Supports</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        {activities.map(a => {
                            const ok = results.download >= a.min;
                            return (
                                <div key={a.name} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.82rem', opacity: ok ? 1 : 0.35 }}>
                                    <span>{a.icon} {a.name}</span>
                                    <span style={{ fontWeight: '800', fontSize: '0.7rem', color: ok ? 'var(--green)' : 'var(--red)' }}>
                                        {ok ? '✓' : '✗'}
                                    </span>
                                </div>
                            );
                        })}
                    </div>
                </article>
            )}
        </section>
    );
};

export default TestResults;
