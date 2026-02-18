import React, { useState } from 'react';
import Jersey3D from './Jersey3D';
import JerseyPreview from './JerseyPreview';
import { Palette, Layers, Type, Download, Share2, Sparkles, RotateCw, Check, Image, User, Grip } from 'lucide-react';
import '../styles/JerseyDesigner.css';

const JERSEY_TEMPLATES = [
    {
        id: 'ginga-classic',
        name: 'Ginga Classic',
        colors: { primary: '#0a0a0a', secondary: '#39FF14', accent: '#1a1a1a' },
        pattern: 'splatter',
        font: 'Orbitron'
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

    // Navigation State
    const [activeTab, setActiveTab] = useState('shield'); // shield, neck, sleeves, text, design
    const [designTab, setDesignTab] = useState('templates'); // templates, colors, patterns

    const [view, setView] = useState('front');
    const [show3D, setShow3D] = useState(true);

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
                        />
                    </React.Suspense>
                </section>

                <aside className="controls-section">
                    <nav className="controls-nav">
                        <button className={activeTab === 'shield' ? 'active' : ''} onClick={() => setActiveTab('shield')}>
                            <Image size={20} />
                            <span>ESCUDO</span>
                        </button>
                        <button className={activeTab === 'text' ? 'active' : ''} onClick={() => setActiveTab('text')}>
                            <Type size={20} />
                            <span>TEXTO</span>
                        </button>
                        <button className={activeTab === 'design' ? 'active' : ''} onClick={() => setActiveTab('design')}>
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
                                            <img src={teamLogo} className="upload-preview" alt="team logo" />
                                        ) : (
                                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', opacity: 0.5 }}>
                                            </div>
                                        )}
                                        <input type="file" accept="image/*" onChange={(e) => handleFileUpload(e, 'team')} />
                                        <span>Click para Subir Imagen</span>
                                    </div>
                                </div>
                                <div className="upload-item" style={{ marginTop: '20px' }}>
                                    <label>Patrocinador (Opcional)</label>
                                    <div className="upload-zone">
                                        {sponsorLogo && <img src={sponsorLogo} className="upload-preview" alt="sponsor logo" />}
                                        <input type="file" accept="image/*" onChange={(e) => handleFileUpload(e, 'sponsor')} />
                                        <span>Click para Subir</span>
                                    </div>
                                </div>
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
                                                <label>Color 2 (Secundario)</label>
                                                <input type="color" value={colors.secondary} onChange={(e) => handleColorChange('secondary', e.target.value)} />
                                            </div>
                                            <div className="color-picker-item">
                                                <label>Mangas / Cuello</label>
                                                <input type="color" value={colors.accent} onChange={(e) => handleColorChange('accent', e.target.value)} />
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
                                        <div className="pattern-grid">
                                            {['none', 'stripes', 'hoops', 'diagonal', 'pixels', 'gradient', 'splatter'].map(p => (
                                                <button key={p} className={pattern === p ? 'active' : ''} onClick={() => setPattern(p)}>
                                                    {p.charAt(0).toUpperCase() + p.slice(1)}
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
