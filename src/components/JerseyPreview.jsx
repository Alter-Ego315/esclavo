import React from 'react';

const JerseyPreview = ({ colors, pattern, name, number, teamLogo, sponsorLogo, brandLogo, font = 'Orbitron', view = 'full', vibrancy = 50, sleeve, collar }) => {
    const { primary, secondary, accent } = colors;

    // Based on the standard shirt_baked.glb UV mapping:
    // The texture is usually creating a full wrap.
    // Center area (approx 50% width) is Front.
    // Sides are Back.
    // Bottom/Top areas map to sleeves/shoulders.
    // *This is a common UV layout for this specific open-source model.*

    // Special view for generating the Decal texture (Text only)
    if (view === 'text-decal') {
        return (
            <div className="jersey-preview-container" style={{ width: '512px', height: '512px', background: 'transparent' }}>
                <svg viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', height: '100%' }}>
                    <text x="256" y="200" textAnchor="middle" fill={secondary} style={{ fontFamily: font, fontSize: '60px', fontWeight: '900' }}>{name}</text>
                    <text x="256" y="400" textAnchor="middle" fill={secondary} style={{ fontFamily: font, fontSize: '180px', fontWeight: '900' }}>{number}</text>
                </svg>
            </div>
        );
    }

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

                {/* 2.5 SLEEVE STYLES (Raglan vs Normal) */}
                {/* Raglan simulates a diagonal cut from neck to underarm. 
                    Approximating on UV map: Draw diagonal patches from center-top outwards/downwards.
                */}
                {colors.accent && sleeve === 'raglan' && (
                    <g fill={colors.accent}>
                        {/* Left Raglan Shoulder */}
                        <path d="M300,0 L512,200 L512,0 Z" />
                        {/* Right Raglan Shoulder */}
                        <path d="M724,0 L512,200 L512,0 Z" />
                    </g>
                )}

                {/* 2.6 COLLAR STYLES */}
                <g transform="translate(512, 50)">
                    {/* V-NECK */}
                    {colors.accent && collar === 'v-neck' && (
                        <path d="M-50,0 L0,80 L50,0 L50,-20 L-50,-20 Z" fill={colors.accent} stroke="none" />
                    )}

                    {/* POLO */}
                    {colors.accent && collar === 'polo' && (
                        <g>
                            {/* Collar Fold Left */}
                            <path d="M-60,0 L-10,60 L-30,80 L-100,20 Z" fill={colors.accent} stroke="rgba(0,0,0,0.2)" strokeWidth="2" />
                            {/* Collar Fold Right */}
                            <path d="M60,0 L10,60 L30,80 L100,20 Z" fill={colors.accent} stroke="rgba(0,0,0,0.2)" strokeWidth="2" />
                            {/* Placket */}
                            <rect x="-10" y="50" width="20" height="60" fill={colors.accent} />
                            <circle cx="0" cy="70" r="3" fill="white" />
                            <circle cx="0" cy="90" r="3" fill="white" />
                        </g>
                    )}
                </g>

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


                {/* 4. BACK AREA - ATTEMPT 7: REFINED CENTER & SMALLER */}
                {/* 210 was centered but bled to front. 150 was decentered.
                    Trying 180/844 (Mid-point).
                    Reducing font size to prevent wrapping bleed.
                */}
                <g transform="translate(180, 200)">
                    <text x="0" y="0" textAnchor="middle" fill={secondary} style={{ fontFamily: font, fontSize: '55px', fontWeight: '900' }}>{name}</text>
                    <text x="0" y="200" textAnchor="middle" fill={secondary} style={{ fontFamily: font, fontSize: '180px', fontWeight: '900' }}>{number}</text>
                </g>
                <g transform="translate(844, 200)">
                    <text x="0" y="0" textAnchor="middle" fill={secondary} style={{ fontFamily: font, fontSize: '55px', fontWeight: '900' }}>{name}</text>
                    <text x="0" y="200" textAnchor="middle" fill={secondary} style={{ fontFamily: font, fontSize: '180px', fontWeight: '900' }}>{number}</text>
                </g>

            </svg>
        </div>
    );
};

export default JerseyPreview;
