import React, { useRef, useEffect } from 'react';
import Scoreboard from './Scoreboard';
import { useGameLoop } from '../hooks/useGameLoop';
import { LogOut, Keyboard } from 'lucide-react';

const PITCH_W = 1200;
const PITCH_H = 800;

export default function Match({ matchConfig, onQuit }) {
    const { score, time, gameState } = useGameLoop(matchConfig);
    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');

        const draw = () => {
            const W = canvas.width;
            const H = canvas.height;
            const scaleX = W / PITCH_W;
            const scaleY = H / PITCH_H;

            // Clear
            ctx.clearRect(0, 0, W, H);

            // Pitch Background (Deep Turf)
            ctx.fillStyle = '#152516';
            ctx.fillRect(0, 0, W, H);

            // High-end Grass Pattern (Stripes)
            for (let i = 0; i < W; i += 80 * scaleX) {
                if (Math.round(i / (80 * scaleX)) % 2 === 0) {
                    ctx.fillStyle = 'rgba(255, 255, 255, 0.02)';
                    ctx.fillRect(i, 0, 40 * scaleX, H);
                }
            }

            // Pitch Lines
            ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
            ctx.lineWidth = 2;
            const margin = 30;
            ctx.strokeRect(margin * scaleX, margin * scaleY, W - (margin * 2) * scaleX, H - (margin * 2) * scaleY);

            // Halfway line
            ctx.beginPath();
            ctx.moveTo(W / 2, margin * scaleY);
            ctx.lineTo(W / 2, H - margin * scaleY);
            ctx.stroke();

            // Center circle
            ctx.beginPath();
            ctx.arc(W / 2, H / 2, 80 * scaleX, 0, Math.PI * 2);
            ctx.stroke();

            // Center point
            ctx.fillStyle = 'rgba(255, 255, 255, 0.2)';
            ctx.beginPath();
            ctx.arc(W / 2, H / 2, 4 * scaleX, 0, Math.PI * 2);
            ctx.fill();

            // Goal Areas
            const goalH = 160;
            ctx.strokeRect(margin * scaleX, (PITCH_H / 2 - goalH) * scaleY, 100 * scaleX, (goalH * 2) * scaleY); // Left
            ctx.strokeRect(W - (margin + 100) * scaleX, (PITCH_H / 2 - goalH) * scaleY, 100 * scaleX, (goalH * 2) * scaleY); // Right

            // Goals (The Nets)
            ctx.strokeStyle = 'rgba(255, 255, 255, 0.6)';
            ctx.lineWidth = 4;
            ctx.strokeRect(0, (PITCH_H / 2 - 70) * scaleY, margin * scaleX, 140 * scaleY); // Left
            ctx.strokeRect(W - margin * scaleX, (PITCH_H / 2 - 70) * scaleY, margin * scaleX, 140 * scaleY); // Right

            // Home Player
            const hp = gameState.homePlayer;
            drawPlayer(ctx, hp.x * scaleX, hp.y * scaleY, matchConfig.homeTeam);

            // Away Player
            const ap = gameState.awayPlayer;
            drawPlayer(ctx, ap.x * scaleX, ap.y * scaleY, matchConfig.awayTeam);

            // Ball
            const b = gameState.ball;

            // Ball Shadow
            ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
            ctx.beginPath();
            ctx.arc(b.x * scaleX, (b.y + 4) * scaleY, 7 * scaleX, 0, Math.PI * 2);
            ctx.fill();

            // Ball Body
            ctx.fillStyle = '#ffffff';
            ctx.beginPath();
            ctx.arc(b.x * scaleX, b.y * scaleY, 8 * scaleX, 0, Math.PI * 2);
            ctx.fill();

            // Ball Detail (Sleek football pattern)
            ctx.strokeStyle = '#000000';
            ctx.lineWidth = 1.5;
            ctx.beginPath();
            ctx.moveTo((b.x - 4) * scaleX, b.y * scaleY);
            ctx.lineTo((b.x + 4) * scaleX, b.y * scaleY);
            ctx.stroke();
            ctx.beginPath();
            ctx.moveTo(b.x * scaleX, (b.y - 4) * scaleY);
            ctx.lineTo(b.x * scaleX, (b.y + 4) * scaleY);
            ctx.stroke();

            requestAnimationFrame(draw);
        };

        const drawPlayer = (ctx, x, y, team) => {
            // Shadow
            ctx.fillStyle = 'rgba(0, 0, 0, 0.4)';
            ctx.beginPath();
            ctx.arc(x, y + 8, 16, 0, Math.PI * 2);
            ctx.fill();

            // Glow
            const gradient = ctx.createRadialGradient(x, y, 0, x, y, 25);
            gradient.addColorStop(0, team.primaryColor + '44');
            gradient.addColorStop(1, 'transparent');
            ctx.fillStyle = gradient;
            ctx.beginPath();
            ctx.arc(x, y, 25, 0, Math.PI * 2);
            ctx.fill();

            // Body
            ctx.fillStyle = team.primaryColor;
            ctx.shadowBlur = 10;
            ctx.shadowColor = 'rgba(0,0,0,0.5)';
            ctx.beginPath();
            ctx.arc(x, y, 20, 0, Math.PI * 2);
            ctx.fill();
            ctx.shadowBlur = 0;

            // Border
            ctx.strokeStyle = team.secondaryColor;
            ctx.lineWidth = 4;
            ctx.stroke();

            // Name Label
            ctx.fillStyle = '#fff';
            ctx.font = 'black 10px Outfit';
            ctx.textAlign = 'center';
            ctx.fillText(team.shortName, x, y - 28);
        };

        const handleResize = () => {
            const container = canvas.parentElement;
            canvas.width = container.clientWidth;
            canvas.height = container.clientHeight;
        };

        window.addEventListener('resize', handleResize);
        handleResize();
        const animId = requestAnimationFrame(draw);

        return () => {
            window.removeEventListener('resize', handleResize);
            cancelAnimationFrame(animId);
        };
    }, [gameState, matchConfig]);

    return (
        <div className="flex-1 relative flex flex-col h-full bg-[#050507] overflow-hidden">
            {/* Ambient Background Glows */}
            <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
                <div
                    className="absolute top-1/2 left-0 -translate-y-1/2 w-64 h-64 blur-[120px] opacity-20"
                    style={{ backgroundColor: matchConfig.homeTeam.primaryColor }}
                />
                <div
                    className="absolute top-1/2 right-0 -translate-y-1/2 w-64 h-64 blur-[120px] opacity-20"
                    style={{ backgroundColor: matchConfig.awayTeam.primaryColor }}
                />
            </div>

            <Scoreboard
                homeTeam={matchConfig.homeTeam}
                awayTeam={matchConfig.awayTeam}
                score={score}
                time={time}
            />

            <div className="flex-1 relative">
                <canvas ref={canvasRef} className="w-full h-full block" />
            </div>

            {/* In-Game Controls HUD */}
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-6 z-20">
                <div className="glass-panel px-6 py-3 flex items-center gap-4 bg-black/40 border-white/5">
                    <div className="flex items-center gap-2">
                        <div className="p-1.5 rounded-md bg-white/10 text-white/80">
                            <Keyboard size={14} />
                        </div>
                        <span className="text-[10px] font-black tracking-widest text-white/40 uppercase">
                            {matchConfig.gameMode === 'pve' ? 'P1: WASD' : 'P1: WASD | P2: ARROWS'}
                        </span>
                    </div>
                    <div className="w-px h-4 bg-white/10" />
                    <button
                        onClick={onQuit}
                        className="flex items-center gap-2 text-[10px] font-black tracking-[0.2em] text-accent hover:text-white transition-colors uppercase group"
                    >
                        <LogOut size={14} className="transition-transform group-hover:-translate-x-1" />
                        ABANDON MATCH
                    </button>
                </div>
            </div>
        </div>
    );
}
