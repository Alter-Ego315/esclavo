import React, { useEffect, useState } from 'react';
import '../styles/IntroAnimation.css';

const IntroAnimation = ({ onComplete }) => {
    const [animationState, setAnimationState] = useState('entering');

    useEffect(() => {
        // Timeline for the animation steps
        const timers = [
            setTimeout(() => setAnimationState('centered'), 1500),
            setTimeout(() => setAnimationState('pulsing'), 2500),
            setTimeout(() => setAnimationState('fading'), 4000),
            setTimeout(() => onComplete(), 5000), // Complete transition after 5 seconds
        ];

        return () => timers.forEach(timer => clearTimeout(timer));
    }, [onComplete]);

    return (
        <div className={`intro-container ${animationState}`}>
            <div className="brand-wrapper mysimetri-wrapper">
                <svg className="ai-icon" viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="40" stroke="#FF8C00" strokeWidth="4" fill="none" />
                    <circle cx="50" cy="50" r="25" fill="#FF8C00" opacity="0.2" />
                    <path d="M50 20 L50 80 M20 50 L80 50 M30 30 L70 70 M30 70 L70 30" stroke="#FF8C00" strokeWidth="2" />
                    <circle cx="50" cy="50" r="10" fill="#FF8C00" />
                </svg>
                <div className="brand-text mysimetri-text">mysimetri</div>
            </div>

            <div className="x-separator">
                <svg viewBox="0 0 100 100" className="x-icon">
                    <line x1="20" y1="20" x2="80" y2="80" stroke="white" strokeWidth="8" strokeLinecap="round" />
                    <line x1="80" y1="20" x2="20" y2="80" stroke="white" strokeWidth="8" strokeLinecap="round" />
                </svg>
            </div>

            <div className="brand-wrapper ginga-wrapper">
                <img src="/ginga-logo-header.png" alt="Ginga" className="ginga-icon-img" />
            </div>
            
            <div className="ambient-glow"></div>
        </div>
    );
};

export default IntroAnimation;
