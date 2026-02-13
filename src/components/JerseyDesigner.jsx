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
    const [teamLogo, setTeamLogo] = useState('/logo.png'); // Default Ginga Logo
    const [sponsorLogo, setSponsorLogo] = useState(null);

    const [vibrancy, setVibrancy] = useState(50);

    // New Features State
    const [collar, setCollar] = useState('round'); // round, v-neck, polo
    const [sleeve, setSleeve] = useState('normal'); // normal, raglan

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

    const handleExport = () => {
        const svg = document.querySelector(show3D ? '.hidden-previews .body-front-view svg' : '.jersey-preview-container svg');
        if (svg) {
            const svgData = new XMLSerializer().serializeToString(svg);
            const blob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `ginga-jersey-${name || 'style'}.svg`;
            link.click();
        }
    };

    return (
        <div className="jersey-designer-container">
            {/* Header */}
            <header className="designer-header">
                <div className="header-left">
                    <img src="/ginga-logo-header.png" alt="Ginga" className="header-logo" style={{ height: '40px' }} />
                </div>
                <div className="header-actions">
                    <button className="btn-primary" onClick={handleExport}>
                        <Download size={18} />
                        <span>EXPORTAR</span>
                    </button>
                </div>
            </header>

            <main className="designer-layout">
                <section className="preview-section">
                    <React.Suspense fallback={<div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: 'white' }}>Cargando Modelo 3D...</div>}>
                        <Jersey3D
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
                                        {teamLogo && <img src={teamLogo} className="upload-preview" alt="team logo" />}
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
                                    <input type="text" value={name} maxLength={12} onChange={(e) => setName(e.target.value)} />
                                </div>
                                <div className="input-item">
                                    <label>Dorsal</label>
                                    <input type="text" value={number} maxLength={2} onChange={(e) => setNumber(e.target.value)} />
                                </div>
                                <div className="input-item">
                                    <label>Fuente</label>
                                    <select value={font} onChange={(e) => setFont(e.target.value)} className="font-select">
                                        <option value="Orbitron">Orbitron (Tech)</option>
                                        <option value="Impact">Impact (Clásico Bold)</option>
                                        <option value="Goldman">Goldman (Deportivo)</option>
                                        <option value="Roboto Condensed">Roboto Cond (Moderno)</option>
                                        <option value="Courier New">Mono (Retro)</option>
                                        <option value="cursive">Script Dinámico</option>
                                        <option value="Bebas Neue">Bebas Neue (Power)</option>
                                        <option value="Permanent Marker">Marker (Callejero)</option>
                                        <option value="Press Start 2P">8-Bit (Retro)</option>
                                        <option value="Audiowide">Audiowide (Futurista)</option>
                                    </select>
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
                                                <label>Cuerpo Principal</label>
                                                <input type="color" value={colors.primary} onChange={(e) => handleColorChange('primary', e.target.value)} />
                                            </div>
                                            <div className="color-picker-item">
                                                <label>Patrón Secundario</label>
                                                <input type="color" value={colors.secondary} onChange={(e) => handleColorChange('secondary', e.target.value)} />
                                            </div>
                                            <div className="color-picker-item">
                                                <label>Mangas / Detalles</label>
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
                </aside>
            </main>
        </div>
    );
};

export default JerseyDesigner;
