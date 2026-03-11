import React, { useState, useEffect, useRef } from 'react';
import { motion, useDragControls } from 'framer-motion';
import JerseyPreview from './JerseyPreview';
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
            dragControls={dragControls}
            dragListener={false} // Only drag by the handle
            dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }} // Let it be dragged freely but bounded by viewport
            dragElastic={0}
            dragMomentum={false}
            initial={{ opacity: 0, scale: 0.8, y: 50, x: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0, x: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 50 }}
            style={{
                position: 'fixed',
                bottom: '20px',
                right: '20px',
                width: isExpanded ? '200px' : '120px',
                background: 'var(--surface)',
                border: '2px solid var(--border)',
                borderRadius: '12px',
                boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
                zIndex: 1000,
                overflow: 'hidden',
                display: 'flex',
                flexDirection: 'column',
                touchAction: 'none' // Prevent scroll while dragging
            }}
        >
            {/* Header / Drag Handle */}
            <div
                className="mini-preview-header"
                onPointerDown={(e) => dragControls.start(e)}
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '6px 8px',
                    background: 'var(--surface-light)',
                    borderBottom: '1px solid var(--border)',
                    cursor: 'grab',
                    touchAction: 'none'
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

            {/* SVG Content Area */}
            <div style={{ padding: '10px', background: 'var(--bg-layer-1)', flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <div style={{ width: '100%', aspectRatio: '1/1' }}>
                    <JerseyPreview
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
                        view="front"
                    />
                </div>
            </div>
        </motion.div>
    );
};

export default MiniPreview;
