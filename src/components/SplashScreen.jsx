import React, { useEffect, useState } from 'react';
import '../styles/SplashScreen.css';

const SplashScreen = ({ onComplete }) => {
    const [stage, setStage] = useState('running');

    useEffect(() => {
        const timers = [
            setTimeout(() => setStage('jumping'), 3000),
            setTimeout(() => setStage('transforming'), 5500),
            setTimeout(() => setStage('finalizing'), 6500),
            setTimeout(() => onComplete(), 8000)
        ];

        return () => timers.forEach(t => clearTimeout(t));
    }, [onComplete]);

    return (
        <div className={`splash-container ultra-hifi ${stage}`}>
            <div className="stadium-grid"></div>
            <div className="cinematic-vignette"></div>

            <div className="hero-stage">
                {/* Pro Silhouette Exactly matching Brand Identity */}
                <div className="pro-silhouette">
                    <svg viewBox="0 0 100 100" className="pro-player-svg">
                        <g className="silhouette-group">
                            {/* Running state - stylized like the mascot */}
                            {stage === 'running' && (
                                <path className="pro-run-hifi" d="M40 20 C45 10 55 10 60 20 L55 40 L65 70 L55 95 M55 40 L45 70 L40 90 M50 40 L40 30" stroke="white" strokeWidth="8" fill="none" strokeLinecap="round" />
                            )}
                            {/* Jumping state - transitioning to the iconic Logo Pose */}
                            {stage === 'jumping' && (
                                <path className="pro-kick-hifi" d="M25 45 C25 45 45 60 55 55 L85 40 L95 15 M55 55 L45 80 L30 95 M45 45 L40 25" stroke="white" strokeWidth="9" fill="none" strokeLinecap="round" />
                            )}
                        </g>
                    </svg>
                    <div className="kinetic-ball"></div>
                </div>

                {/* Brand Transformation */}
                <div className="branding-reveal">
                    <img src="/logo.png" alt="Ginga" className="ultra-logo" />
                    <div className="flash-overlay"></div>
                    <div className="logo-glow-ring"></div>
                </div>
            </div>

            <div className="ultra-hud">
                <div className="hud-line top">ENGINE_PRO_READY :: 120FPS</div>
                <div className="hud-line bottom">GENERATING_JERSEY_DYNAMICS...</div>
                <div className="ultra-loader">
                    <div className="loader-fill"></div>
                </div>
            </div>
        </div>
    );
};

export default SplashScreen;
