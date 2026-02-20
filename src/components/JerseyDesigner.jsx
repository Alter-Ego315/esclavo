import React, { useState } from 'react';
import Jersey3D from './Jersey3D';
import JerseyPreview from './JerseyPreview';
import { ChevronRight, ChevronLeft, Upload, Shirt, RotateCcw, Share2, Download, Eye, Layers, Type, Palette, Scissors, Binary, Grip, RotateCw, Image, ArrowLeftRight, Move, Check } from 'lucide-react';
import '../styles/JerseyDesigner.css';

const PATTERNS_LIST = [
    { id: 'none', label: 'Ninguno' },
    { id: 'gradient', label: 'Degradado' },
    { id: 'gradient-multi', label: 'Degradado Multi' },
    { id: 'halftone-lines', label: 'Líneas' },
    { id: 'halftone-dots', label: 'Puntos' },
    { id: 'checkers', label: 'Ajedrez' },
    { id: 'stepped-gradient', label: 'Degradado Escalonado' },
    { id: 'zigzag', label: 'Zig Zag' },
    { id: 'waves', label: 'Olas' },
    { id: 'cross', label: 'Cruz' },
    { id: 'cross-offset', label: 'Cruz Nórdica' },
    { id: 'stripes', label: 'Rayas Verticales' },
    { id: 'hoops', label: 'Rayas Horizontales' },
    { id: 'diagonal', label: 'Diagonal' },
    { id: 'diamonds', label: 'Rombos' },
    { id: 'chevron', label: 'Chevron' },
    { id: 'triangles', label: 'Triángulos' },
    { id: 'camo', label: 'Camuflaje' },
    { id: 'swirl', label: 'Remolino' },
    { id: 'arches', label: 'Arcos' },
    { id: 'star', label: 'Estrella' },
    { id: 'pixels', label: 'Pixelado' },
    { id: 'center-stripe', label: 'Franja Central' },
    { id: 'sash', label: 'Banda' },
    { id: 'double-stripe', label: 'Doble Franja' },
];

const JERSEY_TEMPLATES = [
    {
        id: 'ginga-classic',
        name: 'Ginga Classic',
        colors: { primary: '#0a0a0a', secondary: '#39FF14', accent: '#1a1a1a' },
        pattern: 'swirl',
        font: 'Orbitron'
    },
    {
        id: 'adidas-arches',
        name: 'Adidas Arches',
        colors: { primary: '#000000', secondary: '#444444', accent: '#000000' },
        pattern: 'arches',
        font: 'Teko'
    },
    {
        id: 'adidas-camo',
        name: 'Adidas Camo',
        colors: { primary: '#2c3e50', secondary: '#34495e', accent: '#000000' },
        pattern: 'camo',
        font: 'Black Ops One'
    },
    {
        id: 'adidas-checkers',
        name: 'Adidas Check',
        colors: { primary: '#ffffff', secondary: '#000000', accent: '#000000' },
        pattern: 'checkers',
        font: 'Saira Condensed'
    },
    {
        id: 'liquid-flames',
        name: 'Liquid Flames',
        colors: { primary: '#000000', secondary: '#00d2ff', accent: '#ffffff' },
        pattern: 'swirl',
        font: 'Rubik Glitch'
    },
    {
        id: 'adidas-tri',
        name: 'Adidas Tri',
        colors: { primary: '#e74c3c', secondary: '#c0392b', accent: '#ffffff' },
        pattern: 'triangles',
        font: 'Goldman'
    },
    {
        id: 'adidas-lab',
        name: 'Adidas Lab',
        colors: { primary: '#ffeaa7', secondary: '#fdcb6e', accent: '#2d3436' },
        pattern: 'labyrinth',
        font: 'Chakra Petch'
    },
    {
        id: 'adidas-melange',
        name: 'Adidas Melange',
        colors: { primary: '#b2bec3', secondary: '#636e72', accent: '#2d3436' },
        pattern: 'halftone',
        font: 'Oswald'
    },
    {
        id: 'psg-26',
        name: 'PSG 26 Home',
        colors: { primary: '#2c3e50', secondary: '#e74c3c', accent: '#ecf0f1' },
        pattern: 'center-stripe',
        font: 'Anton'
    },
    {
        id: 'neon-strike',
        name: 'Neon Strike',
        colors: { primary: '#0a0a0a', secondary: '#39FF14', accent: '#1a1a1a' },
        pattern: 'diagonal',
        font: 'Goldman'
    },
    {
        id: 'classic-retro',
        name: 'Classic Retro',
        colors: { primary: '#cc0000', secondary: '#ffffff', accent: '#ffffff' },
        pattern: 'hoops',
        font: 'Impact'
    },
    {
        id: 'cyber-pixels',
        name: 'Cyber Pixels',
        colors: { primary: '#1a1a2e', secondary: '#00d2ff', accent: '#0f3460' },
        pattern: 'pixels',
        font: 'Orbitron'
    }
];

// Reference colors from FIFA Kit Creator
const PRESET_COLORS = [
    { "name": "Negro", "hex": "#000000" }, { "name": "Blanco", "hex": "#ffffff" },
    { "name": "Rojo Arsenal", "hex": "#cf151f" }, { "name": "Azul Arsenal", "hex": "#232e44" },
    { "name": "Azul Chelsea", "hex": "#123e89" }, { "name": "Rojo Liverpool", "hex": "#b7121d" },
    { "name": "Azul Man City", "hex": "#4ea7f0" }, { "name": "Rojo Man Utd", "hex": "#ce152d" },
    { "name": "Oro Real Madrid", "hex": "#baa071" }, { "name": "Azul Barcelona", "hex": "#2261b2" },
    { "name": "Rojo Barcelona", "hex": "#d63c54" }, { "name": "Azul PSG", "hex": "#242e47" },
    { "name": "Oro Juventus", "hex": "#bf9556" }, { "name": "Amarillo Dortmund", "hex": "#f1d501" },
    { "name": "Rojo Bayern", "hex": "#d00a2c" }, { "name": "Azul Inter", "hex": "#2270d7" },
    { "name": "Rojo Milan", "hex": "#d3222d" }, { "name": "Azul Napoli", "hex": "#308ded" },
    { "name": "Rojo Ajax", "hex": "#d2122e" }, { "name": "Verde Ginga", "hex": "#39FF14" }
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
    { name: 'Adidas 2009', label: 'Adidas 09', fallback: 'Teko' },
    { name: 'Mainz', label: 'Mainz', fallback: 'Oswald' },
    { name: 'Mermaid', label: 'Mermaid', fallback: 'Playfair Display' },
    { name: 'FC Barcelona', label: 'FC Barcelona', fallback: 'Teko' },
    { name: 'PSG Jordan', label: 'PSG Jordan', fallback: 'Oswald' },
    { name: 'Ligue 1 2024-25', label: 'Ligue 1 25', fallback: 'Roboto Condensed' },
    { name: 'Al-Hilal 2024-25', label: 'Al-Hilal 25', fallback: 'Chakra Petch' },
    { name: 'Germany 2020', label: 'Germany 20', fallback: 'Saira Condensed' },
    { name: 'Bayern Munchen 2', label: 'Bayern 2', fallback: 'Oswald' },
    { name: 'Puma 2024', label: 'Puma 24', fallback: 'Teko' },
    { name: 'Vogue', label: 'Vogue', fallback: 'Playfair Display' },
    { name: 'Champions', label: 'Champions', fallback: 'Montserrat' },
    { name: 'Adidas 2024', label: 'Adidas 24', fallback: 'Saira Condensed' },
    { name: 'Lin Libertine', label: 'Lin Libertine', fallback: 'Playfair Display' },
    { name: 'Permanent Marker', label: 'Marker', fallback: 'Permanent Marker' },
    { name: 'AC Milan', label: 'AC Milan', fallback: 'Teko' },
    { name: 'Sevilla 2020', label: 'Sevilla 20', fallback: 'Montserrat' },
    { name: 'Aldo the Apache', label: 'Aldo Apache', fallback: 'Black Ops One' },
    { name: 'Nike 2024', label: 'Nike 24', fallback: 'Oswald' },
    { name: 'Winchester', label: 'Winchester', fallback: 'Playfair Display' },
    { name: 'Adidas 2012', label: 'Adidas 12', fallback: 'Oswald' },
    { name: 'Serie A', label: 'Serie A Font', fallback: 'Oswald' },
    { name: 'Adidas 2026 Home', label: 'Adidas 26 Home', fallback: 'Goldman' },
    { name: 'Real Madrid 2025', label: 'Real Madrid 25', fallback: 'Cinzel' },
    { name: 'Heron', label: 'Heron', fallback: 'Oswald' },
    { name: 'Adidas 2026 Away', label: 'Adidas 26 Away', fallback: 'Goldman' },
    { name: 'Turkey', label: 'Turkey', fallback: 'Saira Condensed' },
    { name: 'Ultimate Script', label: 'Ultimate Script', fallback: 'Caveat' },
    { name: 'Whole Trains', label: 'Whole Trains', fallback: 'Bungee Inline' },
    { name: 'Wolfsburg', label: 'Wolfsburg', fallback: 'Impact' },
    { name: 'Adidas Euro 2020', label: 'Adidas Euro 20', fallback: 'Teko' },
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
    { name: 'PSG 20-21', label: 'PSG 20', fallback: 'Oswald' },
    { name: 'PSG 21-22 Away', label: 'PSG 21 Away', fallback: 'Montserrat' },
    { name: 'PSV Eindhoven 2020-21', label: 'PSV 20', fallback: 'Teko' },
    { name: 'Real Madrid 2022', label: 'Real Madrid 22', fallback: 'Cinzel' },
    { name: 'Real Madrid 2023', label: 'Real Madrid 23', fallback: 'Montserrat' },
    { name: 'Barcelona 2012', label: 'Barcelona 12', fallback: 'Teko' },
    { name: 'Adidas 2022', label: 'Adidas 2022', fallback: 'Saira Condensed' },
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
                            <path d="M0,0 L10,20 L20,0 Z M30,0 L40,20 L50,0 Z M60,0 L70,20 L80,0 Z" fill={color2} opacity={0.6} transform="scale(1.5)" />
                        </g>
                    )}
                    {pattern === 'camo' && (
                        <g>
                            <rect width="100" height="100" fill={color1} />
                            <circle cx="20" cy="20" r="15" fill={color2} opacity={0.5} />
                            <circle cx="60" cy="50" r="20" fill={color2} opacity={0.5} />
                            <circle cx="30" cy="80" r="18" fill={color2} opacity={0.5} />
                            <circle cx="80" cy="20" r="12" fill={color2} opacity={0.5} />
                        </g>
                    )}
                    {pattern === 'swirl' && (
                        <g>
                            <rect width="100" height="100" fill={color1} />
                            <path d="M50,50 m-40,0 a40,40 0 1,0 80,0 a40,40 0 1,0 -80,0" fill="none" stroke={color2} strokeWidth="5" opacity={0.6} />
                            <path d="M50,50 m-20,0 a20,20 0 1,0 40,0 a20,20 0 1,0 -40,0" fill="none" stroke={color2} strokeWidth="5" opacity={0.6} />
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
                    {!['gradient', 'gradient-multi', 'stepped-gradient', 'checkers', 'halftone-lines', 'halftone-dots', 'zigzag', 'waves', 'cross', 'cross-offset', 'stripes', 'hoops', 'diagonal', 'diamonds', 'chevron', 'center-stripe', 'sash', 'double-stripe', 'triangles', 'camo', 'swirl', 'arches', 'star', 'pixels'].includes(pattern) && pattern !== 'none' && (
                        <text x="50" y="60" textAnchor="middle" fill={color2} fontSize="30" fontWeight="bold">?</text>
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
        primary: '#ffffff',
        secondary: '#000000',
        accent: '#1a1a1a'
    });
    const [pattern, setPattern] = useState('splatter');
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

    // Logo Position State - Now 3D
    // Crest (Escudo): Viewer's Right (wearer's left), high on chest
    // Maps to SVG y=-325 x=300 approx (Symmetrically opposed to brand logo)
    const [teamLogoPos, setTeamLogoPos] = useState({ pos: [0.12, 0.22, 0.13], rot: 0, scale: 0.1 });
    // Sponsor: Center
    const [sponsorLogoPos, setSponsorLogoPos] = useState({ pos: [0, 0.05, 0.16], rot: 0, scale: 0.25 });
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

    const applyTemplate = (template) => {
        setColors(template.colors);
        setPattern(template.pattern);
        setFont(template.font);
        if (template.vibrancy) setVibrancy(template.vibrancy);
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
                            <span>ESCUDO</span>
                        </button>
                        <button className={activeTab === 'text' ? 'active' : ''} onClick={() => { setActiveTab('text'); setSelectedLogo(null); }}>
                            <Type size={20} />
                            <span>TEXTO</span>
                        </button>
                        <button className={activeTab === 'design' ? 'active' : ''} onClick={() => { setActiveTab('design'); setSelectedLogo(null); }}>
                            <Palette size={20} />
                            <span>DISEÑO</span>
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
                                                <button onClick={() => setTeamLogo(null)} style={{ display: 'block', margin: '5px auto', fontSize: '10px', color: 'red', background: 'none', border: 'none', cursor: 'pointer' }}>Eliminar</button>
                                            </div>
                                        ) : (
                                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', opacity: 0.5 }}>
                                            </div>
                                        )}
                                        <input type="file" accept="image/*" onChange={(e) => handleFileUpload(e, 'team')} />
                                        <span>Click para Subir Imagen</span>
                                    </div>
                                </div>

                                {/* Team Logo Controls */}
                                {teamLogo && (
                                    <div className="control-group" style={{ marginTop: '20px', borderTop: '1px solid var(--border)', paddingTop: '15px' }}>
                                        <h3 style={{ marginBottom: '10px', fontSize: '11px', color: 'var(--text-dim)' }}>POSICIÓN ESCUDO</h3>

                                        <div className="input-item">
                                            <label style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                Posición y Tamaño
                                                <span style={{ fontSize: '0.7em', color: '#39FF14' }}>INTERACTIVO</span>
                                            </label>
                                            <div style={{ fontSize: '0.8rem', color: '#aaa', padding: '5px', background: 'rgba(255,255,255,0.05)', borderRadius: '4px' }}>
                                                Haz clic en el logo sobre la camiseta para moverlo, rotarlo o cambiar su tamaño.
                                            </div>
                                        </div>
                                    </div>
                                )}
                                <div className="upload-item" style={{ marginTop: '20px' }}>
                                    <label>Patrocinador (Opcional)</label>
                                    <div className="upload-zone">
                                        {sponsorLogo ? (
                                            <div className="upload-preview-container" style={{ marginTop: '10px', textAlign: 'center' }}>
                                                <img src={sponsorLogo} alt="Sponsor Logo" style={{ height: '40px', objectFit: 'contain' }} />
                                                <button onClick={() => setSponsorLogo(null)} style={{ display: 'block', margin: '5px auto', fontSize: '10px', color: 'red', background: 'none', border: 'none', cursor: 'pointer' }}>Eliminar</button>
                                            </div>
                                        ) : (
                                            <input type="file" accept="image/*" onChange={(e) => handleFileUpload(e, 'sponsor')} />
                                        )}
                                        {!sponsorLogo && <span>Click para Subir</span>}
                                    </div>
                                </div>

                                {/* Sponsor Logo Controls */}
                                {sponsorLogo && (
                                    <div className="control-group" style={{ marginTop: '20px', borderTop: '1px solid var(--border)', paddingTop: '15px' }}>
                                        <h3 style={{ marginBottom: '10px', fontSize: '11px', color: 'var(--text-dim)' }}>POSICIÓN PATROCINADOR</h3>

                                        <div className="input-item">
                                            <label style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                Posición y Tamaño
                                                <span style={{ fontSize: '0.7em', color: '#39FF14' }}>INTERACTIVO</span>
                                            </label>
                                            <div style={{ fontSize: '0.8rem', color: '#aaa', padding: '5px', background: 'rgba(255,255,255,0.05)', borderRadius: '4px' }}>
                                                Haz clic en el logo sobre la camiseta para moverlo, rotarlo o cambiar su tamaño.
                                            </div>
                                        </div>
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
                                                <label>Color 1 (Principal)</label>
                                                <input type="color" value={colors.primary} onChange={(e) => handleColorChange('primary', e.target.value)} />
                                            </div>
                                            <div className="color-picker-item">
                                                <label>Color 2 (Nombre y Número)</label>
                                                <input type="color" value={colors.secondary} onChange={(e) => handleColorChange('secondary', e.target.value)} />
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
