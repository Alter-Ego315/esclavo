import React, { useState } from 'react';
import Jersey3D from './Jersey3D';
import JerseyPreview from './JerseyPreview';
import { Palette, Layers, Type, Download, Settings, Share2, Sparkles, RotateCw, Check } from 'lucide-react';
import '../styles/JerseyDesigner.css';

const BRAND_LOGOS = [
    { id: 'none', name: 'None', url: null },
    {
        id: 'nike',
        name: 'Nike',
        url: 'https://upload.wikimedia.org/wikipedia/commons/a/a6/Logo_NIKE.svg'
    },
    {
        id: 'adidas',
        name: 'Adidas',
        url: 'https://upload.wikimedia.org/wikipedia/commons/2/20/Adidas_Logo.svg'
    },
    {
        id: 'puma',
        name: 'Puma',
        url: 'https://upload.wikimedia.org/wikipedia/commons/8/88/Puma_complete_logo.svg'
    },
    {
        id: 'jordan',
        name: 'Jordan',
        url: 'https://upload.wikimedia.org/wikipedia/en/3/37/Jumpman_logo.svg'
    }
];

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
    { "name": "Black", "hex": "#000000" }, { "name": "White", "hex": "#ffffff" },
    { "name": "Arsenal Red", "hex": "#cf151f" }, { "name": "Arsenal Navy", "hex": "#232e44" },
    { "name": "Chelsea Blue", "hex": "#123e89" }, { "name": "Liverpool Red", "hex": "#b7121d" },
    { "name": "Man City Blue", "hex": "#4ea7f0" }, { "name": "Man Utd Red", "hex": "#ce152d" },
    { "name": "Real Madrid Gold", "hex": "#baa071" }, { "name": "Barcelona Blue", "hex": "#2261b2" },
    { "name": "Barcelona Red", "hex": "#d63c54" }, { "name": "PSG Navy", "hex": "#242e47" },
    { "name": "Juventus Gold", "hex": "#bf9556" }, { "name": "Dortmund Yellow", "hex": "#f1d501" },
    { "name": "Bayern Red", "hex": "#d00a2c" }, { "name": "Inter Blue", "hex": "#2270d7" },
    { "name": "Milan Red", "hex": "#d3222d" }, { "name": "Napoli Blue", "hex": "#308ded" },
    { "name": "Ajax Red", "hex": "#d2122e" }, { "name": "Ginga Green", "hex": "#39FF14" }
];

const JerseyDesigner = () => {
    // Default "Teo 69" State
    const [colors, setColors] = useState({
        primary: '#0a0a0a',
        secondary: '#39FF14',
        accent: '#1a1a1a'
    });
    const [pattern, setPattern] = useState('splatter');
    const [name, setName] = useState('TEO');
    const [number, setNumber] = useState('69');
    const [font, setFont] = useState('Orbitron');
    const [teamLogo, setTeamLogo] = useState('/logo.png'); // Default Ginga Logo
    const [sponsorLogo, setSponsorLogo] = useState(null);
    const [brandLogo, setBrandLogo] = useState(BRAND_LOGOS[1].url); // Default Nike
    const [vibrancy, setVibrancy] = useState(50);
    const [activeTab, setActiveTab] = useState('templates');
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
                if (type === 'brand') setBrandLogo(reader.result);
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
        <div className="designer-container">
            <header className="app-header">
                <div className="header-logo">
                    <img src="/logo.png" alt="Ginga" className="mini-logo" />
                    <span>GINGA <small>PRO STUDIO</small></span>
                </div>
                <div className="header-actions">
                    <button className="btn-icon" title="Flip Jersey" onClick={() => setView(view === 'front' ? 'back' : 'front')}>
                        <RotateCw size={18} />
                    </button>
                    <button className="btn-primary" onClick={handleExport}>
                        <Download size={18} />
                        <span>EXPORT</span>
                    </button>
                </div>
            </header>

            <main className="designer-layout">
                <section className="preview-section">
                    <Jersey3D
                        colors={colors}
                        pattern={pattern}
                        name={name}
                        number={number}
                        font={font}
                        teamLogo={teamLogo}
                        sponsorLogo={sponsorLogo}
                        brandLogo={brandLogo}
                        vibrancy={vibrancy}
                        view={view}
                    />

                    <div className="view-indicator">
                        <button className="flip-btn" onClick={() => setView(view === 'front' ? 'back' : 'front')}>
                            <RotateCw size={14} style={{ marginRight: '8px' }} />
                            GIRAR CAMISETA ({view === 'front' ? 'VER ESPALDA' : 'VER FRONTAL'})
                        </button>
                    </div>
                </section>

                <aside className="controls-section">
                    <nav className="controls-nav">
                        <button className={activeTab === 'templates' ? 'active' : ''} onClick={() => setActiveTab('templates')}>
                            <Sparkles size={20} />
                            <span>TEMPLATES</span>
                        </button>
                        <button className={activeTab === 'colors' ? 'active' : ''} onClick={() => setActiveTab('colors')}>
                            <Palette size={20} />
                            <span>COLORES</span>
                        </button>
                        <button className={activeTab === 'patterns' ? 'active' : ''} onClick={() => setActiveTab('patterns')}>
                            <Layers size={20} />
                            <span>PATRONES</span>
                        </button>
                        <button className={activeTab === 'text' ? 'active' : ''} onClick={() => setActiveTab('text')}>
                            <Type size={20} />
                            <span>TEXTO</span>
                        </button>
                        <button className={activeTab === 'logos' ? 'active' : ''} onClick={() => setActiveTab('logos')}>
                            <Share2 size={20} />
                            <span>LOGOS</span>
                        </button>
                    </nav>

                    <div className="controls-content">
                        {activeTab === 'templates' && (
                            <div className="control-group">
                                <h3>Pro Designs</h3>
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
                            </div>
                        )}

                        {activeTab === 'colors' && (
                            <div className="control-group">
                                <h3>Palette & Depth</h3>
                                <div className="color-picker-item">
                                    <label>Primary Body</label>
                                    <input type="color" value={colors.primary} onChange={(e) => handleColorChange('primary', e.target.value)} />
                                </div>
                                <div className="color-picker-item">
                                    <label>Secondary Pattern</label>
                                    <input type="color" value={colors.secondary} onChange={(e) => handleColorChange('secondary', e.target.value)} />
                                </div>
                                <div className="color-picker-item">
                                    <label>Raglan Sleeves</label>
                                    <input type="color" value={colors.accent} onChange={(e) => handleColorChange('accent', e.target.value)} />
                                </div>

                                <div className="vibrancy-control" style={{ marginTop: '20px' }}>
                                    <label style={{ display: 'block', fontSize: '0.8rem', color: 'rgba(255,255,255,0.6)', marginBottom: '8px' }}>
                                        NIVEL DE VIBRACIÓN (COLOR PUNCH)
                                    </label>
                                    <input type="range"
                                        min="0"
                                        max="100"
                                        value={vibrancy}
                                        onChange={(e) => setVibrancy(parseInt(e.target.value))}
                                        style={{ width: '100%', accentColor: 'var(--primary)' }}
                                    />
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

                        {activeTab === 'patterns' && (
                            <div className="control-group">
                                <h3>Style Patterns</h3>
                                <div className="pattern-grid">
                                    {['none', 'stripes', 'hoops', 'diagonal', 'pixels', 'gradient', 'splatter'].map(p => (
                                        <button key={p} className={pattern === p ? 'active' : ''} onClick={() => setPattern(p)}>
                                            {p.charAt(0).toUpperCase() + p.slice(1)}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {activeTab === 'text' && (
                            <div className="control-group">
                                <h3>Typography</h3>
                                <div className="input-item">
                                    <label>Player Name</label>
                                    <input type="text" value={name} maxLength={12} onChange={(e) => setName(e.target.value)} />
                                </div>
                                <div className="input-item">
                                    <label>Squad Number</label>
                                    <input type="text" value={number} maxLength={2} onChange={(e) => setNumber(e.target.value)} />
                                </div>
                                <div className="input-item">
                                    <label>Font Family</label>
                                    <select value={font} onChange={(e) => setFont(e.target.value)} className="font-select">
                                        <option value="Orbitron">Orbitron (Tech)</option>
                                        <option value="Impact">Impact (Classic Bold)</option>
                                        <option value="Goldman">Goldman (Sporty)</option>
                                        <option value="Roboto Condensed">Roboto Cond (Modern)</option>
                                        <option value="Courier New">Mono (Retro)</option>
                                        <option value="cursive">Dynamic Script</option>
                                        <option value="Bebas Neue">Bebas Neue (Power)</option>
                                        <option value="Permanent Marker">Marker (Street)</option>
                                        <option value="Press Start 2P">8-Bit (Retro)</option>
                                        <option value="Audiowide">Audiowide (Futuristic)</option>
                                    </select>
                                </div>
                            </div>
                        )}

                        {activeTab === 'logos' && (
                            <div className="control-group">
                                <h3>Identity & Brand</h3>

                                <label className="sub-label">Brand Apparel</label>
                                <div className="brand-grid">
                                    {BRAND_LOGOS.map(brand => (
                                        <button
                                            key={brand.id}
                                            className={`brand-btn ${brandLogo === brand.url ? 'active' : ''}`}
                                            onClick={() => setBrandLogo(brand.url)}
                                        >
                                            {brand.name}
                                            {brandLogo === brand.url && <Check size={14} className="check-icon" />}
                                        </button>
                                    ))}
                                </div>

                                <div className="upload-item" style={{ marginTop: '24px' }}>
                                    <label>Team Crest</label>
                                    <div className="upload-zone">
                                        {teamLogo && <img src={teamLogo} className="upload-preview" alt="team logo" />}
                                        <input type="file" accept="image/*" onChange={(e) => handleFileUpload(e, 'team')} />
                                        <span>Click to Upload</span>
                                    </div>
                                </div>

                                <div className="upload-item" style={{ marginTop: '20px' }}>
                                    <label>Main Sponsor</label>
                                    <div className="upload-zone">
                                        {sponsorLogo && <img src={sponsorLogo} className="upload-preview" alt="sponsor logo" />}
                                        <input type="file" accept="image/*" onChange={(e) => handleFileUpload(e, 'sponsor')} />
                                        <span>Click to Upload</span>
                                    </div>
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
