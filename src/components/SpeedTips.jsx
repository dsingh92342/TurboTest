import React from 'react';

const getTips = (results) => {
    const tips = [];
    if (!results.download) return tips;

    if (results.download < 10) {
        tips.push({ icon: '📶', text: 'Move closer to your WiFi router or switch to an ethernet cable for better speeds.' });
        tips.push({ icon: '🔄', text: 'Try restarting your router — a simple reboot can often fix slow speeds.' });
    }
    if (results.download < 25) {
        tips.push({ icon: '📱', text: 'Disconnect unused devices — too many connections can slow your network.' });
    }
    if (results.ping > 80) {
        tips.push({ icon: '🎮', text: 'High ping detected. Use a wired connection for gaming and video calls.' });
    }
    if (results.jitter > 30) {
        tips.push({ icon: '📊', text: 'High jitter means unstable connection. Close bandwidth-heavy background apps.' });
    }
    if (results.download >= 50 && results.ping <= 30) {
        tips.push({ icon: '🏆', text: 'Excellent connection! Your internet is well-suited for any online activity.' });
    }
    if (results.upload < 5) {
        tips.push({ icon: '📤', text: 'Low upload speed may affect video calls and cloud uploads. Contact your ISP about plans with higher upload rates.' });
    }
    if (tips.length === 0) {
        tips.push({ icon: '✅', text: 'Your connection looks healthy! Test again later to monitor consistency.' });
    }
    return tips;
};

const getStability = (ping, jitter) => {
    if (!ping) return null;
    const ratio = jitter / ping;
    if (ratio < 0.2 && ping < 40) return { score: 'Excellent', pct: 95, color: 'var(--green)' };
    if (ratio < 0.4 && ping < 60) return { score: 'Good', pct: 78, color: 'var(--cyan)' };
    if (ratio < 0.6 && ping < 100) return { score: 'Fair', pct: 55, color: 'var(--yellow)' };
    return { score: 'Unstable', pct: 30, color: 'var(--red)' };
};

const SpeedTips = ({ results }) => {
    const tips = getTips(results);
    const stability = getStability(results.ping, results.jitter);
    if (!results.download) return null;

    return (
        <>
            {/* Stability Score */}
            {stability && (
                <section className="card card-sm anim anim-d3" style={{ width: '100%', marginTop: '16px', padding: '20px 24px' }} aria-label="Connection stability">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                        <h3 className="label">Connection Stability</h3>
                        <span style={{ color: stability.color, fontWeight: '800', fontSize: '0.8rem' }}>{stability.score}</span>
                    </div>
                    <div style={{ width: '100%', height: '6px', background: 'rgba(255,255,255,0.04)', borderRadius: '10px', overflow: 'hidden' }}>
                        <div style={{
                            width: `${stability.pct}%`,
                            height: '100%',
                            borderRadius: '10px',
                            background: `linear-gradient(90deg, ${stability.color}, ${stability.color}88)`,
                            transition: 'width 1.5s cubic-bezier(0.22, 1, 0.36, 1)'
                        }} />
                    </div>
                </section>
            )}

            {/* Tips */}
            <section className="card card-sm anim anim-d4" style={{ width: '100%', marginTop: '16px', padding: '20px 24px' }} aria-label="Speed improvement tips">
                <h3 className="label" style={{ marginBottom: '14px' }}>Tips for You</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    {tips.map((tip, i) => (
                        <div key={i} style={{ display: 'flex', gap: '10px', fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: '1.6' }}>
                            <span style={{ fontSize: '1rem', flexShrink: 0 }}>{tip.icon}</span>
                            <span>{tip.text}</span>
                        </div>
                    ))}
                </div>
            </section>
        </>
    );
};

export default SpeedTips;
