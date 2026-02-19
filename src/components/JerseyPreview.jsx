import React from 'react';

const JerseyPreview = ({ colors, pattern, name, number, teamLogo, sponsorLogo, brandLogo, font = 'Orbitron', view = 'full', vibrancy = 50, sleeve, collar, teamLogoPos, sponsorLogoPos }) => {
    teamLogoPos = teamLogoPos || { x: 0, y: 0 };
    sponsorLogoPos = sponsorLogoPos || { x: 0, y: 0 };
    // ... (start of component)

    // ... (inside SVG)
    {/* 3. FRONT CHEST AREA (Approximation for standard UVs) */ }
    {/* The front is typically the center ~40-60% width of the texture */ }
    <g transform="translate(512, 512)">

        {/* COMPANY LOGO (Green Player) - Right Chest (Wearer's Right - Image Left) */}
        {companyLogoB64 && <image href={companyLogoB64} x="-170" y="-325" width="60" height="60" />}

        {/* Team Logo - Left Chest (Wearer's Left - Image Right) */}
        {teamLogoB64 && (
            <image
                href={teamLogoB64}
                x={-342 + teamLogoPos.x}
                y={-325 + teamLogoPos.y}
                width="60"
                height="60"
            />
        )}

        {/* Sponsor Logo - Center Chest (Aligned to user center -260) */}
        {sponsorLogoB64 && (
            <image
                href={sponsorLogoB64}
                x={-460 + sponsorLogoPos.x}
                y={-200 + sponsorLogoPos.y}
                width="400"
                height="150"
                preserveAspectRatio="xMidYMid meet"
            />
        )}
    </g>
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
        <div className={`jersey - preview - container ${view} -view`} style={{ background: 'transparent', width: '4096px', height: '4096px' }}>
            <svg viewBox="0 0 1024 1024" className="jersey-svg" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', height: '100%', shapeRendering: 'geometricPrecision' }}>
                <defs>
                    <style type="text/css">
                        {`@import url('https://fonts.googleapis.com/css2?family=Anton&family=Black+Ops+One&family=Bungee+Inline&family=Caveat:wght@700&family=Chakra+Petch:wght@700&family=Cinzel:wght@400;700&family=Creepster&family=Exo:wght@400;700&family=Faster+One&family=Fontdiner+Swanky&family=Goldman:wght@700&family=Inter:wght@400;700;900&family=Lato:wght@400;700;900&family=Maven+Pro:wght@700;900&family=Monoton&family=Montserrat:wght@400;700;900&family=Open+Sans:wght@400;700&family=Orbitron:wght@700;900&family=Oswald:wght@500;700&family=Passion+One:wght@400;700&family=Permanent+Marker&family=Playfair+Display:wght@400;700&family=Press+Start+2P&family=Roboto+Condensed:wght@700&family=Rubik+Glitch&family=Saira+Condensed:wght@700;900&family=Saira+Stencil+One&family=Teko:wght@700&family=Turret+Road:wght@800&family=UnifrakturMaguntia&display=swap'); `}
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

                {/* 1. BASE COLOR LAYER - Default Solid */}
                <rect width="1024" height="1024" fill={primary} />

                {/* --- DEFINITIONS FOR PATTERNS --- */}
                <defs>
                    {/* Linear Gradient (Soft) */}
                    <linearGradient id="gradSoft" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stopColor={primary} />
                        <stop offset="100%" stopColor={secondary} />
                    </linearGradient>

                    {/* Multi-Color Gradient */}
                    <linearGradient id="gradMulti" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stopColor={primary} />
                        <stop offset="50%" stopColor={colors.accent || secondary} />
                        <stop offset="100%" stopColor={secondary} />
                    </linearGradient>

                    {/* Stepped Gradient (Banded) */}
                    <linearGradient id="gradStepped" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stopColor={primary} />
                        <stop offset="20%" stopColor={primary} />
                        <stop offset="20%" stopColor={colors.accent || '#444'} />
                        <stop offset="40%" stopColor={colors.accent || '#444'} />
                        <stop offset="40%" stopColor={secondary} />
                        <stop offset="60%" stopColor={secondary} />
                        <stop offset="60%" stopColor={colors.accent || '#444'} />
                        <stop offset="80%" stopColor={colors.accent || '#444'} />
                        <stop offset="80%" stopColor={primary} />
                        <stop offset="100%" stopColor={primary} />
                    </linearGradient>

                    {/* Mask for Halftone Lines (Gradient fade) */}
                    <linearGradient id="fadeGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stopColor="white" stopOpacity="1" />
                        <stop offset="100%" stopColor="white" stopOpacity="0" />
                    </linearGradient>
                    <mask id="halftoneFade">
                        <rect x="0" y="0" width="1024" height="1024" fill="url(#fadeGrad)" />
                    </mask>
                </defs>

                {/* --- APPLY PATTERNS --- */}

                {/* 1. GRADIENTS */}
                {pattern === 'gradient' && <rect width="1024" height="1024" fill="url(#gradSoft)" />}
                {pattern === 'gradient-multi' && <rect width="1024" height="1024" fill="url(#gradMulti)" />}
                {pattern === 'stepped-gradient' && <rect width="1024" height="1024" fill="url(#gradStepped)" />}

                {/* 2. HALFTONE LINES (Horizontal Scanlines fading out) */}
                {pattern === 'halftone-lines' && (
                    <g fill={secondary} mask="url(#halftoneFade)">
                        {Array.from({ length: 100 }).map((_, i) => (
                            <rect key={i} x="0" y={i * 10} width="1024" height="5" />
                        ))}
                    </g>
                )}

                {/* 3. HALFTONE DOTS (Grid of dots fading out) */}
                {pattern === 'halftone-dots' && (
                    <g fill={secondary} mask="url(#halftoneFade)">
                        {Array.from({ length: 40 }).map((_, y) => (
                            Array.from({ length: 40 }).map((_, x) => (
                                <circle key={`${x} -${y} `} cx={x * 25 + 12} cy={y * 25 + 12} r="8" />
                            ))
                        ))}
                    </g>
                )}

                {/* 4. CHECKERS (Refined) */}
                {pattern === 'checkers' && (
                    <g fill={secondary}>
                        {Array.from({ length: 8 }).map((_, y) => (
                            Array.from({ length: 8 }).map((_, x) => (
                                (x + y) % 2 === 1 ? <rect key={`${x} -${y} `} x={x * 128} y={y * 128} width="128" height="128" /> : null
                            ))
                        ))}
                    </g>
                )}

                {/* 5. ZIG ZAG (Vertical) */}
                {pattern === 'zigzag' && (
                    <g stroke={secondary} strokeWidth="20" fill="none">
                        {Array.from({ length: 20 }).map((_, i) => (
                            <path key={i} d={`M${i * 100}, 0 L${i * 100 + 50}, 50 L${i * 100}, 100 L${i * 100 - 50}, 150 L${i * 100}, 200 L${i * 100 + 50}, 250 L${i * 100}, 300 L${i * 100 - 50}, 350 L${i * 100}, 400 L${i * 100 + 50}, 450 L${i * 100}, 500 L${i * 100 - 50}, 550 L${i * 100}, 600 L${i * 100 + 50}, 650 L${i * 100}, 700 L${i * 100 - 50}, 750 L${i * 100}, 800 L${i * 100 + 50}, 850 L${i * 100}, 900 L${i * 100 - 50}, 950 L${i * 100}, 1000`} transform="translate(-100,0)" />
                        ))}
                    </g>
                )}

                {/* 6. WAVES (Organic) */}
                {pattern === 'waves' && (
                    <g stroke={secondary} strokeWidth="15" fill="none" opacity="0.6">
                        {Array.from({ length: 20 }).map((_, i) => (
                            <path key={i} d={`M0, ${i * 60} Q256, ${i * 60 - 50} 512, ${i * 60} T1024, ${i * 60} `} />
                        ))}
                    </g>
                )}

                {/* 7. CROSS VARIANTS */}
                {pattern === 'cross' && (
                    <g fill={secondary}>
                        <rect x="152" y="0" width="200" height="1024" /> {/* Vertical Center (252 - 100) */}
                        <rect x="0" y="300" width="1024" height="200" /> {/* Horizontal */}
                    </g>
                )}

                {pattern === 'cross-offset' && (
                    <g fill={secondary}>
                        <rect x="252" y="0" width="150" height="1024" /> {/* Offset Vertical (Starts at center) */}
                        <rect x="0" y="300" width="1024" height="150" /> {/* Horizontal */}
                    </g>
                )}

                {/* 8. STANDARD PATTERNS (Legacy/Simple) */}
                {pattern === 'diagonal' && (
                    <defs>
                        <pattern id="diagPat" width="100" height="100" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
                            <rect width="50" height="100" fill={secondary} opacity="0.3" />
                        </pattern>
                    </defs>
                )}
                {pattern === 'diagonal' && <rect width="1024" height="1024" fill="url(#diagPat)" />}

                {pattern === 'stripes' && (
                    <g fill={secondary}>
                        {/* Centered around 252 */}
                        {[52, 252, 452, 652, 852].map(x => <rect key={x} x={x} y="0" width="100" height="1024" />)}
                    </g>
                )}
                {pattern === 'hoops' && (
                    <g fill={secondary}>
                        {[100, 300, 500, 700, 900].map(y => <rect key={y} x="0" y={y} width="1024" height="100" />)}
                    </g>
                )}

                {pattern === 'diamonds' && (
                    <defs>
                        <pattern id="diamondPat" width="128" height="128" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
                            <rect x="32" y="32" width="64" height="64" fill={secondary} opacity="0.2" />
                        </pattern>
                    </defs>
                )}
                {pattern === 'diamonds' && <rect width="1024" height="1024" fill="url(#diamondPat)" />}

                {/* 9. RESTORED STANDARD PATTERNS */}
                {pattern === 'center-stripe' && (
                    <rect x="202" y="0" width="100" height="1024" fill={secondary} opacity={0.9} /> /* 252 - 50 */
                )}

                {pattern === 'sash' && (
                    // Needs to cross through roughly 252,512. 
                    // Adjusted coordinates to cross visual center
                    <path d="M0,0 L200,0 L800,1024 L600,1024 Z" fill={secondary} opacity={0.9} />
                )}

                {pattern === 'chevron' && (
                    <g transform="translate(-260, 300)" fill={secondary} opacity={0.9}>
                        {/* Shifted by -260 to align V-point to new center */}
                        <path d="M0,0 L512,250 L1024,0 L1024,150 L512,400 L0,150 Z" />
                    </g>
                )}

                {pattern === 'double-stripe' && (
                    <g fill={secondary} opacity={0.9}>
                        <rect x="182" y="0" width="60" height="1024" /> {/* 252 - 10 - 60 = 182 */}
                        <rect x="262" y="0" width="60" height="1024" /> {/* 252 + 10 = 262 */}
                    </g>
                )}

                {pattern === 'pixels' && (
                    <g fill={secondary} opacity={0.3}>
                        {Array.from({ length: 32 }).map((_, y) => (
                            Array.from({ length: 32 }).map((_, x) => (
                                Math.random() > 0.7 ? <rect key={`${x} -${y} `} x={x * 32} y={y * 32} width="32" height="32" /> : null
                            ))
                        ))}
                    </g>
                )}

                {/* 10. EXTRA SHAPES */}
                {pattern === 'triangles' && (
                    <g fill={secondary} opacity={0.2} transform="translate(-100, 0)">
                        {/* Shifted pattern slightly left to align grid with center */}
                        {Array.from({ length: 12 }).map((_, y) => (
                            Array.from({ length: 12 }).map((_, x) => (
                                <path key={`${x} -${y} `} d={`M${x * 100 + 50},${y * 100} L${x * 100 + 100},${y * 100 + 100} L${x * 100},${y * 100 + 100} Z`} />
                            ))
                        ))}
                    </g>
                )}

                {pattern === 'camo' && (
                    <filter id="camoFilter">
                        <feTurbulence type="fractalNoise" baseFrequency="0.01" numOctaves="3" result="noise" />
                        <feColorMatrix type="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 18 -7" in="noise" result="goo" />
                        <feComposite operator="in" in="SourceGraphic" in2="goo" />
                    </filter>
                )}
                {pattern === 'camo' && (
                    <rect width="1024" height="1024" fill={secondary} opacity={0.4} filter="url(#camoFilter)" />
                )}

                {pattern === 'swirl' && (
                    <g stroke={secondary} strokeWidth="10" fill="none" opacity="0.4">
                        {/* Centered at 252, 512 */}
                        {Array.from({ length: 10 }).map((_, i) => (
                            <circle key={i} cx="252" cy="512" r={i * 60 + 20} strokeDasharray="100 50" />
                        ))}
                    </g>
                )}

                {pattern === 'star' && (
                    <g fill={secondary} opacity={0.2} transform="translate(252,400) scale(3)">
                        <path d="M0,-100 L25,-30 L100,-30 L40,15 L60,90 L0,50 L-60,90 L-40,15 L-100,-30 L-25,-30 Z" />
                    </g>
                )}

                {pattern === 'arches' && (
                    <g fill="none" stroke={secondary} strokeWidth="15" opacity="0.6">
                        {/* Centered at 252, bottom (1024) */}
                        {Array.from({ length: 8 }).map((_, i) => (
                            <circle key={i} cx="252" cy="1024" r={i * 100 + 100} />
                        ))}
                    </g>
                )}

                {/* 2.5 SLEEVE STYLES (Raglan vs Normal) */}
                {/* Regular Sleeves - Cover top corners and side strips */}
                {/* 2.5 SLEEVE STYLES (Raglan vs Normal) */}
                {/* Regular Sleeves logic removed to avoid artifacts as requested */}

                {/* Raglan simulates a diagonal cut from neck to underarm. 
                    Approximating on UV map: Draw diagonal patches from center-top outwards/downwards.
                */}
                {colors.accent && sleeve === 'raglan' && (
                    <g fill={colors.accent}>
                        {/* Left Raglan Shoulder (Adjusted for new center) */}
                        <path d="M40,0 L252,200 L252,0 Z" />
                        {/* Right Raglan Shoulder */}
                        <path d="M464,0 L252,200 L252,0 Z" />
                        {/* Side Sleeves for raglan usually full color too */}
                        <rect x="0" y="0" width="100" height="1024" />
                        <rect x="750" y="0" width="274" height="1024" />
                    </g>
                )}

                {/* 2.6 COLLAR STYLES */}
                <g transform="translate(252, 50)"> {/* Centered at 252 */}
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
                        <image
                            href={teamLogoB64}
                            x={-342 + (teamLogoPos?.x || 0)}
                            y={-325 + (teamLogoPos?.y || 0)}
                            width="60"
                            height="60"
                        />
                    )}

                    {/* Sponsor Logo - Center Chest (Aligned to user center -260) */}
                    {sponsorLogoB64 && (
                        <image
                            href={sponsorLogoB64}
                            x={-460 + (sponsorLogoPos?.x || 0)}
                            y={-200 + (sponsorLogoPos?.y || 0)}
                            width="400"
                            height="150"
                            preserveAspectRatio="xMidYMid meet"
                        />
                    )}
                </g>

                {/* 4. BACK AREA */}
                {/* Text is now handled exclusively by the 3D Decal in Jersey3D.js to ensure meaningful positioning on the back. */}

            </svg>
        </div>
    );
};

export default JerseyPreview;
