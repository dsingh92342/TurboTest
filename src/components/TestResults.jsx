import React from 'react';

const TestResults = ({ results }) => {
    const Card = ({ label, value, unit, icon }) => (
        <div className="glass glass-hover" style={{
            padding: '24px',
            display: 'flex',
            flexDirection: 'column',
            gap: '8px',
            minWidth: '200px'
        }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span style={{ color: 'var(--primary)', fontSize: '1.2rem' }}>{icon}</span>
                <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem', fontWeight: '600', textTransform: 'uppercase' }}>{label}</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '5px' }}>
                <span style={{ fontSize: '2rem', fontWeight: '800' }}>{value || '--'}</span>
                <span style={{ color: 'var(--text-muted)', fontWeight: '500' }}>{unit}</span>
            </div>
        </div>
    );

    return (
        <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '20px',
            width: '100%',
            marginTop: '40px'
        }}>
            <Card label="Download" value={results.download} unit="Mbps" icon="↓" />
            <Card label="Upload" value={results.upload} unit="Mbps" icon="↑" />
            <Card label="Ping" value={results.ping} unit="ms" icon="↔" />
            <Card label="Jitter" value={results.jitter} unit="ms" icon="≈" />
        </div>
    );
};

export default TestResults;
