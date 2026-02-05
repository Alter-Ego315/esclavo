import React from 'react';

const JerseyPreview = ({ colors, pattern, name, number, teamLogo, sponsorLogo, brandLogo, font = 'Orbitron', view = 'front', vibrancy = 50 }) => {
    const { primary, secondary, accent } = colors;

    // Mapping logic for 3D textures
    const isSleeve = view.includes('sleeve');
    const isBack = view.includes('back');
    const isFront = view.includes('front');

    // Color punch logic
    const saturation = 0.6 + (vibrancy / 100);

    // Anatomical Silhouette Paths (Pro-Fit)
    const bodyPathFront = "M160 80 Q250 110 340 80 L370 120 Q380 250 350 460 L150 460 Q120 250 130 120 Z";
    const bodyPathBack = "M160 80 Q250 100 340 80 L370 120 Q380 250 350 460 L150 460 Q120 250 130 120 Z";

    return (
        <div className={`jersey-preview-container ${view}-view`} style={{ background: '#000', width: '2048px', height: '2048px' }}>
            <svg viewBox="0 0 500 500" className="jersey-svg" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', height: '100%' }}>
                <defs>
                    <linearGradient id="jerseyGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" style={{ stopColor: primary, stopOpacity: 1 }} />
                        <stop offset="100%" style={{ stopColor: secondary, stopOpacity: 1 }} />
                    </linearGradient>

                    <pattern id="pixelPattern" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
                        <rect width="10" height="10" fill={secondary} opacity={0.6 * saturation} />
                        <rect x="10" y="10" width="10" height="10" fill={secondary} opacity={0.6 * saturation} />
                    </pattern>

                    <pattern id="diagonalPattern" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
                        <rect width="20" height="40" fill={secondary} opacity={0.6 * saturation} />
                    </pattern>

                    <filter id="anatomyDepth" x="-20%" y="-20%" width="140%" height="140%">
                        <feTurbulence type="fractalNoise" baseFrequency="0.05" numOctaves="2" result="noise" />
                        <feDiffuseLighting in="noise" lighting-color="#ffffff" surfaceScale="3" result="diffuse">
                            <feDistantLight azimuth="45" elevation="60" />
                        </feDiffuseLighting>
                        <feComposite in="diffuse" in2="SourceGraphic" operator="arithmetic" k1="0.1" k2="0.9" k3="0.05" k4="0" />
                    </filter>

                    <clipPath id="bodyClip">
                        <path d={isBack ? bodyPathBack : bodyPathFront} />
                    </clipPath>

                    <radialGradient id="muscleShadow" cx="50%" cy="30%" r="50%">
                        <stop offset="0%" stopColor="black" stopOpacity="0" />
                        <stop offset="100%" stopColor="black" stopOpacity="0.4" />
                    </radialGradient>
                </defs>

                {!isSleeve && (
                    <g filter="url(#anatomyDepth)">
                        <path
                            d={isBack ? bodyPathBack : bodyPathFront}
                            fill={pattern === 'gradient' ? 'url(#jerseyGradient)' : primary}
                        />
                        <g clipPath="url(#bodyClip)">
                            {pattern === 'stripes' && (
                                <g fill={secondary} opacity={0.7 * saturation}>
                                    {[160, 190, 220, 250, 280, 310, 340].map(x => (
                                        <rect key={x} x={x - 5} y="80" width="10" height="380" />
                                    ))}
                                </g>
                            )}
                            {pattern === 'hoops' && (
                                <g fill={secondary} opacity={0.7 * saturation}>
                                    {[120, 170, 220, 270, 320, 370, 420].map(y => (
                                        <rect key={y} x="0" y={y} width="500" height="15" />
                                    ))}
                                </g>
                            )}
                            {pattern === 'pixels' && <rect width="500" height="500" fill="url(#pixelPattern)" />}
                            {pattern === 'diagonal' && <rect width="500" height="500" fill="url(#diagonalPattern)" />}
                        </g>

                        {isFront && (
                            <path d="M160 80 Q250 120 340 80 L320 60 Q250 100 180 60 Z" fill="#050505" />
                        )}
                        {isBack && (
                            <path d="M160 80 Q250 105 340 80 L320 60 Q250 85 180 60 Z" fill="#020202" />
                        )}

                        {isFront && (
                            <g>
                                <image href={teamLogo || "/logo.png"} x="275" y="145" width="45" height="45" />
                                {brandLogo && <image href={brandLogo} x="180" y="150" width="40" height="40" style={{ filter: 'brightness(4)' }} />}
                                {sponsorLogo && <image href={sponsorLogo} x="175" y="270" width="150" height="75" preserveAspectRatio="xMidYMid meet" />}
                            </g>
                        )}

                        {isBack && (
                            <g>
                                <text x="250" y="155" textAnchor="middle" fill="#ffffff" style={{ fontFamily: font, fontSize: '44px', fontWeight: '900', textTransform: 'uppercase', letterSpacing: '6px' }}>{name}</text>
                                <text x="250" y="340" textAnchor="middle" fill="#ffffff" style={{ fontFamily: font, fontSize: '190px', fontWeight: '900' }}>{number}</text>
                            </g>
                        )}
                    </g>
                )}

                {isSleeve && (
                    <g filter="url(#anatomyDepth)">
                        <rect width="500" height="500" fill={accent} />
                        {pattern === 'pixels' && <rect width="500" height="500" fill="url(#pixelPattern)" opacity={0.5 * saturation} />}
                    </g>
                )}
            </svg>
        </div>
    );
};

export default JerseyPreview;
