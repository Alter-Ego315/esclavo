import React, { useEffect, useState } from 'react';
import './SplashScreen.css';

const SplashScreen = ({ onComplete }) => {
    useEffect(() => {
        const timer = setTimeout(() => {
            onComplete();
        }, 6000);
        return () => clearTimeout(timer);
    }, [onComplete]);

    return (
        <div className="splash-screen">
            <div className="splash-content">
                <div className="audio-orb-container">
                    <div className="audio-orb pulse-1"></div>
                    <div className="audio-orb pulse-2"></div>
                    <div className="audio-orb pulse-3"></div>
                    <div className="logo-text">Alter Ego</div>
                </div>
                <div className="wave-container">
                    {[...Array(10)].map((_, i) => (
                        <div key={i} className="wave-bar" style={{ animationDelay: `${i * 0.1}s` }}></div>
                    ))}
                </div>
                <p className="splash-subtitle">Discovering your sound...</p>
            </div>
        </div>
    );
};

export default SplashScreen;
