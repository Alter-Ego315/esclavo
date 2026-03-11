import React, { useState } from 'react';
import { motion, useDragControls } from 'framer-motion';
import Jersey3D from './Jersey3D';
import { Maximize2, Minimize2, X, Move } from 'lucide-react';

const MiniPreview = ({
    colors,
    pattern,
    name,
    number,
    font,
    teamLogo,
    sponsorLogo,
    brandLogoColor,
    collar,
    sleeve,
    backgroundImage,
    bgOffset,
    onClose
}) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const dragControls = useDragControls();

    // Convert 3D scene props implicitly passed down if necessary to 2D
    // MiniPreview uses the SVG renderer for performance.

    return (
        <motion.div
            drag
            dragElastic={0.1}
            dragMomentum={false}
            initial={{ opacity: 0, scale: 0.8, y: 50, x: 20, width: 120, height: 160 }}
            animate={{ opacity: 1, scale: 1, y: 0, x: 0, width: isExpanded ? 240 : 120, height: isExpanded ? 320 : 160 }}
            exit={{ opacity: 0, scale: 0.8, y: 50 }}
            style={{
                position: 'fixed',
                bottom: '20px',
                right: '20px',
                background: 'var(--surface)',
                border: '2px solid var(--border)',
                borderRadius: '12px',
                boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
                zIndex: 1000,
                display: 'flex',
                flexDirection: 'column',
                overflow: 'hidden'
            }}
        >
            {/* Header / Drag Handle */}
            <div
                className="mini-preview-header"
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '6px 8px',
                    background: 'var(--surface-light)',
                    borderBottom: '1px solid var(--border)',
                    cursor: 'grab',
                    touchAction: 'none', // Needed for Framer Motion pointer events on mobile
                    userSelect: 'none'
                }}
            >
                <div style={{ display: 'flex', gap: '6px', alignItems: 'center', color: 'var(--text-secondary)' }}>
                    <Move size={14} />
                    <span style={{ fontSize: '11px', fontWeight: 'bold' }}>PREVIEW</span>
                </div>

                <div style={{ display: 'flex', gap: '4px' }}>
                    <button
                        onClick={() => setIsExpanded(!isExpanded)}
                        style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', padding: '2px' }}
                    >
                        {isExpanded ? <Minimize2 size={14} /> : <Maximize2 size={14} />}
                    </button>
                    <button
                        onClick={onClose}
                        style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', padding: '2px' }}
                    >
                        <X size={14} />
                    </button>
                </div>
            </div>

            {/* 3D Content Area */}
            <div style={{ padding: '0px', background: 'var(--bg-layer-1)', flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', position: 'relative' }}>
                <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Jersey3D
                        colors={colors}
                        pattern={pattern}
                        name={name}
                        number={number}
                        font={font}
                        teamLogo={teamLogo}
                        sponsorLogo={sponsorLogo}
                        brandLogoColor={brandLogoColor}
                        collar={collar}
                        sleeve={sleeve}
                        backgroundImage={backgroundImage}
                        bgOffset={bgOffset}
                        viewLocked={true} // Locks rotation zoom on mini view
                        isMini={true}     // Tells Jersey3D not to render duplicate SVGs
                    />

                    {/* Invisible overlay to prevent 3D canvas from stealing touch events so the whole card is draggable */}
                    <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: 10, cursor: 'grab' }} />
                </div>
            </div>
        </motion.div>
    );
};

export default MiniPreview;
