import React, { useRef, useEffect } from 'react';

const SpeedChart = ({ dataPoints, phase }) => {
    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        const dpr = window.devicePixelRatio || 1;
        const w = canvas.clientWidth;
        const h = canvas.clientHeight;
        canvas.width = w * dpr;
        canvas.height = h * dpr;
        ctx.scale(dpr, dpr);

        ctx.clearRect(0, 0, w, h);

        if (dataPoints.length < 2) return;

        const maxVal = Math.max(...dataPoints, 1) * 1.2;
        const points = dataPoints.map((v, i) => ({
            x: (i / (dataPoints.length - 1)) * w,
            y: h - (v / maxVal) * (h - 8) - 4
        }));

        // Grid lines
        ctx.strokeStyle = 'rgba(255,255,255,0.03)';
        ctx.lineWidth = 0.5;
        for (let i = 1; i < 4; i++) {
            const y = (h / 4) * i;
            ctx.beginPath();
            ctx.moveTo(0, y);
            ctx.lineTo(w, y);
            ctx.stroke();
        }

        // Gradient fill
        const grad = ctx.createLinearGradient(0, 0, 0, h);
        grad.addColorStop(0, 'rgba(0, 229, 255, 0.15)');
        grad.addColorStop(1, 'rgba(0, 229, 255, 0)');
        ctx.beginPath();
        ctx.moveTo(points[0].x, h);
        points.forEach(p => ctx.lineTo(p.x, p.y));
        ctx.lineTo(points[points.length - 1].x, h);
        ctx.closePath();
        ctx.fillStyle = grad;
        ctx.fill();

        // Line
        const lineGrad = ctx.createLinearGradient(0, 0, w, 0);
        lineGrad.addColorStop(0, '#00e5ff');
        lineGrad.addColorStop(1, '#a855f7');
        ctx.beginPath();
        ctx.moveTo(points[0].x, points[0].y);
        for (let i = 1; i < points.length; i++) {
            const cp1x = (points[i - 1].x + points[i].x) / 2;
            ctx.bezierCurveTo(cp1x, points[i - 1].y, cp1x, points[i].y, points[i].x, points[i].y);
        }
        ctx.strokeStyle = lineGrad;
        ctx.lineWidth = 2;
        ctx.stroke();

        // Dot at end
        const last = points[points.length - 1];
        ctx.beginPath();
        ctx.arc(last.x, last.y, 3, 0, Math.PI * 2);
        ctx.fillStyle = '#00e5ff';
        ctx.fill();
        ctx.beginPath();
        ctx.arc(last.x, last.y, 6, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(0, 229, 255, 0.2)';
        ctx.fill();

    }, [dataPoints]);

    if (dataPoints.length < 2) return null;

    return (
        <section aria-label="Real-time speed chart" className="card card-sm anim" style={{ width: '100%', marginTop: '16px', padding: '16px 20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                <span className="label">Speed Over Time</span>
                <span style={{ fontSize: '0.7rem', color: 'var(--text-tertiary)' }}>{phase}</span>
            </div>
            <canvas
                ref={canvasRef}
                style={{ width: '100%', height: '80px', display: 'block' }}
                aria-label="Speed measurements graph"
                role="img"
            />
        </section>
    );
};

export default SpeedChart;
