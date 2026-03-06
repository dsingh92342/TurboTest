import React from 'react';

const TestResults = ({ results }) => {
    const Card = ({ label, value, unit, icon, color }) => (
        <div className="glass-card animate-up" style={{
            padding: '32px 24px',
            display: 'flex',
            flexDirection: 'column',
            gap: '12px',
            flex: '1',
            minWidth: '200px',
            borderLeft: `3px solid ${color || 'transparent'}`
        }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span className="stat-label">{label}</span>
                <span style={{ fontSize: '1.2rem', filter: `drop-shadow(0 0 5px ${color}80)` }}>{icon}</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
                <span className="stat-value">{value || '---'}</span>
                <span style={{ color: 'var(--text-dim)', fontWeight: '600', fontSize: '0.9rem' }}>{unit}</span>
            </div>
        </div>
    );

    return (
        <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
            gap: '24px',
            width: '100%',
            marginTop: '60px'
        }}>
            <Card label="Download" value={results.download} unit="Mbps" icon="󰇚" color="var(--primary)" />
            <Card label="Upload" value={results.upload} unit="Mbps" icon="󰇜" color="var(--secondary)" />
            <Card label="Ping" value={results.ping} unit="ms" icon="󰔛" color="#00ff88" />
            <Card label="Jitter" value={results.jitter} unit="ms" icon="󱏒" color="#ff007a" />
        </div>
    );
};

export default TestResults;
