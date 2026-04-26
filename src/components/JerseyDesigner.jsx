import React, { useState, useEffect, useRef } from 'react';
import Jersey3D from './Jersey3D';
import JerseyPreview from './JerseyPreview';
import { ChevronRight, ChevronLeft, Upload, Shirt, RotateCcw, Share2, Download, Eye, Layers, Type, Palette, Scissors, Binary, Grip, RotateCw, Image, ArrowLeftRight, Move, Check, Trash2, Save, Info } from 'lucide-react';
import PatternThumbnail3D from './PatternThumbnail3D';
import { Canvas } from '@react-three/fiber';
import { View } from '@react-three/drei';
import '../styles/JerseyDesigner.css';

const PATTERNS_LIST = [
    { id: 'none', label: 'Ninguno' },
    { id: 'chevron', label: 'Norvehc' },
    { id: 'norvehc', label: 'Chevron' },
    { id: 'zigzag', label: 'Zig zag' },
    { id: 'halftone-lines', label: 'Líneas' },
    { id: 'stripes', label: 'Rayas verticales' },
    { id: 'hoops', label: 'Rayas horizontales' },
    { id: 'diagonal', label: 'Diagonal' },
    { id: 'hexagons', label: 'Hexágonos' },
    { id: 'gradient', label: 'Degradado' },
    { id: 'checkers', label: 'Ajedrez' },
    { id: 'cross', label: 'Cruz' },
    { id: 'cross-offset', label: 'Cruz nórdica' },
    { id: 'diamonds', label: 'Rombos' },
    { id: 'triangles', label: 'Triángulos' },
    { id: 'camo', label: 'Camuflaje' },
    { id: 'arches', label: 'Arcos' },
    { id: 'star', label: 'Estrella' },
    { id: 'pixels', label: 'Pixelado' },
    { id: 'center-stripe', label: 'Franja central' },
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
    { name: 'Algerian', label: 'ALGERIAN' },
    { name: 'Blowbrush', label: 'Blowbrush' },
    { name: 'Eras ITC Demi', label: 'Eras ITC Demi' },
    { name: 'Ethnocentric', label: 'Ethnocentric' },
    { name: 'Real Madrid 2009', label: 'Real Madrid 09' },
    { name: 'Real Madrid 19-20', label: 'Real Madrid 19-20' },
    { name: 'Real Madrid UCL 2021', label: 'Real Madrid UCL 21' },
    { name: 'Real Madrid 2022', label: 'Real Madrid 22' },
];

export const FONT_OPTIONS = RAW_FONT_OPTIONS.sort((a, b) => a.label.localeCompare(b.label));

// Width heuristic: Oswald is condensed, others use default limit
const getFontCharacterLimit = (fontName) => {
    if (fontName === 'Oswald') return 22; // condensed
    return 15; // default for all local fonts
};
// Helper component for pattern thumbnails with 3D effect
const PatternThumbnail = ({ pattern, color1, color2 }) => {
    const shirtBodyPath = "M50,15 L30,22 L10,35 L15,55 L25,48 L25,95 L75,95 L75,48 L85,55 L90,35 L70,22 Z";
    const containerRef = useRef();

    return (
        <div ref={containerRef} style={{ width: '100%', height: '140px', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', overflow: 'hidden' }}>
            <svg id={`svg-pattern-${pattern}`} viewBox="0 0 100 100" width="100" height="100" style={{ position: 'absolute', top: '-1000px', left: '-1000px', pointerEvents: 'none' }}>
                <defs>
                    <clipPath id={`shirt-clip-${pattern}`}>
                        <path d={shirtBodyPath} />
                    </clipPath>
                    <linearGradient id={`gradSoftThumb-${pattern}`} x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stopColor={color1} />
                        <stop offset="100%" stopColor={color2} />
                    </linearGradient>
                    <linearGradient id={`gradMultiThumb-${pattern}`} x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stopColor={color1} />
                        <stop offset="50%" stopColor="#fff" />
                        <stop offset="100%" stopColor={color2} />
                    </linearGradient>
                    <linearGradient id={`gradSteppedThumb-${pattern}`} x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stopColor={color1} />
                        <stop offset="50%" stopColor={color1} />
                        <stop offset="50%" stopColor={color2} />
                        <stop offset="100%" stopColor={color2} />
                    </linearGradient>
                </defs>
                <rect width="100" height="100" fill={color1} />
                <g clipPath={`url(#shirt-clip-${pattern})`}>
                    {pattern === 'gradient' && <rect width="100" height="100" fill={`url(#gradSoftThumb-${pattern})`} />}
                    {pattern === 'gradient-multi' && <rect width="100" height="100" fill={`url(#gradMultiThumb-${pattern})`} />}
                    {pattern === 'stepped-gradient' && <rect width="100" height="100" fill={`url(#gradSteppedThumb-${pattern})`} />}
                    {pattern === 'hexagons' && (
                        <pattern id={`hexagons-thumb-${pattern}`} width="34.641" height="60" patternUnits="userSpaceOnUse" patternTransform="scale(0.08)">
                            <g fill="none" stroke={color2} strokeWidth="4">
                                {[[0, 0], [34.641, 0], [17.3205, 30]].map(([cx, cy], i) => (
                                    <polyline key={i} points={`${cx + 17.3205},${cy - 10} ${cx + 17.3205},${cy + 10} ${cx},${cy + 20} ${cx - 17.3205},${cy + 10} ${cx - 17.3205},${cy - 10}`} />
                                ))}
                            </g>
                        </pattern>
                    )}
                    {pattern === 'hexagons' && <rect width="100" height="100" fill={`url(#hexagons-thumb-${pattern})`} />}
                    {pattern === 'checkers' && (
                        <pattern id={`checkers-thumb-${pattern}`} width="20" height="20" patternUnits="userSpaceOnUse">
                            <rect width="10" height="10" fill={color2} />
                            <rect x="10" y="10" width="10" height="10" fill={color2} />
                        </pattern>
                    )}
                    {pattern === 'checkers' && <rect width="100" height="100" fill={`url(#checkers-thumb-${pattern})`} />}
                    {pattern === 'halftone-lines' && [10, 20, 30, 40, 50, 60, 70, 80, 90].map(y => <rect key={y} y={y} width="100" height="4" fill={color2} opacity={1 - y / 100} />)}
                    {pattern === 'halftone-dots' && [10, 30, 50, 70, 90].map(y => [10, 30, 50, 70, 90].map(x => <circle key={`${x}-${y}`} cx={x} cy={y} r={4 * (1 - y / 100)} fill={color2} />))}
                    {pattern === 'zigzag' && <path d="M0,20 L25,40 L50,20 L75,40 L100,20 M0,50 L25,70 L50,50 L75,70 L100,50" stroke={color2} strokeWidth="4" fill="none" />}
                    {pattern === 'ocean-waves' && Array.from({ length: 6 }).map((_, i) => <path key={i} d={`M0,${i * 15 + 10} Q25,${i * 15} 50,${i * 15 + 10} T100,${i * 15 + 10}`} stroke={color2} strokeWidth="2" fill="none" />)}
                    {pattern === 'cross' && <g fill={color2}><rect x="42" width="16" height="100" /><rect y="42" width="100" height="16" /></g>}
                    {pattern === 'cross-offset' && <g fill={color2}><rect x="30" width="16" height="100" /><rect y="42" width="100" height="16" /></g>}
                    {pattern === 'stripes' && <g fill={color2}><rect x="20" width="15" height="100" /><rect x="65" width="15" height="100" /></g>}
                    {pattern === 'hoops' && <g fill={color2}><rect y="30" width="100" height="15" /><rect y="65" width="100" height="15" /></g>}
                    {pattern === 'diagonal' && <path d="M-20,120 L120,-20" stroke={color2} strokeWidth="20" />}
                    {pattern === 'diamonds' && (
                        <pattern id={`diamonds-thumb-${pattern}`} width="30" height="30" patternUnits="userSpaceOnUse">
                            <rect x="15" width="15" height="15" transform="rotate(45 15 0)" fill={color2} />
                        </pattern>
                    )}
                    {pattern === 'diamonds' && <rect width="100" height="100" fill={`url(#diamonds-thumb-${pattern})`} />}
                    {pattern === 'chevron' && <path d="M0,70 L50,40 L100,70 M0,100 L50,70 L100,100" stroke={color2} strokeWidth="12" fill="none" />}
                    {pattern === 'norvehc' && <path d="M0,40 L50,70 L100,40 M0,70 L50,100 L100,70" stroke={color2} strokeWidth="12" fill="none" />}
                    {pattern === 'center-stripe' && <rect x="40" width="20" height="100" fill={color2} />}
                    {pattern === 'sash' && <path d="M0,0 L25,0 L100,75 L100,100 L75,100 L0,25 Z" fill={color2} />}
                    {pattern === 'double-stripe' && <g fill={color2}><rect x="35" width="8" height="100" /><rect x="57" width="8" height="100" /></g>}
                    {pattern === 'pixels' && <g fill={color2} opacity={0.7}><rect x="10" y="10" width="10" height="10" /><rect x="30" y="30" width="10" height="10" /><rect x="50" y="10" width="10" height="10" /><rect x="70" y="50" width="10" height="10" /></g>}
                    {pattern === 'triangles' && <path d="M10,10 L25,10 L17.5,25 Z M30,10 L45,10 L37.5,25 Z" fill={color2} />}
                    {pattern === 'camo' && <g fill={color2} opacity={0.4}><circle cx="25" cy="25" r="18" /><circle cx="65" cy="35" r="22" /><circle cx="45" cy="70" r="25" /></g>}
                    {pattern === 'arches' && <g stroke={color2} strokeWidth="4" fill="none"><circle cx="50" cy="100" r="40" /><circle cx="50" cy="100" r="25" /></g>}
                    {pattern === 'star' && <polygon points="50,15 61,35 85,35 66,50 75,75 50,60 25,75 34,50 15,35 39,35" fill={color2} />}
                    {pattern === 'hoops-thin' && Array.from({ length: 15 }).map((_, i) => <rect key={i} y={i * 7} width="100" height="2" fill={color2} />)}
                </g>
            </svg>

            {/* Real 3D Thumbnail Rendered via View */}
            <PatternThumbnail3D
                pattern={pattern}
                color1={color1}
                color2={color2}
                trackRef={containerRef}
            />
        </div>
    );
};

const ExportWarningModal = ({ onConfirm, onCancel, mode = 'export' }) => (
    <div className="modal-overlay" style={{
        position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
        background: 'rgba(0,0,0,0.85)', display: 'flex', alignItems: 'center',
        justifyContent: 'center', zIndex: 9999, backdropFilter: 'blur(8px)',
        padding: '20px'
    }}>
        <div className="modal-content" style={{
            background: 'var(--surface)', border: '1px solid var(--border)',
            padding: '40px', borderRadius: '32px', maxWidth: '500px', width: '100%',
            textAlign: 'center', boxShadow: '0 30px 60px rgba(0,0,0,0.6)',
            color: 'var(--text-primary)', position: 'relative',
            overflow: 'hidden'
        }}>
            {/* Subtle Gradient Background Effect for Premium Look */}
            <div style={{
                position: 'absolute', top: '-50%', left: '-50%', width: '200%', height: '200%',
                background: 'radial-gradient(circle, rgba(57, 255, 20, 0.05) 0%, transparent 70%)',
                pointerEvents: 'none', zIndex: 0
            }}></div>

            <div style={{ position: 'relative', zIndex: 1 }}>
                <h2 style={{ color: '#39FF14', marginBottom: '24px', fontSize: '28px', fontWeight: '900', letterSpacing: '3px' }}>
                    {mode === 'export' ? '¡ATENCIÓN!' : 'INFORMACIÓN'}
                </h2>
                <p style={{ lineHeight: '1.8', marginBottom: '32px', fontSize: '18px', color: 'var(--text-secondary)', fontWeight: '500' }}>
                    Si ya has terminado con tu diseño o si quieres añadir algún detalle más, <a href="https://wa.me/34711245855" target="_blank" rel="noopener noreferrer" style={{ color: '#00ff00', textDecoration: 'underline', fontWeight: 'bold' }}>escríbenos al WhatsApp</a> con tus ideas para que tu diseño sea 100% personalizado.
                </p>

                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
                    <button
                        className="btn-primary"
                        onClick={onConfirm}
                        style={{
                            width: 'auto', minWidth: '220px', padding: '18px 40px', fontSize: '16px',
                            fontWeight: 'bold', letterSpacing: '2px', cursor: 'pointer',
                            borderRadius: '16px', border: 'none', boxShadow: '0 10px 20px rgba(57, 255, 20, 0.2)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center'
                        }}
                    >
                        {mode === 'export' ? 'ENTENDIDO' : 'ACEPTAR'}
                    </button>
                    {mode === 'export' && (
                        <button
                            onClick={onCancel}
                            style={{
                                background: 'transparent', border: 'none', color: 'var(--text-dim)',
                                cursor: 'pointer', fontSize: '14px', fontWeight: '600',
                                opacity: 0.7, padding: '10px'
                            }}
                        >
                            Cancelar
                        </button>
                    )}
                </div>
            </div>
        </div>
    </div>
);

const JerseyDesigner = () => {
    // Keys for localStorage
    const STORAGE_KEY = 'ginga_designer_state';

    // 1. Definitively load state from localStorage or use defaults
    const getInitialState = (key, defaultValue) => {
        try {
            const saved = localStorage.getItem(STORAGE_KEY);
            if (saved) {
                const parsed = JSON.parse(saved);
                return parsed[key] !== undefined ? parsed[key] : defaultValue;
            }
        } catch (e) {
            console.error("Error loading state from localStorage", e);
        }
        return defaultValue;
    };

    // Default "Blank White" State with initialization logic
    const [colors, setColors] = useState(() => getInitialState('colors', {
        primary: '#ffffff',
        secondary: '#000000',
        accent: '#ffffff',
        textColor: '#000000',
        sleeves: '#ffffff',
        collar: '#ffffff'
    }));
    const [pattern, setPattern] = useState(() => getInitialState('pattern', 'none'));
    const [name, setName] = useState(() => getInitialState('name', 'TEO'));
    const [number, setNumber] = useState(() => getInitialState('number', '69'));
    const [font, setFont] = useState(() => getInitialState('font', 'Oswald'));
    const [teamLogo, setTeamLogo] = useState(() => getInitialState('teamLogo', null));
    const [sponsorLogo, setSponsorLogo] = useState(() => getInitialState('sponsorLogo', null));
    const [backgroundImage, setBackgroundImage] = useState(() => getInitialState('backgroundImage', null));
    const [bgOffset, setBgOffset] = useState(() => getInitialState('bgOffset', { x: 0, y: 0 }));

    // Custom Text Block State
    const [customText, setCustomText] = useState(() => getInitialState('customText', ''));
    const [customTextColor, setCustomTextColor] = useState(() => getInitialState('customTextColor', '#000000'));
    const [customTextPos, setCustomTextPos] = useState(() => getInitialState('customTextPos', { pos: [0, -0.05, 0.165], rot: Math.PI, scaleX: 0.12, scaleY: 0.12 }));

    const [brandLogoColor, setBrandLogoColor] = useState(() => getInitialState('brandLogoColor', 'verde'));
    const [vibrancy, setVibrancy] = useState(() => getInitialState('vibrancy', 50));

    // New Features State
    const [collar, setCollar] = useState(() => getInitialState('collar', 'round'));
    const [sleeve, setSleeve] = useState(() => getInitialState('sleeve', 'normal'));
    const [showFontDropdown, setShowFontDropdown] = useState(false);
    const [showExportModal, setShowExportModal] = useState(false);
    const [showInfoModal, setShowInfoModal] = useState(false);
    const [saveStatus, setSaveStatus] = useState(null); // 'saving', 'saved', null

    // Crest (Escudo): Positioned to match the SVG placement x=-170, and aligned Y with Ginga logo
    const [teamLogoPos, setTeamLogoPos] = useState(() => getInitialState('teamLogoPos', { pos: [0.06, 0.08, 0.15], rot: Math.PI, scaleX: 0.07, scaleY: 0.07 }));
    const [sponsorLogoPos, setSponsorLogoPos] = useState(() => getInitialState('sponsorLogoPos', { pos: [0, -0.10, 0.16], rot: Math.PI, scaleX: 0.25, scaleY: 0.25 }));

    // 2. Auto-save Effect
    useEffect(() => {
        const stateToSave = {
            colors, pattern, name, number, font, teamLogo, sponsorLogo,
            backgroundImage, bgOffset, customText, customTextColor, customTextPos,
            brandLogoColor, vibrancy, collar, sleeve, teamLogoPos, sponsorLogoPos
        };

        const timer = setTimeout(() => {
            try {
                localStorage.setItem(STORAGE_KEY, JSON.stringify(stateToSave));
            } catch (e) {
                // If it's a quota exceeded error (likely due to base64 images), try to save without images at least
                if (e.name === 'QuotaExceededError') {
                    localStorage.setItem(STORAGE_KEY, JSON.stringify({ ...stateToSave, teamLogo: null, sponsorLogo: null, backgroundImage: null }));
                }
            }
        }, 1000); // 1 second debounce

        return () => clearTimeout(timer);
    }, [colors, pattern, name, number, font, teamLogo, sponsorLogo, backgroundImage, bgOffset, customText, customTextColor, customTextPos, brandLogoColor, vibrancy, collar, sleeve, teamLogoPos, sponsorLogoPos]);

    const handleManualSave = () => {
        const stateToSave = {
            colors, pattern, name, number, font, teamLogo, sponsorLogo,
            backgroundImage, bgOffset, customText, customTextColor, customTextPos,
            brandLogoColor, vibrancy, collar, sleeve, teamLogoPos, sponsorLogoPos
        };
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(stateToSave));
            setSaveStatus('saved');
            setTimeout(() => setSaveStatus(null), 3000);
        } catch (e) {
            console.error("Error saving design", e);
            setSaveStatus('error');
            setTimeout(() => setSaveStatus(null), 3000);
        }
    };

    const handleReset = () => {
        if (window.confirm('¿Estás seguro de que quieres borrar el diseño actual?')) {
            localStorage.removeItem(STORAGE_KEY);
            window.location.reload();
        }
    };

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
    const [designTab, setDesignTab] = useState('patterns'); // colors, patterns

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




    const handleExport = () => {
        setShowExportModal(true);
    };

    const triggerExport = async () => {
        setShowExportModal(false);
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
                    href="https://wa.me/34711245855?text=Hola%20Ginga%2C%20tenemos%20esta%20idea%20para%20el%20dise%C3%B1o%20de%20nuestras%20camisetas%3A"
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

                                <div style={{
                                    position: 'absolute', top: '20px', left: '20px', zIndex: 10,
                                    display: 'flex', gap: '10px'
                                }}>
                                    <button
                                        onClick={() => setShowInfoModal(true)}
                                        style={{
                                            width: '46px', height: '46px', borderRadius: '14px',
                                            padding: 0,
                                            background: 'rgba(57, 255, 20, 0.1)',
                                            border: '1px solid rgba(57, 255, 20, 0.4)',
                                            color: '#39FF14', display: 'flex', alignItems: 'center', justifyContent: 'center',
                                            cursor: 'pointer', transition: 'all 0.3s ease',
                                            backdropFilter: 'blur(12px)',
                                            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
                                        }}
                                        className="premium-info-btn"
                                        title="Información"
                                    >
                                        <Info size={24} strokeWidth={2.5} />
                                    </button>
                                </div>

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

                    {/* Controles para mover patrón (mobile & PC) */}
                    {backgroundImage && (
                        <div className="pattern-move-controls" style={{
                            position: 'absolute',
                            bottom: '80px',
                            left: '50%',
                            transform: 'translateX(-50%)',
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            gap: '10px',
                            padding: '10px 14px',
                            background: 'rgba(0, 0, 0, 0.6)',
                            backdropFilter: 'blur(5px)',
                            border: '1px solid rgba(255, 255, 255, 0.1)',
                            borderRadius: '16px',
                            zIndex: 20
                        }}>
                            <span style={{ fontSize: '13px', color: '#fff', fontWeight: '500' }}>
                                Mover patrón:
                            </span>
                            <div style={{ display: 'flex', gap: '8px' }}>
                                <button title="Izquierda" onClick={() => setBgOffset(prev => ({ ...prev, x: prev.x - 20 }))} style={{ padding: '8px 12px', cursor: 'pointer', borderRadius: '6px', border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.05)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>⬅️</button>
                                <button title="Arriba" onClick={() => setBgOffset(prev => ({ ...prev, y: prev.y - 20 }))} style={{ padding: '8px 12px', cursor: 'pointer', borderRadius: '6px', border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.05)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>⬆️</button>
                                <button title="Abajo" onClick={() => setBgOffset(prev => ({ ...prev, y: prev.y + 20 }))} style={{ padding: '8px 12px', cursor: 'pointer', borderRadius: '6px', border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.05)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>⬇️</button>
                                <button title="Derecha" onClick={() => setBgOffset(prev => ({ ...prev, x: prev.x + 20 }))} style={{ padding: '8px 12px', cursor: 'pointer', borderRadius: '6px', border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.05)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>➡️</button>
                            </div>
                        </div>
                    )}
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
                                <h3>TEXTO</h3>
                                <div className="input-item">
                                    <label>Nombre Jugador (Espalda)</label>
                                    <input type="text" value={name} maxLength={10} onChange={(e) => setName(e.target.value)} />
                                </div>
                                <div className="input-item">
                                    <label>Dorsal (Espalda)</label>
                                    <input
                                        type="text"
                                        value={number}
                                        maxLength={2}
                                        onChange={(e) => setNumber(e.target.value.replace(/\D/g, ''))}
                                    />
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
                                    <button className={designTab === 'colors' ? 'active' : ''} onClick={() => setDesignTab('colors')}>Colores</button>
                                    <button className={designTab === 'patterns' ? 'active' : ''} onClick={() => setDesignTab('patterns')}>Patrones</button>
                                </div>

                                <div className="sub-content">
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
                                            <div className="color-picker-item">
                                                <label>Color de las mangas</label>
                                                <input type="color" value={colors.sleeves} onChange={(e) => handleColorChange('sleeves', e.target.value)} />
                                            </div>
                                            <div className="color-picker-item">
                                                <label>Color del cuello</label>
                                                <input type="color" value={colors.collar} onChange={(e) => handleColorChange('collar', e.target.value)} />
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

                                            <h4 style={{ marginBottom: '15px', fontSize: '14px', color: 'var(--text-primary)' }}>Patrones base</h4>
                                            <div className="pattern-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '25px', position: 'relative' }}>
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
                                                            background: 'rgba(255, 255, 255, 0.03)',
                                                            border: pattern === p.id ? '2px solid var(--accent)' : '1px solid var(--border)',
                                                            borderRadius: '16px',
                                                            cursor: 'pointer',
                                                            transition: 'all 0.2s',
                                                            minHeight: '180px',
                                                            justifyContent: 'space-between',
                                                            overflow: 'hidden',
                                                            position: 'relative'
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
                    <div className="controls-footer" style={{
                        padding: '20px', borderTop: '1px solid var(--border)', background: 'var(--surface)',
                        display: 'flex', flexDirection: 'column', gap: '15px'
                    }}>
                        <div style={{ display: 'flex', gap: '10px' }}>
                            <button
                                onClick={handleManualSave}
                                className="btn-secondary"
                                disabled={saveStatus === 'saving'}
                                style={{
                                    flex: 1, height: '40px', fontSize: '12px', padding: '0 15px',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px',
                                    background: 'rgba(255,255,255,0.05)', borderRadius: '8px', border: '1px solid var(--border)',
                                    color: 'var(--text-primary)', cursor: 'pointer'
                                }}
                            >
                                <Save size={14} />
                                {saveStatus === 'saving' ? 'Guardando...' : (saveStatus === 'saved' ? '¡Guardado!' : 'Guardar diseño')}
                            </button>
                            <button
                                onClick={handleReset}
                                className="btn-secondary"
                                style={{
                                    height: '40px', fontSize: '12px', padding: '0 15px',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px',
                                    background: 'rgba(255, 68, 68, 0.05)', borderRadius: '8px', border: '1px solid rgba(255, 68, 68, 0.1)',
                                    color: '#ff4444', cursor: 'pointer'
                                }}
                            >
                                <RotateCcw size={14} />
                                Reiniciar
                            </button>
                        </div>

                        <button className="btn-primary" onClick={handleExport} style={{ width: '100%', justifyContent: 'center', padding: '16px' }}>
                            <Download size={20} />
                            <span style={{ fontSize: '16px', letterSpacing: '1px' }}>EXPORTAR DISEÑO</span>
                        </button>
                    </div>
                </aside>
            </main>

            {showExportModal && (
                <ExportWarningModal
                    mode="export"
                    onConfirm={triggerExport}
                    onCancel={() => setShowExportModal(false)}
                />
            )}

            {showInfoModal && (
                <ExportWarningModal
                    mode="info"
                    onConfirm={() => setShowInfoModal(false)}
                    onCancel={() => setShowInfoModal(false)}
                />
            )}
            {/* Global Shared Canvas for 3D Thumbnails (renders via View.Port) */}
            <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', pointerEvents: 'none', zIndex: 10 }}>
                <Canvas eventSource={document.body} gl={{ antialias: false, powerPreference: "high-performance" }}>
                    <Environment preset="city" />
                    <ambientLight intensity={1.0} />
                    <pointLight position={[5, 10, 5]} intensity={2.0} />
                    <View.Port />
                </Canvas>
            </div>
        </div>
    );
};

export default JerseyDesigner;
