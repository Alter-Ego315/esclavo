import React, { useState } from 'react';
import { TEAMS } from '../data/teams';
import { Users, Monitor, Play, Shield } from 'lucide-react';

const TeamCard = ({ team, isSelected, onSelect, side }) => (
    <div
        onClick={() => onSelect(team)}
        className={`glass-panel p-5 cursor-pointer transition-all duration-500 flex flex-col items-center gap-4 w-52 relative group ${isSelected
                ? 'glass-elevated ring-2 ring-primary scale-105 z-10'
                : 'hover:bg-white/5 opacity-60 hover:opacity-100 hover:scale-[1.02]'
            }`}
    >
        <div
            className="w-24 h-24 rounded-2xl flex items-center justify-center text-4xl font-black shadow-2xl transition-transform duration-500 group-hover:rotate-3"
            style={{
                backgroundColor: team.primaryColor,
                color: team.textColor,
                border: `4px solid ${team.secondaryColor}`,
                boxShadow: isSelected ? `0 0 30px ${team.primaryColor}44` : 'none'
            }}
        >
            {team.shortName}
        </div>
        <div className="text-center">
            <h3 className="font-bold text-xl tracking-tight">{team.name}</h3>
            <div className="flex items-center justify-center gap-1 mt-1">
                <Shield size={12} className={side === 'Home' ? 'text-primary' : 'text-accent'} />
                <p className={`text-[10px] uppercase font-bold tracking-[0.2em] ${side === 'Home' ? 'text-primary' : 'text-accent'}`}>
                    {side}
                </p>
            </div>
        </div>
        {isSelected && (
            <div className="absolute -top-2 -right-2 bg-primary text-black text-[10px] font-black px-2 py-1 rounded-md shadow-lg animate-pulse">
                SELECTED
            </div>
        )}
    </div>
);

export default function TeamSelection({ onStartMatch }) {
    const [homeTeam, setHomeTeam] = useState(TEAMS[0]);
    const [awayTeam, setAwayTeam] = useState(TEAMS[1]);
    const [gameMode, setGameMode] = useState('pve'); // 'pve' or 'pvp'

    const differentTeams = homeTeam.id !== awayTeam.id;

    return (
        <div className="flex-1 flex flex-col items-center justify-center p-8 animate-fade-in relative z-10">
            <div className="text-center mb-16">
                <div className="inline-block px-4 py-1 rounded-full glass-panel text-[10px] font-bold tracking-[0.3em] text-primary mb-4 uppercase">
                    The Ultimate Challenge
                </div>
                <h1 className="text-7xl font-extrabold mb-4 tracking-tighter leading-none">
                    ALTER EGO <span className="text-primary italic">FOOTBALL</span>
                </h1>
                <p className="text-dim text-lg font-medium opacity-80">Battle for Glory in La Liga</p>
            </div>

            <div className="flex gap-12 items-center mb-16">
                <div className="flex flex-col gap-6">
                    <h2 className="text-center text-xs font-black text-primary uppercase tracking-[0.3em] opacity-60">Home Squad</h2>
                    <div className="flex gap-6 overflow-x-auto max-w-xl p-6 no-scrollbar mask-fade">
                        {TEAMS.map(team => (
                            <TeamCard
                                key={team.id}
                                team={team}
                                isSelected={homeTeam.id === team.id}
                                onSelect={setHomeTeam}
                                side="Home"
                            />
                        ))}
                    </div>
                </div>

                <div className="flex flex-col items-center">
                    <div className="text-6xl font-black text-white/5 select-none tracking-tighter">VERSUS</div>
                </div>

                <div className="flex flex-col gap-6">
                    <h2 className="text-center text-xs font-black text-accent uppercase tracking-[0.3em] opacity-60">Away Squad</h2>
                    <div className="flex gap-6 overflow-x-auto max-w-xl p-6 no-scrollbar mask-fade">
                        {TEAMS.map(team => (
                            <TeamCard
                                key={team.id}
                                team={team}
                                isSelected={awayTeam.id === team.id}
                                onSelect={setAwayTeam}
                                side="Away"
                            />
                        ))}
                    </div>
                </div>
            </div>

            <div className="flex flex-col items-center gap-8">
                <div className="flex glass-panel p-1.5 rounded-2xl">
                    <button
                        onClick={() => setGameMode('pve')}
                        className={`px-8 py-3 rounded-xl flex items-center gap-3 transition-all duration-500 ${gameMode === 'pve'
                                ? 'bg-primary text-black font-bold shadow-lg shadow-primary/20'
                                : 'text-white/60 hover:text-white hover:bg-white/5'
                            }`}
                    >
                        <Monitor size={20} /> <span className="text-sm tracking-widest uppercase font-bold">VS CPU</span>
                    </button>
                    <button
                        onClick={() => setGameMode('pvp')}
                        className={`px-8 py-3 rounded-xl flex items-center gap-3 transition-all duration-500 ${gameMode === 'pvp'
                                ? 'bg-primary text-black font-bold shadow-lg shadow-primary/20'
                                : 'text-white/60 hover:text-white hover:bg-white/5'
                            }`}
                    >
                        <Users size={20} /> <span className="text-sm tracking-widest uppercase font-bold">Local Co-op</span>
                    </button>
                </div>

                <div className="relative group">
                    {!differentTeams && (
                        <div className="absolute -top-12 left-1/2 -translate-x-1/2 w-max px-4 py-2 glass-panel text-accent text-xs font-bold animate-bounce">
                            SELECT DIFFERENT TEAMS
                        </div>
                    )}
                    <button
                        onClick={() => onStartMatch({ homeTeam, awayTeam, gameMode })}
                        disabled={!differentTeams}
                        className={`group relative overflow-hidden px-16 py-5 rounded-2xl font-black text-2xl flex items-center gap-4 transition-all duration-500 ${!differentTeams
                                ? 'bg-white/5 text-white/20 cursor-not-allowed border border-white/5'
                                : 'btn-primary shadow-[0_20px_40px_rgba(254,190,16,0.25)] hover:shadow-[0_25px_50px_rgba(254,190,16,0.4)] hover:-translate-y-1'
                            }`}
                    >
                        <Play size={28} fill="currentColor" stroke="none" className="transition-transform group-hover:scale-110 group-hover:rotate-6" />
                        <span className="tracking-tighter">KICK OFF</span>

                        {differentTeams && (
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
}
