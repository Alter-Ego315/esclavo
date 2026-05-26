import React from 'react';
import { GINGA_LOGOS } from './JerseyDesigner';

const JerseyPreview = ({ colors, pattern, name, number, teamLogo, sponsorLogo, customText, backgroundImage, bgOffset = { x: 0, y: 0 }, font = 'Orbitron', view = 'full', vibrancy = 50, sleeve, collar, brandLogoColor }) => {
    const { primary, secondary, accent, textColor } = colors;

    // Helper hook to convert URLs to Base64 for SVG embedding
    const useBase64Image = (url) => {
        const [base64, setBase64] = React.useState(null);
        React.useEffect(() => {
            if (!url) {
                setBase64(null);
                return;
            }
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
                setBase64(url);
            };
            img.src = url;
        }, [url]);
        return base64;
    };

    const brandLogoPath = React.useMemo(() => {
        const found = GINGA_LOGOS.find(l => l.name === brandLogoColor);
        return found ? found.path : GINGA_LOGOS[0].path;
    }, [brandLogoColor]);

    const companyLogoB64 = useBase64Image(brandLogoPath);
    const teamLogoB64 = useBase64Image(teamLogo);
    const sponsorLogoB64 = useBase64Image(sponsorLogo);
    const backgroundImageB64 = useBase64Image(backgroundImage);

    return (
        <div className={`jersey-preview-container ${view}-view`} style={{ background: 'transparent', width: '1024px', height: '1024px' }}>
            <svg viewBox="0 0 1024 1024" className="jersey-svg" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', height: '100%', shapeRendering: 'geometricPrecision' }}>
                <defs>
                    <style type="text/css">
                        {`@import url('https://fonts.googleapis.com/css2?family=Oswald:wght@500;700&display=swap'); `}
                    </style>
                    <linearGradient id="jerseyGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" style={{ stopColor: primary, stopOpacity: 1 }} />
                        <stop offset="100%" style={{ stopColor: secondary, stopOpacity: 1 }} />
                    </linearGradient>

                    {/* --- CLIPPING PATHS FOR UNIVERSAL MAPPING --- */}
                    <clipPath id="torsoClip">
                        <rect x="50" y="0" width="402" height="1024" />
                        <rect x="560" y="0" width="404" height="1024" />
                    </clipPath>
                    <clipPath id="nonTorsoClip">
                        <path d="M0,0 H1024 V1024 H0 Z M50,0 V1024 H452 V0 Z M560,0 V1024 H964 V0 Z" fillRule="evenodd" />
                    </clipPath>
                    <clipPath id="sidesClipY">
                        <rect x="0" y="0" width="1024" height="700" />
                    </clipPath>
                    <clipPath id="sleevesClipY">
                        <rect x="0" y="700" width="1024" height="230" />
                    </clipPath>
                    <clipPath id="collarClipY">
                        <rect x="0" y="930" width="1024" height="94" />
                    </clipPath>

                    {/* --- PATTERNS --- */}
                    <linearGradient id="gradSoft" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stopColor={primary} />
                        <stop offset="100%" stopColor={secondary} />
                    </linearGradient>
                    <linearGradient id="gradSoftSleeves" x1="0%" y1="700" x2="0%" y2="930" gradientUnits="userSpaceOnUse">
                        <stop offset="0%" stopColor={colors.sleeves || primary} />
                        <stop offset="100%" stopColor={secondary} />
                    </linearGradient>
                    <linearGradient id="fadeGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stopColor="white" stopOpacity="1" />
                        <stop offset="100%" stopColor="white" stopOpacity="0" />
                    </linearGradient>
                    <mask id="halftoneFade">
                        <rect x="0" y="0" width="1024" height="1024" fill="url(#fadeGrad)" />
                    </mask>
                    {backgroundImageB64 && (
                        <pattern id="bgImagePattern" x={bgOffset?.x || 0} y={bgOffset?.y || 0} width="1024" height="1024" patternUnits="userSpaceOnUse">
                            <image href={backgroundImageB64} x="0" y="0" width="1024" height="1024" preserveAspectRatio="xMidYMid slice" />
                        </pattern>
                    )}
                    <pattern id="pattern-ocean-waves" width="128" height="128" patternUnits="userSpaceOnUse">
                        <g stroke={secondary} strokeWidth="6" fill="none" opacity="0.6">
                            <path d="M0,20 Q32,0 64,20 T128,20" />
                            <path d="M0,52 Q32,32 64,52 T128,52" />
                            <path d="M0,84 Q32,64 64,84 T128,84" />
                            <path d="M0,116 Q32,96 64,116 T128,116" />
                        </g>
                    </pattern>
                    <pattern id="pattern-hexagons" width="34.641" height="60" patternUnits="userSpaceOnUse">
                        <g fill="none" stroke={secondary} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" opacity="0.6">
                            {[[0, 0], [34.641, 0], [-17.3205, 30], [17.3205, 30], [51.9615, 30], [0, 60], [34.641, 60]].map(([cx, cy], i) => (
                                <g key={i}>
                                    <polyline points={`${cx + 17.3205},${cy - 10} ${cx + 17.3205},${cy + 10} ${cx},${cy + 20} ${cx - 17.3205},${cy + 10} ${cx - 17.3205},${cy - 10}`} />
                                    <polyline points={`${cx - 12.1244},${cy - 7} ${cx - 12.1244},${cy + 7} ${cx},${cy + 14} ${cx + 12.1244},${cy + 7} ${cx + 12.1244},${cy - 7} ${cx},${cy - 14} ${cx - 12.1244},${cy - 7}`} />
                                </g>
                            ))}
                        </g>
                    </pattern>
                    <pattern id="pattern-diamonds" x="0" y="0" width="120" height="120" patternUnits="userSpaceOnUse">
                        <rect x="60" y="0" width="60" height="60" transform="rotate(45 60 0)" fill={secondary} opacity="0.8" />
                    </pattern>
                    <pattern id="pattern-camo" width="250" height="250" patternUnits="userSpaceOnUse">
                        <g fill={secondary}>
                            <circle cx="50" cy="50" r="45" opacity="0.4" />
                            <circle cx="160" cy="80" r="55" opacity="0.3" />
                            <circle cx="110" cy="170" r="60" opacity="0.4" />
                            <circle cx="210" cy="190" r="38" opacity="0.3" />
                            <circle cx="35" cy="200" r="30" opacity="0.4" />
                            <path d="M100,50 Q150,25 175,100 Q125,150 75,100 Z" opacity="0.3" />
                            <path d="M50,150 Q100,120 120,180 Q80,220 30,180 Z" opacity="0.3" />
                            <path d="M180,120 Q220,90 240,150 Q200,190 160,150 Z" opacity="0.4" />
                        </g>
                    </pattern>
                </defs>

                {/* --- RENDERING LAYERS --- */}

                {/* 1. TORSO DESIGN (Main panels) */}
                <g clipPath="url(#torsoClip)">
                    {renderDesignLayers(0, primary)}
                </g>

                {/* 2. NON-TORSO COMPONENTS (Universal Coverage) */}
                <g clipPath="url(#nonTorsoClip)">
                    {/* 2.1 SIDES (Upper part of gaps) - Continues Torso Design */}
                    <g clipPath="url(#sidesClipY)">
                        {renderDesignLayers(0, primary)}
                    </g>
                    {/* 2.2 SLEEVES (Middle-Lower part) */}
                    <g clipPath="url(#sleevesClipY)">
                        {renderDesignLayers(0, colors.sleeves || primary, true)}
                    </g>
                    {/* 2.3 COLLAR (Very Bottom part) */}
                    <g clipPath="url(#collarClipY)">
                        {renderDesignLayers(0, colors.collar || primary)}
                    </g>
                </g>

                {/* 3. COLLAR OVERLAYS (Visual details) */}
                <g transform="translate(252, 50)">
                    {collar === 'v-neck' && (
                        <path d="M-80,-50 L0,110 L80,-50 Z" fill={colors.collar || primary} />
                    )}
                    {collar === 'polo' && (
                        <g>
                            <path d="M-75,-25 L-15,65 L-35,90 L-115,30 Z" fill={colors.collar || primary} stroke="rgba(0,0,0,0.2)" strokeWidth="2" />
                            <path d="M75,-25 L15,65 L35,90 L115,30 Z" fill={colors.collar || primary} stroke="rgba(0,0,0,0.2)" strokeWidth="2" />
                            <rect x="-12" y="60" width="24" height="75" fill={colors.collar || primary} />
                        </g>
                    )}
                </g>
                <g transform="translate(762, 50)">
                    {collar === 'v-neck' && <rect x="-100" y="-50" width="200" height="70" fill={colors.collar || primary} />}
                </g>

            </svg>
        </div>
    );

    function renderDesignLayers(yOffset, baseColor, isSleeves = false) {
        return (
            <g transform={`translate(0, ${yOffset})`}>
                <rect width="1024" height="1024" fill={baseColor} />

                {backgroundImageB64 && (
                    <rect width="1024" height="1024" fill="url(#bgImagePattern)" style={{ mixBlendMode: 'normal' }} />
                )}

                {pattern === 'gradient' && <rect width="1024" height="1024" fill={isSleeves ? "url(#gradSoftSleeves)" : "url(#gradSoft)"} />}

                {pattern === 'halftone-lines' && (
                    <g fill={secondary} mask="url(#halftoneFade)">
                        {Array.from({ length: 100 }).map((_, i) => (
                            <rect key={i} x="0" y={i * 10} width="1024" height="5" />
                        ))}
                    </g>
                )}

                {pattern === 'checkers' && (
                    <g fill={secondary}>
                        {Array.from({ length: 8 }).map((_, y) => (
                            Array.from({ length: 8 }).map((_, x) => (
                                (x + y) % 2 === 1 ? <rect key={`${x}-${y}`} x={x * 128} y={y * 128} width="128" height="128" /> : null
                            ))
                        ))}
                    </g>
                )}

                {pattern === 'zigzag' && (
                    <g stroke={secondary} strokeWidth="20" fill="none">
                        {Array.from({ length: 20 }).map((_, i) => (
                            <path key={i} d={`M${i * 100}, 0 L${i * 100 + 50}, 50 L${i * 100}, 100 L${i * 100 - 50}, 150 L${i * 100}, 200 L${i * 100 + 50}, 250 L${i * 100}, 300 L${i * 100 - 50}, 350 L${i * 100}, 400 L${i * 100 + 50}, 450 L${i * 100}, 500 L${i * 100 - 50}, 550 L${i * 100}, 600 L${i * 100 + 50}, 650 L${i * 100}, 700 L${i * 100 - 50}, 750 L${i * 100}, 800 L${i * 100 + 50}, 850 L${i * 100}, 900 L${i * 100 - 50}, 950 L${i * 100}, 1000`} transform="translate(-100,0)" />
                        ))}
                    </g>
                )}

                {(pattern === 'cross' || pattern === 'cross-offset') && (
                    <g fill={secondary}>
                        <rect x={pattern === 'cross' ? 202 : 150} y="0" width={pattern === 'cross' ? 100 : 80} height="1024" />
                        <rect x="0" y="312" width="1024" height={pattern === 'cross' ? 100 : 80} />
                    </g>
                )}

                {pattern === 'stripes' && (
                    <g fill={secondary}>
                        {[52, 252, 452, 652, 852].map(x => <rect key={x} x={x} y="0" width="100" height="1024" />)}
                    </g>
                )}

                {pattern === 'hoops' && (
                    <g fill={secondary}>
                        {[100, 300, 500, 700, 900].map(y => <rect key={y} x="0" y={y} width="1024" height="100" />)}
                    </g>
                )}

                {pattern === 'center-stripe' && (
                    <rect x="202" y="0" width="100" height="1024" fill={secondary} opacity={0.9} />
                )}

                {pattern === 'chevron' && (
                    <g fill={secondary} opacity={0.9}>
                        <path d="M50,550 L252,370 L454,550 L454,700 L252,520 L50,700 Z" />
                        <path d="M560,550 L762,370 L964,550 L964,700 L762,520 L560,700 Z" />
                    </g>
                )}

                {pattern === 'norvehc' && (
                    <g fill={secondary} opacity={0.9}>
                        <path d="M50,370 L252,550 L454,370 L454,520 L252,700 L50,520 Z" />
                        <path d="M560,370 L762,550 L964,370 L964,520 L762,700 L560,520 Z" />
                    </g>
                )}

                {pattern === 'double-stripe' && (
                    <g fill={secondary} opacity={0.9}>
                        <rect x="182" y="0" width="60" height="1024" />
                        <rect x="262" y="0" width="60" height="1024" />
                    </g>
                )}

                {pattern === 'pixels' && (
                    <g fill={secondary} opacity={0.3}>
                        {Array.from({ length: 32 }).map((_, y) => (
                            Array.from({ length: 32 }).map((_, x) => (
                                Math.random() > 0.7 ? <rect key={`${x}-${y}`} x={x * 32} y={y * 32} width="32" height="32" /> : null
                            ))
                        ))}
                    </g>
                )}

                {pattern === 'triangles' && (
                    <g fill={secondary} opacity={0.2} transform="translate(-100, 0)">
                        {Array.from({ length: 12 }).map((_, y) => (
                            Array.from({ length: 12 }).map((_, x) => (
                                <path key={`${x}-${y}`} d={`M${x * 100 + 50},${y * 100} L${x * 100 + 100},${y * 100 + 100} L${x * 100},${y * 100 + 100} Z`} />
                            ))
                        ))}
                    </g>
                )}

                {pattern === 'star' && (
                    <g fill={secondary} opacity={0.8} transform="translate(252,400) scale(3)">
                        <path d="M0,-100 L25,-30 L100,-30 L40,15 L60,90 L0,50 L-60,90 L-40,15 L-100,-30 L-25,-30 Z" />
                    </g>
                )}

                {pattern === 'arches' && (
                    <g fill="none" stroke={secondary} strokeWidth="15" opacity="0.6">
                        {Array.from({ length: 8 }).map((_, i) => (
                            <circle key={i} cx="252" cy="1024" r={i * 100 + 100} />
                        ))}
                    </g>
                )}

                {pattern === 'ocean-waves' && <rect width="1024" height="1024" fill="url(#pattern-ocean-waves)" />}

                {pattern === 'diagonal' && (
                    <path d="M-100,1124 L1124,-100" stroke={secondary} strokeWidth="200" opacity={0.8} />
                )}

                {pattern === 'hexagons' && <rect width="1024" height="1024" fill="url(#pattern-hexagons)" />}

                {pattern === 'halftone-dots' && (
                    <g fill={secondary} opacity={0.6}>
                        {Array.from({ length: 32 }).map((_, yi) => {
                            const y = yi * 32 + 16;
                            const r = Math.max(1, 10 * (1 - y / 1024));
                            return Array.from({ length: 32 }).map((_, xi) => {
                                const x = xi * 32 + 16;
                                return <circle key={`${xi}-${yi}`} cx={x} cy={y} r={r} />;
                            });
                        })}
                    </g>
                )}

                {pattern === 'hoops-thin' && (
                    <g fill={secondary} opacity={0.6}>
                        {Array.from({ length: 50 }).map((_, i) => (
                            <rect key={i} x="0" y={i * 20} width="1024" height="6" />
                        ))}
                    </g>
                )}

                {pattern === 'diamonds' && <rect width="1024" height="1024" fill="url(#pattern-diamonds)" />}

                {pattern === 'camo' && <rect width="1024" height="1024" fill="url(#pattern-camo)" />}

                {pattern === 'sash' && (
                    <path d="M0,0 L150,0 L1024,874 L1024,1024 L874,1024 L0,150 Z" fill={secondary} opacity={0.9} />
                )}
            </g>
        );
    }
};

export default JerseyPreview;
