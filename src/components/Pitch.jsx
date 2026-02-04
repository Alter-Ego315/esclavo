import React, { useRef, useEffect } from 'react';

export default function Pitch({ homeTeam, awayTeam, gameState }) {
    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');

        const drawPitch = () => {
            const W = canvas.width;
            const H = canvas.height;

            // Grass
            ctx.fillStyle = '#2d5a27';
            ctx.fillRect(0, 0, W, H);

            // Pattern (Stripes)
            ctx.fillStyle = '#275222';
            for (let i = 0; i < W; i += 100) {
                if ((i / 100) % 2 === 0) {
                    ctx.fillRect(i, 0, 50, H);
                }
            }

            // Lines
            ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
            ctx.lineWidth = 3;

            // Outer boundary
            ctx.strokeRect(20, 20, W - 40, H - 40);

            // Halfway line
            ctx.beginPath();
            ctx.moveTo(W / 2, 20);
            ctx.lineTo(W / 2, H - 20);
            ctx.stroke();

            // Center circle
            ctx.beginPath();
            ctx.arc(W / 2, H / 2, 70, 0, Math.PI * 2);
            ctx.stroke();

            // Center spot
            ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
            ctx.beginPath();
            ctx.arc(W / 2, H / 2, 4, 0, Math.PI * 2);
            ctx.fill();

            // Goals (Home - Left)
            ctx.strokeStyle = 'white';
            ctx.strokeRect(0, H / 2 - 60, 20, 120);

            // Penalty area (Home)
            ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
            ctx.strokeRect(20, H / 2 - 150, 120, 300);

            // Goals (Away - Right)
            ctx.strokeStyle = 'white';
            ctx.strokeRect(W - 20, H / 2 - 60, 20, 120);

            // Penalty area (Away)
            ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
            ctx.strokeRect(W - 140, H / 2 - 150, 120, 300);
        };

        const render = () => {
            drawPitch();

            // Draw players (Static for now to test rendering)
            const drawPlayer = (x, y, team) => {
                ctx.fillStyle = team.primaryColor;
                ctx.strokeStyle = team.secondaryColor;
                ctx.lineWidth = 2;
                ctx.beginPath();
                ctx.arc(x, y, 12, 0, Math.PI * 2);
                ctx.fill();
                ctx.stroke();
            };

            // Initial positions
            drawPlayer(200, canvas.height / 2, homeTeam);
            drawPlayer(canvas.width - 200, canvas.height / 2, awayTeam);

            // Draw ball
            ctx.fillStyle = 'white';
            ctx.beginPath();
            ctx.arc(canvas.width / 2, canvas.height / 2, 6, 0, Math.PI * 2);
            ctx.fill();
            ctx.strokeStyle = '#333';
            ctx.lineWidth = 1;
            ctx.stroke();
        };

        render();

        // Resize handler
        const handleResize = () => {
            const container = canvas.parentElement;
            canvas.width = container.clientWidth;
            canvas.height = container.clientHeight;
            render();
        };

        window.addEventListener('resize', handleResize);
        handleResize();

        return () => window.removeEventListener('resize', handleResize);
    }, [homeTeam, awayTeam]);

    return (
        <div className="w-full h-full relative overflow-hidden bg-[#1a3a16]">
            <canvas ref={canvasRef} className="w-full h-full block" />
        </div>
    );
}
