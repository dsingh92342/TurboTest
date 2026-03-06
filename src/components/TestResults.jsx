import React from 'react';

const getRating = (dl, bb) => {
    if (!dl) return null;
    const score = (dl > 100 ? 50 : dl / 2) + (bb < 5 ? 50 : (20 - bb) * 2.5);
    if (score > 85) return { text: 'Premium Stream', cls: 'badge-excellent', icon: '💎' };
    if (score > 65) return { text: 'High Speed', cls: 'badge-great', icon: '⚡' };
    if (score > 40) return { text: 'Standard', cls: 'badge-good', icon: '✓' };
    return { text: 'Congested', cls: 'badge-poor', icon: '🐌' };
};

const activities = [
    { name: '4K Ultra Video', min: 25, b: 20, icon: '🎬' },
    { name: 'Cloud Gaming', min: 45, b: 10, icon: '🎮' },
    { name: 'VR Meetings', min: 20, b: 15, icon: '🥽' },
    { name: 'Large Backups', min: 100, b: 50, icon: '📦' }
];

const Metric = ({ label, value, unit, color, max, info }) => (
    <article className="card card-sm" style={{ padding: '16px 18px', position: 'relative' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <span className="label" style={{ fontSize: '0.6rem' }}>{label}</span>
            <div style={{ width: '4px', height: '4px', borderRadius: '50%', background: color }} />
        </div>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px' }}>
            <span className="value-lg" style={{ fontSize: '1.4rem' }}>{value ?? '—'}</span>
            <span style={{ color: 'var(--text-tertiary)', fontSize: '0.65rem' }}>{unit}</span>
        </div>
        {max && value && (
            <div className="bar-track" style={{ height: '3px', marginTop: '12px' }}>
                <div className="bar-fill" style={{ width: `${Math.min(100, (value / max) * 100)}%`, background: color }} />
            </div>
        )}
    </article>
);

const TestResults = ({ results }) => {
    const rating = getRating(results.download, results.bufferbloat);
    if (!results.ping) return null;

    return (
        <section aria-label="Analysis" style={{ width: '100%', marginTop: '24px' }}>
            {rating && (
                <div className="anim" style={{ textAlign: 'center', marginBottom: '16px' }}>
                    <span className={`badge ${rating.cls}`} style={{ borderColor: 'var(--accent)' }}>{rating.icon} {rating.text}</span>
                </div>
            )}

            <div className="results-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px' }}>
                <Metric label="Download" value={results.download} unit="Mbps" color="var(--accent)" max={250} />
                <Metric label="Upload" value={results.upload} unit="Mbps" color="var(--purple)" max={100} />
                <Metric label="Ping" value={results.ping} unit="ms" color="var(--green)" />
                <Metric label="Bufferbloat" value={results.bufferbloat} unit="+ms" color="var(--orange)" />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginTop: '10px' }}>
                <Metric label="Jitter" value={results.jitter} unit="ms" color="var(--pink)" />
                <div className="card card-sm" style={{ padding: '16px 18px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    <button className="btn-ghost" onClick={() => window.print()} style={{ fontSize: '0.7rem', border: '1px dashed var(--border)' }}>Export Report</button>
                </div>
            </div>

            {results.download && (
                <article className="card card-sm anim" style={{ marginTop: '16px', padding: '20px' }}>
                    <h3 className="label" style={{ marginBottom: '12px', fontSize: '0.65rem' }}>Real-World Capabilities</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        {activities.map(a => {
                            const ok = results.download >= a.min && (results.bufferbloat || 0) < a.b;
                            return (
                                <div key={a.name} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.75rem', opacity: ok ? 1 : 0.3 }}>
                                    <span>{a.icon} {a.name}</span>
                                    <span style={{ fontWeight: '800', color: ok ? 'var(--green)' : 'var(--red)' }}>{ok ? 'IDEAL' : 'STRUGGLE'}</span>
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
