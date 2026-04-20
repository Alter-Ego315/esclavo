import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const location = useLocation();

    const toggleMenu = () => {
        setIsOpen(!isOpen);
    };

    const isHome = location.pathname === '/';

    const handleLinkClick = (e, target) => {
        setIsOpen(false);
        if (isHome && target.startsWith('#')) {
            // Smooth scroll is handled by CSS/browser usually, 
            // but we let the default behavior happen if it's an anchor on home
        }
    };

    return (
        <nav className="navbar">
            <div className="container">
                <Link to="/" className="logo" onClick={() => setIsOpen(false)}>
                    <img src="/logoalterego2.png" alt="Alter Ego" style={{ height: '125px', marginTop: '10px' }} />
                </Link>
                <ul className={`nav-links ${isOpen ? 'active' : ''}`}>
                    <li>
                        {isHome ? (
                            <a href="#about" onClick={(e) => handleLinkClick(e, '#about')}>Quiénes somos</a>
                        ) : (
                            <Link to="/#about" onClick={() => setIsOpen(false)}>Quiénes somos</Link>
                        )}
                    </li>
                    <li>
                        {isHome ? (
                            <a href="#services" onClick={(e) => handleLinkClick(e, '#services')}>Servicios</a>
                        ) : (
                            <Link to="/#services" onClick={() => setIsOpen(false)}>Servicios</Link>
                        )}
                    </li>
                    <li>
                        <Link
                            to="/experiencia"
                            className={location.pathname === '/experiencia' ? 'active-link' : ''}
                            onClick={() => setIsOpen(false)}
                        >
                            Experiencia
                        </Link>
                    </li>
                    <li>
                        {isHome ? (
                            <a href="#contact" className="btn-primary" onClick={(e) => handleLinkClick(e, '#contact')}>Hablemos</a>
                        ) : (
                            <Link to="/#contact" className="btn-primary" onClick={() => setIsOpen(false)}>Hablemos</Link>
                        )}
                    </li>
                </ul>
                <div className="hamburger" onClick={toggleMenu}>
                    <span></span>
                    <span></span>
                    <span></span>
                </div>
            </div>
            <style jsx>{`
                .active-link {
                    color: var(--primary-color) !important;
                }
            `}</style>
        </nav>
    );
};

export default Navbar;
