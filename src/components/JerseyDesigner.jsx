import React, { useState, useEffect } from 'react';
import Jersey3D from './Jersey3D';
import JerseyPreview from './JerseyPreview';
import { ChevronRight, ChevronLeft, Upload, Shirt, RotateCcw, Share2, Download, Eye, Layers, Type, Palette, Scissors, Binary, Grip, RotateCw, Image, ArrowLeftRight, Move, Check, Trash2 } from 'lucide-react';
import '../styles/JerseyDesigner.css';

const PATTERNS_LIST = [
    { id: 'none', label: 'Ninguno' },
    { id: 'gradient', label: 'Degradado' },
    { id: 'halftone-lines', label: 'Líneas' },
    { id: 'halftone-dots', label: 'Puntos' },
    { id: 'checkers', label: 'Ajedrez' },
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
        font: 'Ethnocentric'
    },
    {
        id: 'nova-camo',
        name: 'Nova camo',
        colors: { primary: '#ff0000', secondary: '#000000', accent: '#ffffff', textColor: '#ffffff' },
        pattern: 'camo',
        font: 'Oswald'
    },
    {
        id: 'apex-arches',
        name: 'Apex arches',
        colors: { primary: '#0000ff', secondary: '#ffffff', accent: '#000000', textColor: '#ffffff' },
        pattern: 'arches',
        font: 'Real Madrid 2022'
    },
    {
        id: 'vortex-tri',
        name: 'Vortex tri',
        colors: { primary: '#ff9900', secondary: '#000000', accent: '#ffffff', textColor: '#000000' },
        pattern: 'triangles',
        font: 'Algerian'
    },
    {
        id: 'alpha-26',
        name: 'Alpha 26 home',
        colors: { primary: '#000000', secondary: '#39FF14', accent: '#ffffff', textColor: '#39FF14' },
        pattern: 'center-stripe',
        font: 'Eras ITC Demi'
    },
    {
        id: 'classic-retro',
        name: 'Classic retro',
        colors: { primary: '#ffffff', secondary: '#ff0000', accent: '#000000', textColor: '#000000' },
        pattern: 'hoops',
        font: 'Real Madrid 2009'
    },
    {
        id: 'neon-strike',
        name: 'Neon strike',
        colors: { primary: '#0a0a0a', secondary: '#39FF14', accent: '#ffffff', textColor: '#39FF14' },
        pattern: 'diagonal',
        font: 'Oswald'
    },
    {
        id: 'titan-checkers',
        name: 'Titan check',
        colors: { primary: '#ffff00', secondary: '#000000', accent: '#ffffff', textColor: '#000000' },
        pattern: 'checkers',
        font: 'Algerian'
    },
    {
        id: 'liquid-flames',
        name: 'Liquid flames',
        colors: { primary: '#000000', secondary: '#ff33cc', accent: '#ffffff', textColor: '#ff33cc' },
        pattern: 'swirl',
        font: 'Brush King'
    },
    {
        id: 'cyber-lab',
        name: 'Cyber lab',
        colors: { primary: '#6600cc', secondary: '#39FF14', accent: '#ffffff', textColor: '#39FF14' },
        pattern: 'labyrinth',
        font: 'Ethnocentric'
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
        font: 'Real Madrid UCL 2021'
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

export const GINGA_LOGOS = [
    { name: 'blanco', path: '/Logos de Ginga/Logo Ginga trasparente sin texto (blanco).png' },
    { name: 'negro', path: '/Logos de Ginga/Logo Ginga trasparente sin texto (negro).png' },
    { name: 'verde', path: '/Logos de Ginga/Logo Ginga trasparente sin texto (verde).png' },
    { name: 'rojo', path: '/Logos de Ginga/Logo Ginga trasparente sin texto (rojo).png' },
    { name: 'azul claro', path: '/Logos de Ginga/Logo Ginga trasparente sin texto (azul claro).png' },
    { name: 'azul oscuro', path: '/Logos de Ginga/Logo Ginga trasparente sin texto (azul oscuro).png' },
    { name: 'amarillo', path: '/Logos de Ginga/Logo Ginga trasparente sin texto (amarillo).png' },
    { name: 'naranja', path: '/Logos de Ginga/Logo Ginga trasparente sin texto (orange).png' },
    { name: 'rosa', path: '/Logos de Ginga/Logo Ginga trasparente sin texto (rosa).png' },
    { name: 'morado', path: '/Logos de Ginga/Logo Ginga trasparente sin texto (morado).png' }
];

const RAW_FONT_OPTIONS = [
    // American Captain (Google Font)
    { name: 'Oswald', label: 'American Captain' },

    // Local Fonts (from public/Fonts)
    { name: 'Algerian', label: 'Algerian' },
    { name: 'Blowbrush', label: 'Blowbrush' },
    { name: 'Brush King', label: 'Brush King' },
    { name: 'Eras ITC Demi', label: 'Eras ITC Demi' },
    { name: 'Ethnocentric', label: 'Ethnocentric' },
    { name: 'Real Madrid 2009', label: 'Real Madrid 09' },
    { name: 'Real Madrid 18-19', label: 'Real Madrid 18-19' },
    { name: 'Real Madrid 19-20', label: 'Real Madrid 19-20' },
    { name: 'Real Madrid UCL 2019', label: 'Real Madrid UCL 19' },
    { name: 'Real Madrid UCL 2021', label: 'Real Madrid UCL 21' },
    { name: 'Real Madrid 2022', label: 'Real Madrid 22' },
    { name: 'Real Madrid 2022 Alt', label: 'Real Madrid 22 Alt' },
];

export const FONT_OPTIONS = RAW_FONT_OPTIONS.sort((a, b) => a.label.localeCompare(b.label));

// Width heuristic: Oswald is condensed, others use default limit
const getFontCharacterLimit = (fontName) => {
    if (fontName === 'Oswald') return 22; // condensed
    return 15; // default for all local fonts
};
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
    const [pattern, setPattern] = useState('none');
    const [name, setName] = useState('TEO');
    const [number, setNumber] = useState('69');
    const [font, setFont] = useState('Oswald');
    const [teamLogo, setTeamLogo] = useState(null);
    const [sponsorLogo, setSponsorLogo] = useState(null);
    const [backgroundImage, setBackgroundImage] = useState(null);
    const [bgOffset, setBgOffset] = useState({ x: 0, y: 0 });

    // Custom Text Block State
    const [customText, setCustomText] = useState('');
    const [customTextColor, setCustomTextColor] = useState('#ffffff');
    const [customTextPos, setCustomTextPos] = useState({ pos: [0, -0.05, 0.165], rot: Math.PI, scaleX: 0.12, scaleY: 0.12 });

    const [brandLogoColor, setBrandLogoColor] = useState('blanco');
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
    const [teamLogoPos, setTeamLogoPos] = useState({ pos: [-0.06, 0.08, 0.15], rot: Math.PI, scaleX: 0.07, scaleY: 0.07 });
    // Sponsor: Center, lowered and rotated 180deg to appear upright
    const [sponsorLogoPos, setSponsorLogoPos] = useState({ pos: [0, -0.10, 0.16], rot: Math.PI, scaleX: 0.25, scaleY: 0.25 });
    const [selectedLogo, setSelectedLogo] = useState(null); // 'team' or 'sponsor'

    // Handlers for 3D Decal Updates
    const handleTeamLogoUpdate = (newState) => {
        if (!newState) {
            setTeamLogo(null);
            setSelectedLogo(null);
            // Reset position on delete
            setTeamLogoPos({ pos: [-0.06, 0.08, 0.15], rot: Math.PI, scaleX: 0.07, scaleY: 0.07 });
        } else {
            setTeamLogoPos(prev => ({ ...prev, ...newState }));
        }
    };

    const handleSponsorLogoUpdate = (newState) => {
        if (!newState) {
            setSponsorLogo(null);
            setSelectedLogo(null);
            // Reset position on delete
            setSponsorLogoPos({ pos: [0, -0.10, 0.16], rot: Math.PI, scaleX: 0.25, scaleY: 0.25 });
        } else {
            setSponsorLogoPos(prev => ({ ...prev, ...newState }));
        }
    };

    const handleCustomTextUpdate = (newState) => {
        if (!newState) {
            setCustomText('');
            setSelectedLogo(null);
            setCustomTextPos({ pos: [0, -0.05, 0.165], rot: Math.PI, scaleX: 0.12, scaleY: 0.12 });
        } else {
            setCustomTextPos(prev => ({ ...prev, ...newState }));
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
                if (type === 'background') setBackgroundImage(reader.result);
            };
            reader.readAsDataURL(file);
        }
        // Reset the input value so the same file can be uploaded again after deletion
        e.target.value = '';
    };

    // Keyboard listener for panning background image
    useEffect(() => {
        if (!backgroundImage) return;

        const handleKeyDown = (e) => {
            // Ignore if user is typing in an input
            if (e.target.tagName.toLowerCase() === 'input' || e.target.tagName.toLowerCase() === 'textarea') {
                return;
            }

            const step = 20; // pixels to move per keypress
            switch (e.key) {
                case 'ArrowUp':
                    setBgOffset(prev => ({ ...prev, y: prev.y - step }));
                    e.preventDefault();
                    break;
                case 'ArrowDown':
                    setBgOffset(prev => ({ ...prev, y: prev.y + step }));
                    e.preventDefault();
                    break;
                case 'ArrowLeft':
                    setBgOffset(prev => ({ ...prev, x: prev.x - step }));
                    e.preventDefault();
                    break;
                case 'ArrowRight':
                    setBgOffset(prev => ({ ...prev, x: prev.x + step }));
                    e.preventDefault();
                    break;
                default:
                    break;
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [backgroundImage]);

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
            <header className="designer-header" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '0 20px', position: 'relative' }}>
                <a href="https://ginga.es" target="_blank" rel="noopener noreferrer" className="header-center" style={{ textDecoration: 'none', cursor: 'pointer' }}>
                    <img src="/ginga-logo-header.png" alt="Ginga" className="header-logo" style={{ height: '80px', objectFit: 'contain' }} />
                </a>

                {/* WhatsApp Contact Button */}
                <a
                    href="https://wa.me/34711245855"
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                        position: 'absolute',
                        right: '20px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        background: '#25D366', // WhatsApp green
                        color: '#fff',
                        padding: '10px 20px',
                        borderRadius: '30px',
                        textDecoration: 'none',
                        fontWeight: 'bold',
                        fontSize: '14px',
                        boxShadow: '0 4px 10px rgba(37, 211, 102, 0.3)',
                        transition: 'transform 0.2s'
                    }}
                    onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
                    onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
                    </svg>
                    ¡Contáctanos con tu diseño!
                </a>
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
                                    backgroundImage={backgroundImage}
                                    bgOffset={bgOffset}

                                    // Interactive Decal Props
                                    teamLogoState={teamLogoPos}
                                    sponsorLogoState={sponsorLogoPos}
                                    customTextState={customTextPos}
                                    onTeamLogoUpdate={handleTeamLogoUpdate}
                                    onSponsorLogoUpdate={handleSponsorLogoUpdate}
                                    onCustomTextUpdate={handleCustomTextUpdate}
                                    selectedLogo={selectedLogo}
                                    customText={customText}
                                    customTextColor={customTextColor}
                                    brandLogoColor={brandLogoColor}
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
                                backgroundImage={backgroundImage}
                                bgOffset={bgOffset}
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
                                <h3>Escudos y Logos</h3>

                                <div className="input-item" style={{ marginBottom: '20px' }}>
                                    <label>Color Logo Ginga (Pecho Derecho)</label>
                                    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginTop: '10px' }}>
                                        {GINGA_LOGOS.map(l => (
                                            <button
                                                key={l.name}
                                                onClick={() => setBrandLogoColor(l.name)}
                                                style={{
                                                    width: '32px', height: '32px',
                                                    backgroundImage: `url("${l.path}")`,
                                                    backgroundSize: '80%',
                                                    backgroundPosition: 'center',
                                                    backgroundRepeat: 'no-repeat',
                                                    backgroundColor: l.name === 'blanco' ? '#333' : '#fff',
                                                    border: brandLogoColor === l.name ? '2px solid #39FF14' : '2px solid transparent',
                                                    borderRadius: '6px',
                                                    cursor: 'pointer'
                                                }}
                                                title={l.name}
                                            />
                                        ))}
                                    </div>
                                </div>

                                <div style={{ borderTop: '1px solid var(--border)', paddingTop: '15px' }}>
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
                            </div>
                        )}



                        {/* 4. SECCIÓN TEXTO */}
                        {activeTab === 'text' && (
                            <div className="control-group">
                                <h3>Personalización</h3>
                                <div className="input-item">
                                    <label>Nombre Jugador (Espalda)</label>
                                    <input type="text" value={name} maxLength={10} onChange={(e) => setName(e.target.value)} />
                                </div>
                                <div className="input-item">
                                    <label>Dorsal (Espalda)</label>
                                    <input type="text" value={number} maxLength={2} onChange={(e) => setNumber(e.target.value)} />
                                </div>

                                <div className="input-item" style={{ marginTop: '20px', borderTop: '1px solid var(--border)', paddingTop: '15px' }}>
                                    <label style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        Texto Libre (Frontal)
                                        <span style={{ fontSize: '0.7em', color: '#39FF14' }}>INTERACTIVO</span>
                                    </label>
                                    <div style={{ fontSize: '0.8rem', color: '#aaa', padding: '5px', background: 'rgba(255,255,255,0.05)', borderRadius: '4px', marginBottom: '10px' }}>
                                        Aparecerá en el pecho. Haz clic sobre él en la camiseta para moverlo o escalarlo.
                                    </div>
                                    <input
                                        type="text"
                                        value={customText}
                                        maxLength={getFontCharacterLimit(font)}
                                        placeholder="Escribe algo..."
                                        onChange={(e) => setCustomText(e.target.value)}
                                    />
                                    <div style={{ marginTop: '10px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                                        <label style={{ fontSize: '12px' }}>Color del Texto Libre:</label>
                                        <input type="color" value={customTextColor} onChange={(e) => setCustomTextColor(e.target.value)} />
                                    </div>
                                    {customText && (
                                        <button
                                            onClick={() => handleCustomTextUpdate(null)}
                                            className="delete-item-btn"
                                            style={{
                                                marginTop: '10px',
                                                width: '100%',
                                                padding: '8px',
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
                                                gap: '8px'
                                            }}
                                        >
                                            <Trash2 size={16} /> Eliminar texto
                                        </button>
                                    )}
                                </div>

                                <div className="input-item" style={{ marginTop: '20px', borderTop: '1px solid var(--border)', paddingTop: '15px' }}>
                                    <label>Color general del texto</label>
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


                                            <div style={{ marginTop: '20px' }}>
                                                <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                                                    Color Logo Ginga
                                                </label>
                                                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                                                    {GINGA_LOGOS.map(l => (
                                                        <button
                                                            key={l.name}
                                                            onClick={() => setBrandLogoColor(l.name)}
                                                            style={{
                                                                width: '32px', height: '32px',
                                                                backgroundImage: `url("${l.path}")`,
                                                                backgroundSize: '80%',
                                                                backgroundPosition: 'center',
                                                                backgroundRepeat: 'no-repeat',
                                                                backgroundColor: l.name === 'blanco' ? '#333' : '#fff',
                                                                border: brandLogoColor === l.name ? '2px solid #39FF14' : '2px solid transparent',
                                                                borderRadius: '6px',
                                                                cursor: 'pointer'
                                                            }}
                                                            title={l.name}
                                                        />
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {designTab === 'patterns' && (
                                        <div style={{ padding: '10px' }}>
                                            <div className="upload-item" style={{ marginBottom: '25px', padding: '15px', background: 'rgba(255,255,255,0.05)', borderRadius: '12px' }}>
                                                <h4 style={{ marginBottom: '10px', fontSize: '14px', color: 'var(--text-primary)' }}>Imagen de fondo (textura completa)</h4>
                                                <p style={{ fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '15px' }}>Sube una imagen para cubrir toda la camiseta bajo el diseño.</p>

                                                <div className="upload-zone">
                                                    {backgroundImage ? (
                                                        <div className="upload-preview-container" style={{ marginTop: '10px', textAlign: 'center' }}>
                                                            <img src={backgroundImage} alt="Background" style={{ height: '60px', objectFit: 'cover', borderRadius: '4px' }} />
                                                        </div>
                                                    ) : (
                                                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', opacity: 0.5 }}>
                                                        </div>
                                                    )}
                                                    <input type="file" accept="image/*" onChange={(e) => handleFileUpload(e, 'background')} />
                                                    {!backgroundImage && <span>Click para subir imagen de fondo</span>}
                                                </div>

                                                {backgroundImage && (
                                                    <div style={{ marginTop: '15px' }}>
                                                        <div style={{ fontSize: '11px', color: '#39FF14', background: 'rgba(57, 255, 20, 0.1)', padding: '8px', borderRadius: '6px', textAlign: 'center', marginBottom: '10px' }}>
                                                            <Move size={14} style={{ verticalAlign: 'middle', marginRight: '5px' }} />
                                                            Usa las flechas del teclado (⬅️ ⬆️ ⬇️ ➡️) para mover la imagen de fondo.
                                                        </div>
                                                        <button
                                                            onClick={() => { setBackgroundImage(null); setBgOffset({ x: 0, y: 0 }); }}
                                                            className="delete-item-btn"
                                                            style={{
                                                                width: '100%', padding: '8px', background: 'rgba(255, 68, 68, 0.1)',
                                                                border: '1px solid rgba(255, 68, 68, 0.3)', borderRadius: '8px', color: '#ff4444',
                                                                cursor: 'pointer', fontSize: '12px', fontWeight: 'Bold', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px'
                                                            }}
                                                        >
                                                            <Trash2 size={16} /> Eliminar fondo
                                                        </button>
                                                    </div>
                                                )}
                                            </div>

                                            <h4 style={{ marginBottom: '15px', fontSize: '14px', color: 'var(--text-primary)' }}>Patrones Base</h4>
                                            <div className="pattern-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '25px' }}>
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
