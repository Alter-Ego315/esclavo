import React from 'react';

export default function Scoreboard({ homeTeam, awayTeam, score, time }) {
    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    return (
        <div className="absolute top-8 left-1/2 -translate-x-1/2 z-20 flex items-stretch gap-0 animate-fade-in shadow-2xl rounded-2xl overflow-hidden border border-white/10">
            {/* Home */}
            <div className="glass-panel border-none rounded-none px-8 py-3 flex items-center gap-6 min-w-[220px] justify-end bg-gradient-to-l from-black/20 to-transparent">
                <div className="flex flex-col items-end">
                    <span className="text-[10px] font-black text-primary uppercase tracking-[0.2em] opacity-60">Home</span>
                    <span className="font-extrabold text-2xl tracking-tighter">{homeTeam.name}</span>
                </div>
                <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl font-black shadow-lg"
                    style={{ backgroundColor: homeTeam.primaryColor, color: homeTeam.textColor, border: `3px solid ${homeTeam.secondaryColor}` }}
                >
                    {score.home}
                </div>
            </div>

            {/* Timer */}
            <div className="glass-elevated border-none rounded-none px-10 py-3 flex flex-col items-center justify-center min-w-[140px] border-x border-white/10 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-primary/30" />
                <span className="text-primary text-[9px] font-black uppercase tracking-[0.4em] mb-1">Live</span>
                <span className="text-4xl font-black tabular-nums tracking-tighter">{formatTime(time)}</span>
            </div>

            {/* Away */}
            <div className="glass-panel border-none rounded-none px-8 py-3 flex items-center gap-6 min-w-[220px] bg-gradient-to-r from-black/20 to-transparent">
                <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl font-black shadow-lg"
                    style={{ backgroundColor: awayTeam.primaryColor, color: awayTeam.textColor, border: `3px solid ${awayTeam.secondaryColor}` }}
                >
                    {score.away}
                </div>
                <div className="flex flex-col items-start">
                    <span className="text-[10px] font-black text-accent uppercase tracking-[0.2em] opacity-60">Away</span>
                    <span className="font-extrabold text-2xl tracking-tighter">{awayTeam.name}</span>
                </div>
            </div>
        </div>
    );
}
