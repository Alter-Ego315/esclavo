import React from 'react';

const JerseyPreview = ({ colors, pattern, name, number, teamLogo, sponsorLogo, brandLogo, font = 'Orbitron', view = 'front', vibrancy = 50 }) => {
    const { primary, secondary, accent } = colors;

    // Use saturation for "vibrancy" effect
    // To implement real color manipulation we'd need more complex logic or just use opacity layers
    const isSleeve = view.includes('sleeve');
    const isBack = view.includes('back');
    const isFront = view.includes('front');

    // For the 3D Texture, we just need a square filler. 
    // The previous svg used 'bodyPathFront' which was a jersey silhouette. 
    // For UV mapped cylinder texturing, we want the pattern to fill the whole square 
    // because the cylinder face UVs cover the whole square.

    // However, logos need to be centered.

    return (
        <div className={`jersey-preview-container ${view}-view`} style={{ background: 'transparent', width: '1024px', height: '1024px' }}>
            <svg viewBox="0 0 1024 1024" className="jersey-svg" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', height: '100%', shapeRendering: 'geometricPrecision' }}>
                <defs>
                    <linearGradient id="jerseyGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" style={{ stopColor: primary, stopOpacity: 1 }} />
                        <stop offset="100%" style={{ stopColor: secondary, stopOpacity: 1 }} />
                    </linearGradient>

                    {/* Scale patterns up for 1024x1024 */}
                    <pattern id="pixelPattern" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
                        <rect width="20" height="20" fill={secondary} opacity={0.3} />
                        <rect x="20" y="20" width="20" height="20" fill={secondary} opacity={0.3} />
                    </pattern>

                    <pattern id="diagonalPattern" x="0" y="0" width="80" height="80" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
                        <rect width="40" height="80" fill={secondary} opacity={0.3} />
                    </pattern>

                    {/* Mesh Pattern */}
                    <pattern id="meshPattern" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
                        <circle cx="2" cy="2" r="2" fill="#000" opacity="0.1" />
                    </pattern>
                </defs>

                {/* BACKGROUND / BASE CONTENT */}
                <rect width="1024" height="1024" fill={pattern === 'gradient' ? 'url(#jerseyGradient)' : primary} />

                {/* Patterns */}
                {pattern === 'stripes' && (
                    <g fill={secondary} opacity={0.7}>
                        {[160, 320, 480, 640, 800].map((x, i) => (
                            <rect key={i} x={x} y="0" width="80" height="1024" />
                        ))}
                    </g>
                )}
                {pattern === 'hoops' && (
                    <g fill={secondary} opacity={0.7}>
                        {[160, 320, 480, 640, 800].map((y, i) => (
                            <rect key={i} x="0" y={y} width="1024" height="80" />
                        ))}
                    </g>
                )}
                {pattern === 'pixels' && <rect width="1024" height="1024" fill="url(#pixelPattern)" />}
                {pattern === 'diagonal' && <rect width="1024" height="1024" fill="url(#diagonalPattern)" />}

                {/* Fabric Texture Overlay (Subtle) */}
                <rect width="1024" height="1024" fill="url(#meshPattern)" />

                {/* LOGOS & TEXT - Center them for Cylinder Mapping */}
                {/* Cylinder UVs map 0-1 horizontally. 512 is center. */}

                {!isSleeve && (
                    <g>
                        {/* Collar Detail */}
                        <path d="M 0 0 L 1024 0 L 1024 100 Q 512 300 0 100 Z" fill={primary} fillOpacity="0.2" />

                        {isFront && (
                            <g>
                                {/* Team Logo - Left Chest (approx x=700) */}
                                <image href={teamLogo || "/logo.png"} x="680" y="250" width="120" height="120" />

                                {/* Brand Logo - Right Chest (approx x=200) */}
                                {brandLogo && (
                                    <image href={brandLogo} x="220" y="270" width="100" height="80" style={{ filter: 'brightness(4)' }} />
                                )}

                                {/* Sponsor - Center Chest */}
                                {sponsorLogo && (
                                    <image href={sponsorLogo} x="312" y="450" width="400" height="200" preserveAspectRatio="xMidYMid meet" />
                                )}
                            </g>
                        )}

                        {isBack && (
                            <g>
                                {/* Name */}
                                <text x="512" y="300" textAnchor="middle" fill={secondary} style={{ fontFamily: font, fontSize: '100px', fontWeight: '900', textTransform: 'uppercase', letterSpacing: '10px' }}>
                                    {name}
                                </text>

                                {/* Number */}
                                <text x="512" y="750" textAnchor="middle" fill={secondary} style={{ fontFamily: font, fontSize: '450px', fontWeight: '900' }}>
                                    {number}
                                </text>
                            </g>
                        )}
                    </g>
                )}

                {/* Sleeves have simple patterns mostly */}
                {isSleeve && (
                    <g>
                        <rect width="1024" height="1024" fill={accent} opacity="0.2" /> {/* Tint sleeves */}
                        <g transform="translate(512, 512)">
                            {/* Optional sleeve graphics */}
                        </g>
                    </g>
                )}

                {/* Border / Seam hints for realism */}
                <rect x="0" y="0" width="1024" height="1024" fill="none" stroke="rgba(0,0,0,0.2)" strokeWidth="20" />

            </svg>
        </div>
    );
};

export default JerseyPreview;
