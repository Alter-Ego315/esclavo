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
            <div className="brand-wrapper mysimetry-wrapper">
                <img src="/Logos de Ginga/mysimetry-logo.png" alt="mySimetry" className="mysimetry-icon-img" />
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
