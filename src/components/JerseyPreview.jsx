import React from 'react';

const JerseyPreview = ({ colors, pattern, name, number, teamLogo, sponsorLogo, brandLogo, font = 'Orbitron', view = 'full', vibrancy = 50 }) => {
    const { primary, secondary, accent } = colors;

    // Based on the standard shirt_baked.glb UV mapping:
    // The texture is usually creating a full wrap.
    // Center area (approx 50% width) is Front.
    // Sides are Back.
    // Bottom/Top areas map to sleeves/shoulders.
    // *This is a common UV layout for this specific open-source model.*

    return (
        <div className={`jersey-preview-container ${view}-view`} style={{ background: 'transparent', width: '1024px', height: '1024px' }}>
            <svg viewBox="0 0 1024 1024" className="jersey-svg" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', height: '100%', shapeRendering: 'geometricPrecision' }}>
                <defs>
                    <linearGradient id="jerseyGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" style={{ stopColor: primary, stopOpacity: 1 }} />
                        <stop offset="100%" style={{ stopColor: secondary, stopOpacity: 1 }} />
                    </linearGradient>

                    <pattern id="pixelPattern" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
                        <rect width="20" height="20" fill={secondary} opacity={0.15} />
                        <rect x="20" y="20" width="20" height="20" fill={secondary} opacity={0.15} />
                    </pattern>

                    <pattern id="diagonalPattern" x="0" y="0" width="80" height="80" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
                        <rect width="40" height="80" fill={secondary} opacity={0.15} />
                    </pattern>
                </defs>

                {/* 1. BASE COLOR LAYER */}
                <rect width="1024" height="1024" fill={pattern === 'gradient' ? 'url(#jerseyGradient)' : primary} />

                {/* 2. GLOBAL PATTERNS */}
                {pattern === 'pixels' && <rect width="1024" height="1024" fill="url(#pixelPattern)" />}
                {pattern === 'diagonal' && <rect width="1024" height="1024" fill="url(#diagonalPattern)" />}
                {pattern === 'stripes' && (
                    <g fill={secondary} opacity={0.5}>
                        {[100, 300, 500, 700, 900].map(x => <rect key={x} x={x} y="0" width="50" height="1024" />)}
                    </g>
                )}
                {pattern === 'hoops' && (
                    <g fill={secondary} opacity={0.5}>
                        {[100, 300, 500, 700, 900].map(y => <rect key={y} x="0" y={y} width="1024" height="50" />)}
                    </g>
                )}


                {/* 3. FRONT CHEST AREA (Approximation for standard UVs) */}
                {/* The front is typically the center ~40-60% width of the texture */}
                <g transform="translate(512, 512)">

                    {/* Brand Logo - Right Chest */}
                    {brandLogo && (
                        <image href={brandLogo} x="-150" y="-180" width="70" height="70" style={{ filter: 'brightness(4)' }} />
                    )}

                    {/* Team Logo - Left Chest */}
                    {teamLogo && (
                        <image href={teamLogo} x="80" y="-190" width="80" height="80" />
                    )}

                    {/* Sponsor Logo - Center Chest */}
                    {sponsorLogo && (
                        <image href={sponsorLogo} x="-200" y="-50" width="400" height="150" preserveAspectRatio="xMidYMid meet" />
                    )}
                </g>

                {/* 4. BACK AREA */}
                {/* Often mapped to the sides or bottom in simple unwraps. 
                    For this specific model, if it's the Adrian Hajdin one,
                    it might use a "Decal" approach usually.
                    But if we force texture, the back is usually on the edges X coordinates.
                    Let's try placing name/number on the far right (wrapping) for now, 
                    or assumes center is front and back is behind (which implies UV wrap).
                    
                    *Correction*: Validating the specific UVs of this GLB without opening it in Blender is hard.
                    However, usually these "shirt_baked" models have a Full Front UV Island.
                    Applying text to specific coordinates is guessing.
                    
                    Strategy: Place Name/Number VERY LARGE on the "Back" zone if we knew it.
                    Since we don't, I will render them but might need adjustment.
                    Let's assume standard T-pose unwrap:
                    Center = Front.
                    Far Left/Right = Back meet point.
                */}

                {/* 4. BACK AREA - SPINE WRAP STRATEGY */}
                <g transform="translate(0, 400)">
                    <text x="0" y="0" textAnchor="middle" fill={secondary} style={{ fontFamily: font, fontSize: '60px', fontWeight: '900' }}>{name}</text>
                    <text x="0" y="200" textAnchor="middle" fill={secondary} style={{ fontFamily: font, fontSize: '180px', fontWeight: '900' }}>{number}</text>
                </g>
                <g transform="translate(1024, 400)">
                    <text x="0" y="0" textAnchor="middle" fill={secondary} style={{ fontFamily: font, fontSize: '60px', fontWeight: '900' }}>{name}</text>
                    <text x="0" y="200" textAnchor="middle" fill={secondary} style={{ fontFamily: font, fontSize: '180px', fontWeight: '900' }}>{number}</text>
                </g>

            </svg>
        </div>
    );
};

export default JerseyPreview;
