import React, { useState, useEffect } from 'react';
import Jersey3D from './Jersey3D';
import JerseyPreview from './JerseyPreview';
import { ChevronRight, ChevronLeft, Upload, Shirt, RotateCcw, Share2, Download, Eye, Layers, Type, Palette, Scissors, Binary, Grip, RotateCw, Image, ArrowLeftRight, Move, Check, Trash2 } from 'lucide-react';
import '../styles/JerseyDesigner.css';

const PATTERNS_LIST = [
    { id: 'none', label: 'Ninguno' },
    { id: 'gradient', label: 'Degradado' },
    { id: 'gradient-multi', label: 'Degradado multi' },
    { id: 'halftone-lines', label: 'Líneas' },
    { id: 'halftone-dots', label: 'Puntos' },
    { id: 'checkers', label: 'Ajedrez' },
    { id: 'stepped-gradient', label: 'Degradado escalonado' },
    { id: 'zigzag', label: 'Zig zag' },
    { id: 'hoops-thin', label: 'Rayas finas' },
    { id: 'ocean-waves', label: 'Olas' },
    { id: 'cross', label: 'Cruz' },
    { id: 'cross-offset', label: 'Cruz nórdica' },
    { id: 'stripes', label: 'Rayas verticales' },
    { id: 'hoops', label: 'Rayas horizontales' },
    { id: 'diagonal', label: 'Diagonal' },
    { id: 'diamonds', label: 'Rombos' },
    { id: 'chevron', label: 'Chevron' },
    { id: 'triangles', label: 'Triángulos' },
    { id: 'camo', label: 'Camuflaje' },
    { id: 'swirl', label: 'Remolino' },
    { id: 'arches', label: 'Arcos' },
    { id: 'star', label: 'Estrella' },
    { id: 'pixels', label: 'Pixelado' },
    { id: 'center-stripe', label: 'Franja central' },
    { id: 'sash', label: 'Banda' },
    { id: 'double-stripe', label: 'Doble franja' },
];

const JERSEY_TEMPLATES = [
    {
        id: 'ginga-classic',
        name: 'Ginga classic',
        colors: { primary: '#0a0a0a', secondary: '#39FF14', accent: '#1a1a1a', textColor: '#39FF14' },
        pattern: 'swirl',
        font: 'Orbitron'
    },
    {
        id: 'nova-camo',
        name: 'Nova camo',
        colors: { primary: '#ff0000', secondary: '#000000', accent: '#ffffff', textColor: '#ffffff' },
        pattern: 'camo',
        font: 'Black Ops One'
    },
    {
        id: 'apex-arches',
        name: 'Apex arches',
        colors: { primary: '#0000ff', secondary: '#ffffff', accent: '#000000', textColor: '#ffffff' },
        pattern: 'arches',
        font: 'Teko'
    },
    {
        id: 'vortex-tri',
        name: 'Vortex tri',
        colors: { primary: '#ff9900', secondary: '#000000', accent: '#ffffff', textColor: '#000000' },
        pattern: 'triangles',
        font: 'Goldman'
    },
    {
        id: 'alpha-26',
        name: 'Alpha 26 home',
        colors: { primary: '#000000', secondary: '#39FF14', accent: '#ffffff', textColor: '#39FF14' },
        pattern: 'center-stripe',
        font: 'Anton'
    },
    {
        id: 'classic-retro',
        name: 'Classic retro',
        colors: { primary: '#ffffff', secondary: '#ff0000', accent: '#000000', textColor: '#000000' },
        pattern: 'hoops',
        font: 'Impact'
    },
    {
        id: 'neon-strike',
        name: 'Neon strike',
        colors: { primary: '#0a0a0a', secondary: '#39FF14', accent: '#ffffff', textColor: '#39FF14' },
        pattern: 'diagonal',
        font: 'Goldman'
    },
    {
        id: 'titan-checkers',
        name: 'Titan check',
        colors: { primary: '#ffff00', secondary: '#000000', accent: '#ffffff', textColor: '#000000' },
        pattern: 'checkers',
        font: 'Saira Condensed'
    },
    {
        id: 'liquid-flames',
        name: 'Liquid flames',
        colors: { primary: '#000000', secondary: '#ff33cc', accent: '#ffffff', textColor: '#ff33cc' },
        pattern: 'swirl',
        font: 'Rubik Glitch'
    },
    {
        id: 'cyber-lab',
        name: 'Cyber lab',
        colors: { primary: '#6600cc', secondary: '#39FF14', accent: '#ffffff', textColor: '#39FF14' },
        pattern: 'labyrinth',
        font: 'Chakra Petch'
    },
    {
        id: 'flux-melange',
        name: 'Flux melange',
        colors: { primary: '#00ccff', secondary: '#ffffff', accent: '#000000', textColor: '#ffffff' },
        pattern: 'halftone',
        font: 'Oswald'
    },
    {
        id: 'cyber-pixels',
        name: 'Cyber pixels',
        colors: { primary: '#004d00', secondary: '#39FF14', accent: '#ffffff', textColor: '#39FF14' },
        pattern: 'pixels',
        font: 'Orbitron'
    }
];

// Reference colors from FIFA Kit Creator
const PRESET_COLORS = [
    { "name": "Negro", "hex": "#000000" },
    { "name": "Blanco", "hex": "#ffffff" },
    { "name": "Gris oscuro", "hex": "#333333" },
    { "name": "Gris claro", "hex": "#cccccc" },
    { "name": "Verde Ginga", "hex": "#39FF14" },
    { "name": "Verde bosque", "hex": "#004d00" },
    { "name": "Azul marino", "hex": "#000033" },
    { "name": "Azul real", "hex": "#0000ff" },
    { "name": "Azul cielo", "hex": "#00ccff" },
    { "name": "Rojo Ginga", "hex": "#ff0000" },
    { "name": "Rojo granate", "hex": "#800000" },
    { "name": "Amarillo", "hex": "#ffff00" },
    { "name": "Naranja", "hex": "#ff9900" },
    { "name": "Rosa", "hex": "#ff33cc" },
    { "name": "Morado", "hex": "#6600cc" }
];

const FONT_OPTIONS = [
    // Google Fonts (Available immediatly)
    { name: 'Orbitron', label: 'Orbitron (Tech)' },
    { name: 'Montserrat', label: 'Montserrat (Clean)' },
    { name: 'Oswald', label: 'Oswald (Strong)' },
    { name: 'Anton', label: 'Anton (Bold)' },
    { name: 'Teko', label: 'Teko (Square)' },
    { name: 'Black Ops One', label: 'Black Ops (Military)' },
    { name: 'Saira Condensed', label: 'Saira (Tall)' },
    { name: 'Chakra Petch', label: 'Chakra (Futuristic)' },
    { name: 'Goldman', label: 'Goldman (Sport)' },
    { name: 'Roboto Condensed', label: 'Roboto Cond' },
    { name: 'Maven Pro', label: 'Maven Pro' },
    { name: 'Lato', label: 'Lato' },
    { name: 'Caveat', label: 'Caveat (Hand)' },
    { name: 'Permanent Marker', label: 'Marker' },
    { name: 'Bungee Inline', label: 'Bungee (Retro)' },
    { name: 'Press Start 2P', label: '8-Bit' },
    { name: 'Fontdiner Swanky', label: 'Swanky (Funky)' },

    // Batch 2 Google Fonts
    { name: 'Inter', label: 'Inter (UI Standard)' },
    { name: 'Open Sans', label: 'Open Sans (Neutral)' },
    { name: 'Exo', label: 'Exo (Geometric)' },
    { name: 'Cinzel', label: 'Cinzel (Epic)' },
    { name: 'Creepster', label: 'Creepster (Scary)' },
    { name: 'Faster One', label: 'Faster One (Speed)' },
    { name: 'Passion One', label: 'Passion One (Bold)' },
    { name: 'Saira Stencil One', label: 'Saira Stencil' },
    { name: 'UnifrakturMaguntia', label: 'Unifraktur (Gothic)' },
    { name: 'Playfair Display', label: 'Vogue/Mermaid (Serif)' },
    { name: 'Monoton', label: 'Prisma (Lines)' },
    { name: 'Rubik Glitch', label: 'Glitch (Distorted)' },
    { name: 'Turret Road', label: 'Turret (SciFi)' },

    // Special Requests (Batch 2 - Fallbacks)
    { name: 'Manchester United', label: 'Man Utd', fallback: 'Montserrat' },
    { name: 'Premier League 23-24', label: 'Premier League 24', fallback: 'Anton' },
    { name: 'Arkema', label: 'Arkema', fallback: 'Saira Stencil One' },
    { name: 'Strike 2009', label: 'Strike 09', fallback: 'Teko' },
    { name: 'Mainz', label: 'Mainz', fallback: 'Oswald' },
    { name: 'Mermaid', label: 'Mermaid', fallback: 'Playfair Display' },
    { name: 'FC Barcelona', label: 'FC Barcelona', fallback: 'Teko' },
    { name: 'Jordan Elite', label: 'Jordan Elite', fallback: 'Oswald' },
    { name: 'Ligue 1 2024-25', label: 'Ligue 1 25', fallback: 'Roboto Condensed' },
    { name: 'Al-Hilal 2024-25', label: 'Al-Hilal 25', fallback: 'Chakra Petch' },
    { name: 'Germany 2020', label: 'Germany 20', fallback: 'Saira Condensed' },
    { name: 'Bayern Munchen 2', label: 'Bayern 2', fallback: 'Oswald' },
    { name: 'Puma 2024', label: 'Puma 24', fallback: 'Teko' },
    { name: 'Vogue', label: 'Vogue', fallback: 'Playfair Display' },
    { name: 'Champions', label: 'Champions', fallback: 'Montserrat' },
    { name: 'Strike 2024', label: 'Strike 24', fallback: 'Saira Condensed' },
    { name: 'Lin Libertine', label: 'Lin Libertine', fallback: 'Playfair Display' },
    { name: 'Permanent Marker', label: 'Marker', fallback: 'Permanent Marker' },
    { name: 'AC Milan', label: 'AC Milan', fallback: 'Teko' },
    { name: 'Sevilla 2020', label: 'Sevilla 20', fallback: 'Montserrat' },
    { name: 'Aldo the Apache', label: 'Aldo Apache', fallback: 'Black Ops One' },
    { name: 'Nike 2024', label: 'Nike 24', fallback: 'Oswald' },
    { name: 'Winchester', label: 'Winchester', fallback: 'Playfair Display' },
    { name: 'Strike 2012', label: 'Strike 12', fallback: 'Oswald' },
    { name: 'Serie A', label: 'Serie A Font', fallback: 'Oswald' },
    { name: 'Velocity Home', label: 'Velocity Home', fallback: 'Goldman' },
    { name: 'Real Madrid 2025', label: 'Real Madrid 25', fallback: 'Cinzel' },
    { name: 'Heron', label: 'Heron', fallback: 'Oswald' },
    { name: 'Velocity Away', label: 'Velocity Away', fallback: 'Goldman' },
    { name: 'Turkey', label: 'Turkey', fallback: 'Saira Condensed' },
    { name: 'Ultimate Script', label: 'Ultimate Script', fallback: 'Caveat' },
    { name: 'Whole Trains', label: 'Whole Trains', fallback: 'Bungee Inline' },
    { name: 'Wolfsburg', label: 'Wolfsburg', fallback: 'Impact' },
    { name: 'United Euro 20', label: 'United Euro 20', fallback: 'Teko' },
    { name: 'Brazil 20', label: 'Brazil 20', fallback: 'Saira Condensed' },
    { name: 'Bungee', label: 'Bungee', fallback: 'Bungee Inline' },
    { name: 'Canada', label: 'Canada', fallback: 'Orbitron' },
    { name: 'Creepster', label: 'Creepster', fallback: 'Creepster' },
    { name: 'Crepello Italic', label: 'Crepello', fallback: 'Exo' },
    { name: 'Manchester City UCL 2017', label: 'Man City UCL', fallback: 'Montserrat' },
    { name: 'Real Madrid', label: 'Real Madrid', fallback: 'Montserrat' },
    { name: 'Real Madrid 2021', label: 'Real Madrid 21', fallback: 'Chakra Petch' },
    { name: 'A League', label: 'A League', fallback: 'Oswald' },
    { name: 'BadaBoom', label: 'BadaBoom', fallback: 'Passion One' },
    { name: 'Blazed', label: 'Blazed', fallback: 'Faster One' },
    { name: 'DJB Get Digital', label: 'Digital', fallback: 'Press Start 2P' },
    { name: 'EFL 2022', label: 'EFL 22', fallback: 'Saira Condensed' },
    { name: 'England 2020', label: 'England 20', fallback: 'Oswald' },

    // Special Requests (Batch 3)
    { name: 'Firestarter', label: 'Firestarter', fallback: 'Rubik Glitch' },
    { name: 'France 2020-21', label: 'France 20', fallback: 'Montserrat' },
    { name: 'Liverpool', label: 'Liverpool', fallback: 'Oswald' },
    { name: 'MLS 20', label: 'MLS 20', fallback: 'Saira Condensed' },
    { name: 'MLS Old', label: 'MLS Old', fallback: 'Saira Stencil One' },
    { name: 'Netherlands Euro 2020', label: 'Netherlands 20', fallback: 'Turret Road' },
    { name: 'Premier League Shirt', label: 'PL Shirt', fallback: 'Anton' },
    { name: 'Premier League Shirt Old', label: 'PL Shirt Old', fallback: 'Oswald' },
    { name: 'Prisma', label: 'Prisma', fallback: 'Monoton' },
    { name: 'Elite 20-21', label: 'Elite 20', fallback: 'Oswald' },
    { name: 'Elite 21 Away', label: 'Elite 21 Away', fallback: 'Montserrat' },
    { name: 'PSV Eindhoven 2020-21', label: 'PSV 20', fallback: 'Teko' },
    { name: 'Real Madrid 2022', label: 'Real Madrid 22', fallback: 'Cinzel' },
    { name: 'Real Madrid 2023', label: 'Real Madrid 23', fallback: 'Montserrat' },
    { name: 'Barcelona 2012', label: 'Barcelona 12', fallback: 'Teko' },
    { name: 'Global 2022', label: 'Global 22', fallback: 'Saira Condensed' },
    { name: 'Nike 2022', label: 'Nike 2022', fallback: 'Oswald' },
    { name: 'Puma 2022', label: 'Puma 2022', fallback: 'Teko' },
    { name: 'Premier League', label: 'Premier League', fallback: 'Anton' },
    { name: 'La Liga 23-24', label: 'La Liga 23', fallback: 'Teko' },
    { name: 'Serie A', label: 'Serie A', fallback: 'Montserrat' },
    { name: 'Ligue 1', label: 'Ligue 1', fallback: 'Roboto Condensed' },
    { name: 'Bundesliga', label: 'Bundesliga', fallback: 'Oswald' },
    { name: 'World Cup 2022', label: 'World Cup 22', fallback: 'Goldman' },
    { name: 'Euro 2020', label: 'Euro 2020', fallback: 'Chakra Petch' },
    { name: 'American Captain', label: 'American Captain', fallback: 'Oswald' },
    { name: 'Varsity', label: 'Varsity', fallback: 'Saira Condensed' },
    { name: 'Bebas Neue', label: 'Bebas Neue' },
    { name: 'Impact', label: 'Impact' },
    { name: 'Courier New', label: 'Monospace' }
];

// Helper component for pattern thumbnails
const PatternThumbnail = ({ pattern, color1, color2 }) => {
    // T-shirt path for clipping
    const shirtPath = "M26 6C30 6 34 8 36 11C38 14 42 18 50 18C58 18 62 14 64 11C66 8 70 6 74 6L95 24L82 38L74 30V94H26V30L18 38L5 24L26 6Z";

    return (
        <div style={{ width: '100%', height: '100px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg viewBox="0 0 100 100" style={{ width: '100%', height: '100%', filter: 'drop-shadow(0 4px 6px rgba(0,0,0,0.3))' }} preserveAspectRatio="xMidYMid meet">
                <defs>
                    <clipPath id="shirt-clip">
                        <path d={shirtPath} />
                    </clipPath>
                    <linearGradient id="gradSoftThumb" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stopColor={color1} />
                        <stop offset="100%" stopColor={color2} />
                    </linearGradient>
                    <linearGradient id="gradMultiThumb" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stopColor={color1} />
                        <stop offset="50%" stopColor="#fff" />
                        <stop offset="100%" stopColor={color2} />
                    </linearGradient>
                    <linearGradient id="gradSteppedThumb" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stopColor={color1} />
                        <stop offset="50%" stopColor={color1} />
                        <stop offset="50%" stopColor={color2} />
                        <stop offset="100%" stopColor={color2} />
                    </linearGradient>
                </defs>

                {/* Base Layer (Solid Color to ensure shape visibility) */}
                <path d={shirtPath} fill={color1} />

                {/* Pattern Layer (Clipped to Shirt) */}
                <g clipPath="url(#shirt-clip)">
                    {pattern === 'gradient' && <rect width="100" height="100" fill="url(#gradSoftThumb)" />}
                    {pattern === 'gradient-multi' && <rect width="100" height="100" fill="url(#gradMultiThumb)" />}
                    {pattern === 'stepped-gradient' && <rect width="100" height="100" fill="url(#gradSteppedThumb)" />}

                    {pattern === 'checkers' && (
                        <g fill={color2} opacity={0.6}>
                            <rect x="0" y="0" width="100" height="100" fill={color1} />
                            <pattern id="checkers-thumb" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
                                <rect x="0" y="0" width="10" height="10" fill={color2} />
                                <rect x="10" y="10" width="10" height="10" fill={color2} />
                            </pattern>
                            <rect width="100" height="100" fill="url(#checkers-thumb)" />
                        </g>
                    )}
                    {pattern === 'halftone-lines' && (
                        <g fill={color2} opacity={0.6}>
                            <rect width="100" height="100" fill={color1} />
                            {[10, 20, 30, 40, 50, 60, 70, 80, 90].map(y => <rect key={y} x="0" y={y} width="100" height="4" opacity={1 - y / 100} />)}
                        </g>
                    )}
                    {pattern === 'halftone-dots' && (
                        <g fill={color2} opacity={0.6}>
                            <rect width="100" height="100" fill={color1} />
                            {[10, 30, 50, 70, 90].map(y => [10, 30, 50, 70, 90].map(x => (
                                <circle key={`${x}-${y}`} cx={x} cy={y} r={4 * (1 - y / 100)} />
                            )))}
                        </g>
                    )}
                    {pattern === 'zigzag' && (
                        <g>
                            <rect width="100" height="100" fill={color1} />
                            <path d="M0,0 L12,25 L25,0 L37,25 L50,0 L62,25 L75,0 L87,25 L100,0 V100 H0 Z" fill="none" stroke={color2} strokeWidth="2" opacity={0.8} />
                            <path d="M0,50 L12,75 L25,50 L37,75 L50,50 L62,75 L75,50 L87,75 L100,50" fill="none" stroke={color2} strokeWidth="2" opacity={0.8} />
                        </g>
                    )}
                    {pattern === 'waves' && (
                        <g>
                            <rect width="100" height="100" fill={color1} />
                            <path d="M0,20 Q25,5 50,20 T100,20" fill="none" stroke={color2} strokeWidth="4" opacity={0.7} />
                            <path d="M0,50 Q25,35 50,50 T100,50" fill="none" stroke={color2} strokeWidth="4" opacity={0.7} />
                            <path d="M0,80 Q25,65 50,80 T100,80" fill="none" stroke={color2} strokeWidth="4" opacity={0.7} />
                        </g>
                    )}
                    {pattern === 'cross' && (
                        <g fill={color2} opacity={0.8}>
                            <rect width="100" height="100" fill={color1} />
                            <rect x="42" y="0" width="16" height="100" />
                            <rect x="0" y="42" width="100" height="16" />
                        </g>
                    )}
                    {pattern === 'cross-offset' && (
                        <g fill={color2} opacity={0.8}>
                            <rect width="100" height="100" fill={color1} />
                            <rect x="35" y="0" width="16" height="100" />
                            <rect x="0" y="35" width="100" height="16" />
                        </g>
                    )}
                    {pattern === 'stripes' && (
                        <g fill={color2} opacity={0.8}>
                            <rect width="100" height="100" fill={color1} />
                            <rect x="20" y="0" width="15" height="100" />
                            <rect x="65" y="0" width="15" height="100" />
                        </g>
                    )}
                    {pattern === 'hoops' && (
                        <g fill={color2} opacity={0.8}>
                            <rect width="100" height="100" fill={color1} />
                            <rect x="0" y="30" width="100" height="15" />
                            <rect x="0" y="65" width="100" height="15" />
                        </g>
                    )}
                    {pattern === 'diagonal' && (
                        <g>
                            <rect width="100" height="100" fill={color1} />
                            <path d="M-20,120 L120,-20" stroke={color2} strokeWidth="20" opacity={0.8} />
                        </g>
                    )}
                    {pattern === 'diamonds' && (
                        <g>
                            <rect width="100" height="100" fill={color1} />
                            <pattern id="diamonds-thumb" x="0" y="0" width="30" height="30" patternUnits="userSpaceOnUse">
                                <rect x="15" y="0" width="15" height="15" transform="rotate(45 15 0)" fill={color2} opacity={0.8} />
                            </pattern>
                            <rect width="100" height="100" fill="url(#diamonds-thumb)" />
                        </g>
                    )}
                    {pattern === 'chevron' && (
                        <g>
                            <rect width="100" height="100" fill={color1} />
                            <path d="M0,40 L50,70 L100,40" fill="none" stroke={color2} strokeWidth="12" opacity={0.9} />
                            <path d="M0,70 L50,100 L100,70" fill="none" stroke={color2} strokeWidth="12" opacity={0.9} />
                        </g>
                    )}
                    {pattern === 'center-stripe' && (
                        <g>
                            <rect width="100" height="100" fill={color1} />
                            <rect x="40" y="0" width="20" height="100" fill={color2} opacity={0.9} />
                        </g>
                    )}
                    {pattern === 'sash' && (
                        <g>
                            <rect width="100" height="100" fill={color1} />
                            <path d="M0,0 L25,0 L100,75 L100,100 L75,100 L0,25 Z" fill={color2} opacity={0.9} />
                        </g>
                    )}
                    {pattern === 'double-stripe' && (
                        <g>
                            <rect width="100" height="100" fill={color1} />
                            <rect x="35" y="0" width="8" height="100" fill={color2} opacity={0.9} />
                            <rect x="57" y="0" width="8" height="100" fill={color2} opacity={0.9} />
                        </g>
                    )}

                    {/* NEW MISSING PATTERNS */}
                    {pattern === 'triangles' && (
                        <g>
                            <rect width="100" height="100" fill={color1} />
                            <g fill={color2} opacity={0.6}>
                                <path d="M10,10 L25,10 L17.5,25 Z" />
                                <path d="M30,10 L45,10 L37.5,25 Z" />
                                <path d="M50,10 L65,10 L57.5,25 Z" />
                                <path d="M70,10 L85,10 L77.5,25 Z" />

                                <path d="M17.5,30 L32.5,30 L25,45 Z" />
                                <path d="M37.5,30 L52.5,30 L45,45 Z" />
                                <path d="M57.5,30 L72.5,30 L65,45 Z" />

                                <path d="M10,50 L25,50 L17.5,65 Z" />
                                <path d="M30,50 L45,50 L37.5,65 Z" />
                                <path d="M50,50 L65,50 L57.5,65 Z" />
                                <path d="M70,50 L85,50 L77.5,65 Z" />
                            </g>
                        </g>
                    )}
                    {pattern === 'camo' && (
                        <g>
                            <rect width="100" height="100" fill={color1} />
                            <circle cx="25" cy="25" r="18" fill={color2} opacity={0.4} />
                            <circle cx="65" cy="35" r="22" fill={color2} opacity={0.3} />
                            <circle cx="45" cy="70" r="25" fill={color2} opacity={0.4} />
                            <circle cx="85" cy="75" r="15" fill={color2} opacity={0.3} />
                            <circle cx="15" cy="80" r="12" fill={color2} opacity={0.4} />
                            <path d="M40,20 Q60,10 70,40 Q50,60 30,40 Z" fill={color2} opacity={0.3} />
                        </g>
                    )}
                    {pattern === 'swirl' && (
                        <g>
                            <rect width="100" height="100" fill={color1} />
                            <path d="M50,50 m-40,0 a40,40 0 1,0 80,0 a40,40 0 1,0 -80,0" fill="none" stroke={color2} strokeWidth="5" opacity={0.6} />
                            <path d="M50,50 m-20,0 a20,20 0 1,0 40,0 a20,20 0 1,0 -40,0" fill="none" stroke={color2} strokeWidth="5" opacity={0.6} />
                        </g>
                    )}
                    {pattern === 'hoops-thin' && (
                        <g fill={color2} opacity={0.6}>
                            <rect width="100" height="100" fill={color1} />
                            {Array.from({ length: 15 }).map((_, i) => (
                                <rect key={i} x="0" y={i * 7} width="100" height="2" />
                            ))}
                        </g>
                    )}
                    {pattern === 'ocean-waves' && (
                        <g>
                            <rect width="100" height="100" fill={color1} />
                            <g stroke={color2} strokeWidth="2" fill="none" opacity={0.6}>
                                {Array.from({ length: 6 }).map((_, i) => (
                                    <path key={i} d={`M0,${i * 15 + 10} Q25,${i * 15} 50,${i * 15 + 10} T100,${i * 15 + 10}`} />
                                ))}
                            </g>
                        </g>
                    )}
                    {pattern === 'arches' && (
                        <g>
                            <rect width="100" height="100" fill={color1} />
                            <circle cx="50" cy="100" r="40" fill="none" stroke={color2} strokeWidth="4" opacity={0.6} />
                            <circle cx="50" cy="100" r="25" fill="none" stroke={color2} strokeWidth="4" opacity={0.6} />
                        </g>
                    )}
                    {pattern === 'star' && (
                        <g>
                            <rect width="100" height="100" fill={color1} />
                            <polygon points="50,15 61,35 85,35 66,50 75,75 50,60 25,75 34,50 15,35 39,35" fill={color2} opacity={0.6} />
                        </g>
                    )}
                    {pattern === 'pixels' && (
                        <g>
                            <rect width="100" height="100" fill={color1} />
                            <rect x="10" y="10" width="10" height="10" fill={color2} opacity={0.7} />
                            <rect x="30" y="30" width="10" height="10" fill={color2} opacity={0.7} />
                            <rect x="50" y="10" width="10" height="10" fill={color2} opacity={0.7} />
                            <rect x="70" y="50" width="10" height="10" fill={color2} opacity={0.7} />
                            <rect x="20" y="60" width="10" height="10" fill={color2} opacity={0.7} />
                        </g>
                    )}

                    {/* Default fallback for undefined patterns in thumbnail - just show color1 base */}
                    {!['gradient', 'gradient-multi', 'stepped-gradient', 'checkers', 'halftone-lines', 'halftone-dots', 'zigzag', 'waves', 'cross', 'cross-offset', 'stripes', 'hoops', 'diagonal', 'diamonds', 'chevron', 'center-stripe', 'sash', 'double-stripe', 'triangles', 'camo', 'swirl', 'arches', 'star', 'pixels', 'hoops-thin', 'ocean-waves'].includes(pattern) && pattern !== 'none' && (
                        <g opacity={0.3}>
                            <path d={shirtPath} fill={color2} />
                        </g>
                    )}
                </g>

                {/* Collar Detail */}
                <path d="M26 6C30 6 34 8 36 11C38 14 42 18 50 18C58 18 62 14 64 11C66 8 70 6 74 6" fill="none" stroke="rgba(0,0,0,0.2)" strokeWidth="1" />
            </svg>
        </div>
    );
};

const JerseyDesigner = () => {
    // Default "Teo 69" State
    const [colors, setColors] = useState({
        primary: '#0a0a0a',
        secondary: '#39FF14',
        accent: '#1a1a1a',
        textColor: '#39FF14'
    });
    const [pattern, setPattern] = useState('swirl');
    const [name, setName] = useState('TEO');
    const [number, setNumber] = useState('69');
    const [font, setFont] = useState('Orbitron');
    const [teamLogo, setTeamLogo] = useState(null);
    const [sponsorLogo, setSponsorLogo] = useState(null);

    const [vibrancy, setVibrancy] = useState(50);

    // New Features State
    const [collar, setCollar] = useState('round'); // round, v-neck, polo
    const [sleeve, setSleeve] = useState('normal'); // normal, raglan
    const [showFontDropdown, setShowFontDropdown] = useState(false);

    // Handle template application
    const applyTemplate = (template) => {
        setColors(template.colors);
        setPattern(template.pattern);
        if (template.font) setFont(template.font);
    };

    // Logo Position State - Now 3D
    // Crest (Escudo): Positioned to match the Iron Man reference, now smaller and higher quality
    const [teamLogoPos, setTeamLogoPos] = useState({ pos: [-0.06, 0.08, 0.15], rot: Math.PI, scale: 0.07 });
    // Sponsor: Center, lowered and rotated 180deg to appear upright
    const [sponsorLogoPos, setSponsorLogoPos] = useState({ pos: [0, -0.10, 0.16], rot: Math.PI, scale: 0.25 });
    const [selectedLogo, setSelectedLogo] = useState(null); // 'team' or 'sponsor'

    // Handlers for 3D Decal Updates
    const handleTeamLogoUpdate = (newState) => {
        if (!newState) {
            setTeamLogo(null);
            setSelectedLogo(null);
        } else {
            setTeamLogoPos(prev => ({ ...prev, ...newState }));
        }
    };

    const handleSponsorLogoUpdate = (newState) => {
        if (!newState) {
            setSponsorLogo(null);
            setSelectedLogo(null);
        } else {
            setSponsorLogoPos(prev => ({ ...prev, ...newState }));
        }
    };

    // Navigation State

    // Navigation State
    const [activeTab, setActiveTab] = useState('shield'); // shield, neck, sleeves, text, design
    const [designTab, setDesignTab] = useState('templates'); // templates, colors, patterns

    const [view, setView] = useState('front');
    const [show3D, setShow3D] = useState(true);
    const [viewLocked, setViewLocked] = useState(false);

    const handleColorChange = (key, value) => {
        setColors(prev => ({ ...prev, [key]: value }));
    };

    const handleFileUpload = (e, type) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                if (type === 'team') setTeamLogo(reader.result);
                if (type === 'sponsor') setSponsorLogo(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const jersey3DRef = React.useRef();

    const handleExport = async () => {
        if (jersey3DRef.current) {
            // Show loading state or feedback here if needed
            const images = await jersey3DRef.current.captureViews();

            if (images) {
                const JSZip = (await import('jszip')).default;
                const saveAs = (await import('file-saver')).saveAs;

                const zip = new JSZip();

                // Add Front Image
                zip.file(`ginga-jersey-${name || 'style'}-front.png`, images.front.split(',')[1], { base64: true });

                // Add Back Image
                zip.file(`ginga-jersey-${name || 'style'}-back.png`, images.back.split(',')[1], { base64: true });

                // Generate and Download
                const content = await zip.generateAsync({ type: 'blob' });
                saveAs(content, `ginga-jersey-pack-${name || 'exported'}.zip`);
            }
        }
    };

    return (
        <div className="jersey-designer-container">
            {/* Header */}
            <header className="designer-header">
                <div className="header-center">
                    <img src="/ginga-logo-header.png" alt="Ginga" className="header-logo" style={{ height: '120px' }} />
                </div>
            </header>

            <main className="designer-layout">
                <section className="preview-section">
                    <React.Suspense fallback={<div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: 'white' }}>Cargando Modelo 3D...</div>}>
                        {show3D ? (
                            <div className="canvas-container">
                                <Jersey3D
                                    ref={jersey3DRef}
                                    colors={colors}
                                    pattern={pattern}
                                    name={name}
                                    number={number}
                                    font={font}
                                    teamLogo={teamLogo}
                                    sponsorLogo={sponsorLogo}
                                    vibrancy={vibrancy}
                                    view={view}
                                    collar={collar}
                                    sleeve={sleeve}
                                    viewLocked={viewLocked}

                                    // Interactive Decal Props
                                    teamLogoState={teamLogoPos}
                                    sponsorLogoState={sponsorLogoPos}
                                    onTeamLogoUpdate={handleTeamLogoUpdate}
                                    onSponsorLogoUpdate={handleSponsorLogoUpdate}
                                    selectedLogo={selectedLogo}
                                    onSelectLogo={setSelectedLogo}
                                />

                                {/* View Controls Overlay */}
                                <div className="view-controls" style={{ position: 'absolute', bottom: '20px', right: '20px', display: 'flex', gap: '10px', zIndex: 10 }}>
                                    <button
                                        className={`control-btn ${viewLocked ? 'active' : ''}`}
                                        onClick={() => setViewLocked(!viewLocked)}
                                        title={viewLocked ? "Desbloquear Vista" : "Bloquear Vista"}
                                        style={{ padding: '10px', borderRadius: '50%', border: 'none', background: viewLocked ? '#39FF14' : 'rgba(255,255,255,0.2)', color: viewLocked ? '#000' : '#fff', cursor: 'pointer', backdropFilter: 'blur(5px)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                                    >
                                        {viewLocked ? (
                                            /* LOCKED: Shirt + Horizontal Arrow only */
                                            <div style={{ position: 'relative', width: '24px', height: '24px' }}>
                                                <Shirt size={20} style={{ opacity: 0.5 }} />
                                                <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', background: 'rgba(57, 255, 20, 0.8)', borderRadius: '4px', padding: '0px' }}>
                                                    <ArrowLeftRight size={16} strokeWidth={3} color="black" />
                                                </div>
                                            </div>
                                        ) : (
                                            /* UNLOCKED: Shirt + 4-way Arrow */
                                            <div style={{ position: 'relative', width: '24px', height: '24px' }}>
                                                <Shirt size={20} style={{ opacity: 0.8 }} />
                                                <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', background: 'rgba(0,0,0,0.5)', borderRadius: '50%', padding: '1px' }}>
                                                    <Move size={14} color="white" strokeWidth={2.5} />
                                                </div>
                                            </div>
                                        )}
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <JerseyPreview
                                colors={colors}
                                pattern={pattern}
                                name={name}
                                number={number}
                                font={font}
                                teamLogo={teamLogo}
                                sponsorLogo={sponsorLogo}
                                vibrancy={vibrancy}
                                collar={collar}
                                sleeve={sleeve}
                            />
                        )}
                    </React.Suspense>
                </section>

                <aside className="controls-section">
                    <nav className="controls-nav">
                        <button className={activeTab === 'shield' ? 'active' : ''} onClick={() => { setActiveTab('shield'); setSelectedLogo(null); }}>
                            <Image size={20} />
                            <span>Escudo</span>
                        </button>
                        <button className={activeTab === 'text' ? 'active' : ''} onClick={() => { setActiveTab('text'); setSelectedLogo(null); }}>
                            <Type size={20} />
                            <span>Texto</span>
                        </button>
                        <button className={activeTab === 'design' ? 'active' : ''} onClick={() => { setActiveTab('design'); setSelectedLogo(null); }}>
                            <Palette size={20} />
                            <span>Diseño</span>
                        </button>
                    </nav>

                    <div className="controls-content">
                        {/* 1. SECCIÓN ESCUDO */}
                        {activeTab === 'shield' && (
                            <div className="control-group">
                                <h3>Escudo del Equipo</h3>
                                <p className="section-desc">Sube tu escudo y aparecerá en el pecho.</p>

                                <div className="upload-item" style={{ marginTop: '20px' }}>
                                    <div className="upload-zone">
                                        {teamLogo ? (
                                            <div className="upload-preview-container" style={{ marginTop: '10px', textAlign: 'center' }}>
                                                <img src={teamLogo} alt="Team Logo" style={{ height: '60px', objectFit: 'contain' }} />
                                            </div>
                                        ) : (
                                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', opacity: 0.5 }}>
                                            </div>
                                        )}
                                        <input type="file" accept="image/*" onChange={(e) => handleFileUpload(e, 'team')} />
                                        <span>Click para subir imagen</span>
                                    </div>
                                </div>

                                {/* Team Logo Controls */}
                                {teamLogo && (
                                    <div className="control-group" style={{ marginTop: '20px', borderTop: '1px solid var(--border)', paddingTop: '15px' }}>
                                        <h3 style={{ marginBottom: '10px', fontSize: '11px', color: 'var(--text-dim)' }}>Posición escudo</h3>

                                        <div className="input-item">
                                            <label style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                Posición y Tamaño
                                                <span style={{ fontSize: '0.7em', color: '#39FF14' }}>INTERACTIVO</span>
                                            </label>
                                            <div style={{ fontSize: '0.8rem', color: '#aaa', padding: '5px', background: 'rgba(255,255,255,0.05)', borderRadius: '4px' }}>
                                                Haz clic en el logo sobre la camiseta para moverlo, rotarlo o cambiar su tamaño.
                                            </div>
                                        </div>

                                        <button
                                            onClick={() => setTeamLogo(null)}
                                            className="delete-item-btn"
                                            style={{
                                                marginTop: '15px',
                                                width: '100%',
                                                padding: '10px',
                                                background: 'rgba(255, 68, 68, 0.1)',
                                                border: '1px solid rgba(255, 68, 68, 0.3)',
                                                borderRadius: '8px',
                                                color: '#ff4444',
                                                cursor: 'pointer',
                                                fontSize: '12px',
                                                fontWeight: 'Bold',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                gap: '8px',
                                                transition: 'all 0.2s ease'
                                            }}
                                        >
                                            <Trash2 size={16} />
                                            Eliminar escudo
                                        </button>
                                    </div>
                                )}
                                <div className="upload-item" style={{ marginTop: '20px' }}>
                                    <label>Patrocinador (opcional)</label>
                                    <div className="upload-zone">
                                        {sponsorLogo ? (
                                            <div className="upload-preview-container" style={{ marginTop: '10px', textAlign: 'center' }}>
                                                <img src={sponsorLogo} alt="Sponsor Logo" style={{ height: '40px', objectFit: 'contain' }} />
                                            </div>
                                        ) : (
                                            <input type="file" accept="image/*" onChange={(e) => handleFileUpload(e, 'sponsor')} />
                                        )}
                                        {!sponsorLogo && <span>Click para subir</span>}
                                    </div>
                                </div>

                                {/* Sponsor Logo Controls */}
                                {sponsorLogo && (
                                    <div className="control-group" style={{ marginTop: '20px', borderTop: '1px solid var(--border)', paddingTop: '15px' }}>
                                        <h3 style={{ marginBottom: '10px', fontSize: '11px', color: 'var(--text-dim)' }}>Posición patrocinador</h3>

                                        <div className="input-item">
                                            <label style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                Posición y Tamaño
                                                <span style={{ fontSize: '0.7em', color: '#39FF14' }}>INTERACTIVO</span>
                                            </label>
                                            <div style={{ fontSize: '0.8rem', color: '#aaa', padding: '5px', background: 'rgba(255,255,255,0.05)', borderRadius: '4px' }}>
                                                Haz clic en el logo sobre la camiseta para moverlo, rotarlo o cambiar su tamaño.
                                            </div>
                                        </div>

                                        <button
                                            onClick={() => setSponsorLogo(null)}
                                            className="delete-item-btn"
                                            style={{
                                                marginTop: '15px',
                                                width: '100%',
                                                padding: '10px',
                                                background: 'rgba(255, 68, 68, 0.1)',
                                                border: '1px solid rgba(255, 68, 68, 0.3)',
                                                borderRadius: '8px',
                                                color: '#ff4444',
                                                cursor: 'pointer',
                                                fontSize: '12px',
                                                fontWeight: 'Bold',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                gap: '8px',
                                                transition: 'all 0.2s ease'
                                            }}
                                        >
                                            <Trash2 size={16} />
                                            Eliminar patrocinador
                                        </button>
                                    </div>
                                )}
                            </div>
                        )}



                        {/* 4. SECCIÓN TEXTO */}
                        {activeTab === 'text' && (
                            <div className="control-group">
                                <h3>Personalización</h3>
                                <div className="input-item">
                                    <label>Nombre Jugador</label>
                                    <input type="text" value={name} maxLength={10} onChange={(e) => setName(e.target.value)} />
                                </div>
                                <div className="input-item">
                                    <label>Dorsal</label>
                                    <input type="text" value={number} maxLength={2} onChange={(e) => setNumber(e.target.value)} />
                                </div>
                                <div className="input-item">
                                    <label>Color del texto</label>
                                    <input type="color" value={colors.textColor} onChange={(e) => handleColorChange('textColor', e.target.value)} />
                                </div>
                                <div className="input-item">
                                    <label>Fuente</label>
                                    <div className="custom-select-container">
                                        <button
                                            className="font-select-trigger"
                                            onClick={() => setShowFontDropdown(!showFontDropdown)}
                                            style={{ fontFamily: font }}
                                        >
                                            <span>
                                                {FONT_OPTIONS.find(f => f.name === font)?.label || font}
                                            </span>
                                            <Grip size={16} style={{ opacity: 0.5 }} />
                                        </button>

                                        {showFontDropdown && (
                                            <div className="font-dropdown-menu">
                                                {FONT_OPTIONS.map(f => (
                                                    <button
                                                        key={f.name}
                                                        className={`font-option-item ${font === f.name ? 'active' : ''}`}
                                                        onClick={() => {
                                                            setFont(f.name);
                                                            setShowFontDropdown(false);
                                                        }}
                                                        style={{ fontFamily: f.name === font ? f.name : (f.fallback || f.name) }}
                                                    >
                                                        <span style={{ fontSize: '1.1em' }}>{f.label}</span>
                                                        {font === f.name && <Check size={16} />}
                                                    </button>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* 5. SECCIÓN DISEÑO (SUB-PESTAÑAS) */}
                        {activeTab === 'design' && (
                            <div className="design-section-wrapper">
                                <div className="sub-tabs">
                                    <button className={designTab === 'templates' ? 'active' : ''} onClick={() => setDesignTab('templates')}>Plantillas</button>
                                    <button className={designTab === 'colors' ? 'active' : ''} onClick={() => setDesignTab('colors')}>Colores</button>
                                    <button className={designTab === 'patterns' ? 'active' : ''} onClick={() => setDesignTab('patterns')}>Patrones</button>
                                </div>

                                <div className="sub-content">
                                    {designTab === 'templates' && (
                                        <div className="templates-grid">
                                            {JERSEY_TEMPLATES.map(t => (
                                                <div key={t.id} className="template-card" onClick={() => applyTemplate(t)}>
                                                    <div className="template-preview" style={{ background: t.colors.primary }}>
                                                        <div className="template-stripe" style={{ background: t.colors.secondary }}></div>
                                                    </div>
                                                    <span>{t.name}</span>
                                                </div>
                                            ))}
                                        </div>
                                    )}

                                    {designTab === 'colors' && (
                                        <div className="control-group">
                                            <div className="color-picker-item">
                                                <label>Color 1 (principal)</label>
                                                <input type="color" value={colors.primary} onChange={(e) => handleColorChange('primary', e.target.value)} />
                                            </div>
                                            <div className="color-picker-item">
                                                <label>Color 2 (diseño/patrón)</label>
                                                <input type="color" value={colors.secondary} onChange={(e) => handleColorChange('secondary', e.target.value)} />
                                            </div>
                                            <div className="color-picker-item">
                                                <label>Color del texto</label>
                                                <input type="color" value={colors.textColor} onChange={(e) => handleColorChange('textColor', e.target.value)} />
                                            </div>


                                            <div className="presets-grid" style={{ marginTop: '20px', display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '8px' }}>
                                                {PRESET_COLORS.map(c => (
                                                    <button
                                                        key={c.name}
                                                        title={c.name}
                                                        onClick={() => handleColorChange('primary', c.hex)}
                                                        style={{
                                                            width: '24px',
                                                            height: '24px',
                                                            borderRadius: '50%',
                                                            background: c.hex,
                                                            border: '1px solid rgba(255,255,255,0.2)',
                                                            cursor: 'pointer'
                                                        }}
                                                    />
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {designTab === 'patterns' && (
                                        <div className="pattern-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '25px', padding: '10px' }}>
                                            {PATTERNS_LIST.map(p => (
                                                <button
                                                    key={p.id}
                                                    className={pattern === p.id ? 'active' : ''}
                                                    onClick={() => setPattern(p.id)}
                                                    style={{
                                                        display: 'flex',
                                                        flexDirection: 'column',
                                                        alignItems: 'center',
                                                        padding: '20px 10px',
                                                        background: 'var(--surface)',
                                                        border: pattern === p.id ? '2px solid var(--accent)' : '1px solid var(--border)',
                                                        borderRadius: '16px',
                                                        cursor: 'pointer',
                                                        transition: 'transform 0.2s',
                                                        minHeight: '180px',
                                                        justifyContent: 'space-between'
                                                    }}
                                                >
                                                    <div style={{ width: '100%', flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '15px' }}>
                                                        <PatternThumbnail pattern={p.id} color1={colors.primary} color2={colors.secondary} />
                                                    </div>
                                                    <span style={{ fontSize: '13px', fontWeight: '500', textAlign: 'center', color: 'var(--text-primary)', width: '100%' }}>{p.label}</span>
                                                </button>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Persistent Export Button */}
                    <div className="controls-footer" style={{ padding: '20px', borderTop: '1px solid var(--border)', background: 'var(--surface)' }}>
                        <button className="btn-primary" onClick={handleExport} style={{ width: '100%', justifyContent: 'center', padding: '16px' }}>
                            <Download size={20} />
                            <span style={{ fontSize: '16px', letterSpacing: '1px' }}>EXPORTAR DISEÑO</span>
                        </button>
                    </div>
                </aside>
            </main>
        </div>
    );
};

export default JerseyDesigner;
