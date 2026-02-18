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
                    <text x="256" y="220" textAnchor="middle" fill={secondary} style={{ fontFamily: font, fontSize: '60px', fontWeight: '900' }}>{name}</text>
                    <text x="256" y="370" textAnchor="middle" fill={secondary} style={{ fontFamily: font, fontSize: '180px', fontWeight: '900' }}>{number}</text>
                </svg>
            </div>
        );
    }

    // Helper hook to convert URLs to Base64 for SVG embedding
    const useBase64Image = (url) => {
        const [base64, setBase64] = React.useState(null);
        React.useEffect(() => {
            if (!url) {
                setBase64(null);
                return;
            }
            // If already base64, use it
            if (url.startsWith('data:')) {
                setBase64(url);
                return;
            }

            const img = new Image();
            img.crossOrigin = 'Anonymous';
            img.onload = () => {
                const canvas = document.createElement('canvas');
                canvas.width = img.width;
                canvas.height = img.height;
                const ctx = canvas.getContext('2d');
                ctx.drawImage(img, 0, 0);
                setBase64(canvas.toDataURL('image/png'));
            };
            img.onerror = () => {
                console.error('Failed to load image for base64 conversion:', url);
                // Fallback: try to usage original url (might fail in blob)
                setBase64(url);
            };
            img.src = url;
        }, [url]);
        return base64;
    };

    const companyLogoB64 = useBase64Image('/ginga-green.png');
    const teamLogoB64 = useBase64Image(teamLogo);
    const sponsorLogoB64 = useBase64Image(sponsorLogo);

    return (
        <div className={`jersey-preview-container ${view}-view`} style={{ background: 'transparent', width: '4096px', height: '4096px' }}>
            <svg viewBox="0 0 1024 1024" className="jersey-svg" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', height: '100%', shapeRendering: 'geometricPrecision' }}>
                <defs>
                    <style type="text/css">
                        {`@import url('https://fonts.googleapis.com/css2?family=Anton&family=Black+Ops+One&family=Bungee+Inline&family=Caveat:wght@700&family=Chakra+Petch:wght@700&family=Cinzel:wght@400;700&family=Creepster&family=Exo:wght@400;700&family=Faster+One&family=Fontdiner+Swanky&family=Goldman:wght@700&family=Inter:wght@400;700;900&family=Lato:wght@400;700;900&family=Maven+Pro:wght@700;900&family=Monoton&family=Montserrat:wght@400;700;900&family=Open+Sans:wght@400;700&family=Orbitron:wght@700;900&family=Oswald:wght@500;700&family=Passion+One:wght@400;700&family=Permanent+Marker&family=Playfair+Display:wght@400;700&family=Press+Start+2P&family=Roboto+Condensed:wght@700&family=Rubik+Glitch&family=Saira+Condensed:wght@700;900&family=Saira+Stencil+One&family=Teko:wght@700&family=Turret+Road:wght@800&family=UnifrakturMaguntia&display=swap');`}
                    </style>
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

                {/* --- NEW PATTERNS --- */}

                {/* 1. CENTER STRIPE */}
                {pattern === 'center-stripe' && (
                    <rect x="462" y="0" width="100" height="1024" fill={secondary} opacity={0.8} />
                )}

                {/* 2. SASH (Diagonal) */}
                {pattern === 'sash' && (
                    <path d="M0,0 L200,0 L1024,824 L1024,1024 Z" fill={secondary} opacity={0.8} />
                )}

                {/* 3. CHEVRON (V-Shape on Chest) */}
                {pattern === 'chevron' && (
                    <g transform="translate(0, 200)">
                        <path d="M0,0 L512,300 L1024,0 L1024,150 L512,450 L0,150 Z" fill={secondary} opacity={0.8} />
                    </g>
                )}

                {/* 4. CROSS */}
                {pattern === 'cross' && (
                    <g fill={secondary} opacity={0.8}>
                        <rect x="437" y="0" width="150" height="1024" />
                        <rect x="0" y="350" width="1024" height="150" />
                    </g>
                )}

                {/* 5. CHECKERS */}
                {pattern === 'checkers' && (
                    <g fill={secondary} opacity={0.4}>
                        {Array.from({ length: 8 }).map((_, i) => (
                            Array.from({ length: 8 }).map((_, j) => (
                                ((i + j) % 2 === 0) ? <rect key={`${i}-${j}`} x={i * 128} y={j * 128} width="128" height="128" /> : null
                            ))
                        ))}
                    </g>
                )}

                {/* 6. DIAMONDS (Argyle) */}
                {pattern === 'diamonds' && (
                    <defs>
                        <pattern id="diamondPat" width="100" height="100" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
                            <rect width="50" height="50" fill={secondary} opacity={0.3} />
                        </pattern>
                    </defs>
                )}
                {pattern === 'diamonds' && <rect width="1024" height="1024" fill="url(#diamondPat)" />}

                {/* 7. WAVES */}
                {pattern === 'waves' && (
                    <defs>
                        <pattern id="wavesPat" width="100" height="60" patternUnits="userSpaceOnUse">
                            <path d="M0,30 Q25,0 50,30 T100,30" fill="none" stroke={secondary} strokeWidth="15" opacity={0.5} />
                        </pattern>
                    </defs>
                )}
                {pattern === 'waves' && <rect width="1024" height="1024" fill="url(#wavesPat)" />}

                {/* 8. HALFTONE LINES */}
                {pattern === 'halftone' && (
                    <defs>
                        <pattern id="halftonePat" width="20" height="20" patternUnits="userSpaceOnUse">
                            <circle cx="10" cy="10" r="5" fill={secondary} opacity={0.4} />
                        </pattern>
                    </defs>
                )}
                {pattern === 'halftone' && <rect width="1024" height="1024" fill="url(#halftonePat)" />}

                {/* 9. DOUBLE STRIPE */}
                {pattern === 'double-stripe' && (
                    <g fill={secondary} opacity={0.8}>
                        <rect x="350" y="0" width="80" height="1024" />
                        <rect x="594" y="0" width="80" height="1024" />
                    </g>
                )}

                {/* 10. ZIG ZAG */}
                {pattern === 'zigzag' && (
                    <defs>
                        <pattern id="zigzagPat" width="100" height="100" patternUnits="userSpaceOnUse">
                            <path d="M0,0 L25,50 L50,0 L75,50 L100,0" fill="none" stroke={secondary} strokeWidth="10" opacity={0.6} />
                        </pattern>
                    </defs>
                )}
                {pattern === 'zigzag' && <rect width="1024" height="1024" fill="url(#zigzagPat)" />}

                {/* 2.5 SLEEVE STYLES (Raglan vs Normal) */}
                {/* Regular Sleeves - Cover top corners and side strips */}
                {/* 2.5 SLEEVE STYLES (Raglan vs Normal) */}
                {/* Regular Sleeves logic removed to avoid artifacts as requested */}

                {/* Raglan simulates a diagonal cut from neck to underarm. 
                    Approximating on UV map: Draw diagonal patches from center-top outwards/downwards.
                */}
                {colors.accent && sleeve === 'raglan' && (
                    <g fill={colors.accent}>
                        {/* Left Raglan Shoulder */}
                        <path d="M300,0 L512,200 L512,0 Z" />
                        {/* Right Raglan Shoulder */}
                        <path d="M724,0 L512,200 L512,0 Z" />
                        {/* Side Sleeves for raglan usually full color too */}
                        <rect x="0" y="0" width="200" height="1024" />
                        <rect x="824" y="0" width="200" height="1024" />
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

                    {/* COMPANY LOGO (Green Player) - Right Chest (Wearer's Right - Image Left) */}
                    {companyLogoB64 && <image href={companyLogoB64} x="-170" y="-325" width="60" height="60" />}

                    {/* Team Logo - Left Chest (Wearer's Left - Image Right) */}
                    {teamLogoB64 && (
                        <image href={teamLogoB64} x="-342" y="-325" width="60" height="60" />
                    )}

                    {/* Sponsor Logo - Center Chest */}
                    {sponsorLogoB64 && (
                        <image href={sponsorLogoB64} x="-456" y="-200" width="400" height="150" preserveAspectRatio="xMidYMid meet" />
                    )}
                </g>

                {/* 4. BACK AREA */}
                {/* Text is now handled exclusively by the 3D Decal in Jersey3D.js to ensure meaningful positioning on the back. */}

            </svg>
        </div>
    );
};

export default JerseyPreview;
