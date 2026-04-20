import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Footer = ({ openPrivacy, openLegal, openCookiePreferences }) => {
    const location = useLocation();
    const isHome = location.pathname === '/';

    const scrollToContact = (e) => {
        if (isHome) {
            e.preventDefault();
            const contactSection = document.getElementById('contact');
            if (contactSection) {
                contactSection.scrollIntoView({ behavior: 'smooth' });
            }
        }
    };

    return (
        <footer className="footer-redesign">
            <div className="container footer-grid">
                {/* Column 1: MENU */}
                <div className="footer-col">
                    <h4 className="footer-title">MENÚ</h4>
                    <ul className="footer-links">
                        <li><Link to="/">Página principal</Link></li>
                        <li><Link to="/experiencia">Experiencia</Link></li>
                    </ul>
                </div>

                {/* Column 2: LEGALES */}
                <div className="footer-col">
                    <h4 className="footer-title">LEGALES</h4>
                    <ul className="footer-links">
                        <li><a href="#" onClick={openLegal}>Aviso legal</a></li>
                        <li><a href="#" onClick={openPrivacy}>Política de privacidad</a></li>
                        <li><a href="#" onClick={(e) => { e.preventDefault(); /* Usually links to cookies page */ }}>Política de cookies</a></li>
                        <li><a href="#" onClick={openCookiePreferences}>Configurar cookies</a></li>
                    </ul>
                </div>

                {/* Column 3: CONTACTO */}
                <div className="footer-col">
                    <h4 className="footer-title">CONTÁCTANOS</h4>
                    <div className="footer-contact">
                        <Link
                            to={isHome ? "#contact" : "/#contact"}
                            onClick={scrollToContact}
                            className="footer-contact-link"
                        >
                            Formulario de contacto
                        </Link>
                    </div>
                </div>
            </div>

            <div className="footer-bottom">
                <div className="container">
                    <p>&copy; 2025 Alter Ego. Todos los derechos reservados.</p>
                </div>
            </div>

            <style jsx>{`
                .footer-redesign {
                    background: #0a0a0a;
                    padding: 80px 0 40px;
                    border-top: 1px solid rgba(255, 255, 255, 0.05);
                }

                .footer-grid {
                    display: grid;
                    grid-template-columns: repeat(3, 1fr);
                    gap: 40px;
                    margin-bottom: 60px;
                }

                .footer-title {
                    color: var(--primary-color);
                    font-size: 1.1rem;
                    font-weight: 800;
                    letter-spacing: 2px;
                    margin-bottom: 25px;
                    text-transform: uppercase;
                }

                .footer-links {
                    list-style: none;
                    padding: 0;
                    margin: 0;
                    display: flex;
                    flex-direction: column;
                    gap: 12px;
                }

                .footer-links li a {
                    color: #888;
                    text-decoration: none;
                    font-size: 1rem;
                    transition: all 0.3s ease;
                }

                .footer-links li a:hover {
                    color: #fff;
                    padding-left: 5px;
                }

                .footer-contact-link {
                    display: inline-block;
                    color: #fff;
                    text-decoration: none;
                    font-weight: 600;
                    font-size: 1rem;
                    padding: 0.8rem 1.5rem;
                    background: rgba(107, 204, 11, 0.1);
                    border: 1px solid rgba(107, 204, 11, 0.2);
                    border-radius: 50px;
                    transition: all 0.3s ease;
                }

                .footer-contact-link:hover {
                    background: #6BCC0B;
                    color: #000;
                    border-color: #6BCC0B;
                    transform: translateY(-2px);
                }

                .footer-bottom {
                    padding-top: 40px;
                    border-top: 1px solid rgba(255, 255, 255, 0.05);
                    text-align: center;
                }

                .footer-bottom p {
                    color: #555;
                    font-size: 0.9rem;
                }

                @media (max-width: 768px) {
                    .footer-grid {
                        grid-template-columns: 1fr;
                        text-align: center;
                        gap: 50px;
                    }

                    .footer-links {
                        align-items: center;
                    }
                }
            `}</style>
        </footer>
    );
};

export default Footer;
