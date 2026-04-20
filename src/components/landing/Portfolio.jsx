import React, { useState, useEffect } from 'react';

const Portfolio = () => {
    const [activeTab, setActiveTab] = useState('ginga'); // Default to ginga case study
    const [selectedMedia, setSelectedMedia] = useState(null);

    // Scroll to top when tab changes
    useEffect(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, [activeTab]);

    return (
        <section id="portfolio" className="section portfolio pt-24 md:pt-32">
            <div className="container">
                <h2 className="section-title">Nuestra Trayectoria</h2>

                {/* Tab Navigation */}
                <div className="tabs-container">
                    <button
                        className={`tab-button ${activeTab === 'ginga' ? 'active' : ''}`}
                        onClick={() => setActiveTab('ginga')}
                    >
                        Caso Ginga
                    </button>
                    <button
                        className={`tab-button ${activeTab === 'experience' ? 'active' : ''}`}
                        onClick={() => setActiveTab('experience')}
                    >
                        App de bloqueos
                    </button>
                    <button
                        className={`tab-button ${activeTab === 'more' ? 'active' : ''}`}
                        onClick={() => setActiveTab('more')}
                    >
                        Más experiencia
                    </button>
                </div>

                {activeTab === 'experience' && (
                    <div className="general-experience-view animate-fade-in">
                        <div className="experience-featured-card">
                            <div className="featured-card-content">
                                <span className="modern-badge">Windows Native • Beta</span>
                                <h3>La Lucha conta la Distracción</h3>
                                <div className="problem-intro">
                                    <p>Vivimos en una era donde la tecnología, diseñada para ayudarnos, se ha convertido en nuestra mayor distracción. El scrolling infinito y las notificaciones constantes son problemas reales que afectan nuestra productividad diaria.</p>
                                </div>
                                <div className="solution-box">
                                    <h4>Nuestra Solución: Focus App</h4>
                                    <p>Hemos desarrollado una aplicación nativa para Windows que corta de raíz la distracción. No es una extensión de navegador; es un sistema robusto que bloquea sitios web y restringe el acceso a aplicaciones específicas a nivel de sistema.</p>
                                    <ul className="solution-features">
                                        <li>· Bloqueo estricto de dominios.</li>
                                        <li>· Cierre forzado de apps distractoras.</li>
                                        <li>· Temporizadores de enfoque profundo.</li>
                                    </ul>
                                    <div className="beta-notice">
                                        <span className="icon">⚠️</span>
                                        <p>Actualmente en fase Beta privada. Optimizando el núcleo del sistema antes de su lanzamiento público.</p>
                                    </div>
                                </div>
                            </div>
                            <div className="featured-card-visual productivity-app">
                                <div className="screenshots-gallery">
                                    <div className="screenshot-item">
                                        <img
                                            src="/focus-dashboard.png"
                                            alt="Dashboard Alter Ego Focus"
                                            className="screenshot-img clickable-img"
                                            onClick={() => setSelectedMedia({ type: 'image', src: "/focus-dashboard.png" })}
                                        />
                                        <span className="screenshot-caption">Dashboard de control de sesiones</span>
                                    </div>
                                    <div className="screenshot-item">
                                        <img
                                            src="/focus-blocked.png"
                                            alt="Pantalla bloqueada"
                                            className="screenshot-img clickable-img"
                                            onClick={() => setSelectedMedia({ type: 'image', src: "/focus-blocked.png" })}
                                        />
                                        <span className="screenshot-caption">Esta es la pantalla que se ve cuando se intenta entrar en una web bloqueada</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'more' && (
                    <div className="general-experience-view animate-fade-in">
                        <p className="section-description">
                            Estamos construyendo el futuro de la automatización. Muy pronto compartiremos más casos de éxito.
                        </p>
                    </div>
                )}

                {activeTab === 'ginga' && (
                    <div className="ginga-case-view animate-fade-in">
                        <p className="section-description">
                            Cómo transformamos el modelo de negocio de una <strong>empresa de camisetas personalizadas</strong> aplicando nuestra tecnología.
                        </p>
                        <p className="promo-note">
                            *Si contratas nuestros servicios, tienes un pequeño descuento en tu próximo pedido en Ginga.
                        </p>

                        <div className="comparison-container">
                            {/* Legacy Sidebar */}
                            <div className="comparison-card legacy">
                                <div className="card-header">
                                    <span className="label">EL PROBLEMA (Legacy)</span>
                                    <h3>Ginga antes</h3>
                                </div>
                                <ul className="comparison-list">
                                    <li>
                                        <span className="icon">⏳</span>
                                        <div>
                                            <strong>Atención reactiva</strong>
                                            <p>Respuesta rápida, pero no inmediata. Dependencia humana total.</p>
                                        </div>
                                    </li>
                                    <li>
                                        <span className="icon">🐌</span>
                                        <div>
                                            <strong>Web obsoleta</strong>
                                            <p>Sitio lento, con poca conversión y diseño poco estimulante.</p>
                                        </div>
                                    </li>
                                    <li>
                                        <span className="icon">❓</span>
                                        <div>
                                            <strong>Incertidumbre visual</strong>
                                            <p>El cliente no podía previsualizar el diseño antes de fabricar.</p>
                                        </div>
                                    </li>
                                </ul>
                            </div>

                            {/* Modern Main Card */}
                            <div className="comparison-card modern">
                                <div className="card-header">
                                    <span className="label highlight">LA SOLUCIÓN (Alter Ego)</span>
                                    <h3>El salto adelante</h3>
                                </div>
                                <div className="modern-grid">
                                    <div className="modern-item">
                                        <div className="modern-content">
                                            <span className="modern-badge">Chatbot 100% Propio</span>
                                            <h4>Respuesta Inmediata</h4>
                                            <p>Integrado de raíz, sin herramientas externas, resolviendo dudas al instante 24/7.</p>
                                        </div>
                                        <div className="modern-video clickable-img" onClick={() => setSelectedMedia({ type: 'video', src: "/Chatbot Ginga nuestro.mp4" })}>
                                            <video
                                                src="/Chatbot Ginga nuestro.mp4"
                                                autoPlay
                                                loop
                                                muted
                                                playsInline
                                            />
                                        </div>
                                    </div>

                                    <div className="modern-item reversed">
                                        <div className="modern-content">
                                            <span className="modern-badge">Web Estimulante</span>
                                            <h4>Velocidad y Conversión</h4>
                                            <p>Nueva plataforma segura y ultrarrápida diseñada para atrapar al usuario.</p>
                                            <a href="https://ginga-web.vercel.app" target="_blank" rel="noopener noreferrer" className="portfolio-link">
                                                Ver proyecto en vivo →
                                            </a>
                                        </div>
                                        <div className="modern-visual">
                                            <img
                                                src="/Web ginga hero.png"
                                                alt="Ginga Website Modern Design"
                                                className="modern-img clickable-img"
                                                onClick={() => setSelectedMedia({ type: 'image', src: "/Web ginga hero.png" })}
                                            />
                                        </div>
                                    </div>

                                    <div className="modern-item">
                                        <div className="modern-content">
                                            <span className="modern-badge">Automatización 3D</span>
                                            <h4>De la idea al Prototipo</h4>
                                            <p>De una idea a un modelo 3D detallado en pocos minutos mediante IA.</p>
                                            <div className="design-prompt-box">
                                                <strong>Diseño pedido:</strong>
                                                <p>"Una camiseta negra con rayas horizontales blancas. Añade un escudo a tu gusto, el número 10 y el nombre ALTER EGO"</p>
                                            </div>
                                        </div>
                                        <div className="modern-visual ai-automation">
                                            <img
                                                src="/ginga-jersey-custom.png"
                                                alt="Diseño de camiseta IA Alter Ego"
                                                className="modern-img clickable-img"
                                                onClick={() => setSelectedMedia({ type: 'image', src: "/ginga-jersey-custom.png" })}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Lightbox Modal */}
                {selectedMedia && (
                    <div className="lightbox-overlay" onClick={() => setSelectedMedia(null)}>
                        <div className="lightbox-content" onClick={(e) => e.stopPropagation()}>
                            <button className="close-lightbox" onClick={() => setSelectedMedia(null)} aria-label="Cerrar">
                                &times;
                            </button>
                            {selectedMedia.type === 'image' ? (
                                <img src={selectedMedia.src} alt="Enlarged view" className="enlarged-media" />
                            ) : (
                                <video
                                    src={selectedMedia.src}
                                    controls
                                    autoPlay
                                    muted
                                    className="enlarged-media"
                                />
                            )}
                        </div>
                    </div>
                )}
            </div>

            <style jsx>{`
                .tabs-container {
                    display: flex;
                    justify-content: center;
                    gap: 1rem;
                    margin-bottom: 3rem;
                }

                .tab-button {
                    background: rgba(255, 255, 255, 0.05);
                    border: 1px solid rgba(255, 255, 255, 0.1);
                    color: #fff;
                    padding: 0.8rem 2rem;
                    border-radius: 50px;
                    cursor: pointer;
                    font-weight: 600;
                    font-size: 1rem;
                    transition: all 0.3s ease;
                }

                .tab-button:hover {
                    background: rgba(255, 255, 255, 0.1);
                    border-color: var(--primary-color);
                }

                .tab-button.active {
                    background: var(--primary-color);
                    color: #fff;
                    border-color: var(--primary-color);
                    box-shadow: 0 0 20px rgba(59, 130, 246, 0.3);
                }

                .animate-fade-in {
                    animation: fadeIn 0.5s ease-out;
                }

                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(10px); }
                    to { opacity: 1; transform: translateY(0); }
                }

                .section-description {
                    text-align: center;
                    margin-bottom: 1rem;
                    color: #888;
                    font-size: 1.1rem;
                    max-width: 800px;
                    margin-left: auto;
                    margin-right: auto;
                }

                .promo-note {
                    text-align: center;
                    margin-bottom: 3rem;
                    color: var(--primary-color);
                    font-size: 0.85rem;
                    opacity: 0.8;
                    font-style: italic;
                }
                
                .general-experience-view .modern-badge {
                    background: rgba(59, 130, 246, 0.1);
                    color: var(--primary-color);
                    border-color: rgba(59, 130, 246, 0.2);
                }

                .comparison-container {
                    display: grid;
                    grid-template-columns: 350px 1fr;
                    gap: 2rem;
                    align-items: start;
                }

                .comparison-card {
                    background: var(--card-bg);
                    border-radius: 24px;
                    padding: 2.5rem;
                    border: 1px solid rgba(255, 255, 255, 0.05);
                    position: relative;
                    overflow: hidden;
                }

                .comparison-card.legacy {
                    background: rgba(20, 20, 20, 0.5);
                    filter: grayscale(0.8);
                    opacity: 0.8;
                    transition: all 0.3s ease;
                }

                .comparison-card.legacy:hover {
                    filter: grayscale(0.3);
                    opacity: 1;
                }

                .comparison-card.modern {
                    border-color: rgba(59, 130, 246, 0.3);
                    box-shadow: 0 10px 40px rgba(0, 0, 0, 0.5), inset 0 0 20px rgba(59, 130, 246, 0.05);
                }

                .card-header {
                    margin-bottom: 2rem;
                }

                .card-header .label {
                    display: block;
                    font-size: 0.75rem;
                    font-weight: 700;
                    letter-spacing: 2px;
                    color: #666;
                    margin-bottom: 0.5rem;
                }

                .card-header .label.highlight {
                    color: var(--primary-color);
                }

                .card-header h3 {
                    font-size: 1.8rem;
                    color: #fff;
                }

                .comparison-list {
                    display: flex;
                    flex-direction: column;
                    gap: 2rem;
                }

                .comparison-list li {
                    display: flex;
                    gap: 1.5rem;
                    align-items: flex-start;
                }

                .comparison-list .icon {
                    font-size: 1.5rem;
                    opacity: 0.6;
                }

                .comparison-list strong {
                    display: block;
                    color: #fff;
                    margin-bottom: 0.2rem;
                }

                .comparison-list p {
                    font-size: 0.9rem;
                    color: #777;
                    line-height: 1.4;
                }

                .modern-grid {
                    display: flex;
                    flex-direction: column;
                    gap: 4rem;
                }

                .modern-item {
                    display: grid;
                    grid-template-columns: 1.2fr 1fr;
                    gap: 2rem;
                    align-items: center;
                }

                .modern-item.reversed {
                    grid-template-columns: 1fr 1.2fr;
                }

                .modern-item.reversed .modern-content {
                    order: 2;
                }

                .modern-content {
                    display: flex;
                    flex-direction: column;
                    gap: 0.8rem;
                }

                .modern-badge {
                    display: inline-block;
                    width: fit-content;
                    padding: 0.3rem 0.8rem;
                    background: rgba(59, 130, 246, 0.1);
                    color: var(--primary-color);
                    border-radius: 50px;
                    font-size: 0.7rem;
                    font-weight: 700;
                    text-transform: uppercase;
                    border: 1px solid rgba(59, 130, 246, 0.2);
                }

                .modern-content h4 {
                    font-size: 1.5rem;
                    color: #fff;
                }

                .modern-content p {
                    color: #aaa;
                    line-height: 1.5;
                }

                .design-prompt-box {
                    background: rgba(59, 130, 246, 0.05);
                    border: 1px solid rgba(59, 130, 246, 0.1);
                    padding: 1rem;
                    border-radius: 12px;
                    margin-top: 0.5rem;
                }

                .design-prompt-box strong {
                    color: var(--primary-color);
                    font-size: 0.75rem;
                    text-transform: uppercase;
                    display: block;
                    margin-bottom: 0.4rem;
                }

                .design-prompt-box p {
                    font-size: 0.85rem;
                    font-style: italic;
                    color: #888;
                    line-height: 1.4;
                }

                .portfolio-link {
                    color: var(--primary-color);
                    font-weight: 600;
                    text-decoration: underline;
                    font-size: 0.9rem;
                    margin-top: 0.5rem;
                }

                .modern-video {
                    width: 100%;
                    aspect-ratio: 2/3;
                    background: #000;
                    border-radius: 16px;
                    overflow: hidden;
                    border: 1px solid rgba(255, 255, 255, 0.05);
                }

                .modern-visual {
                    width: 100%;
                    aspect-ratio: 16/9;
                    background: #000;
                    border-radius: 16px;
                    overflow: hidden;
                    border: 1px solid rgba(255, 255, 255, 0.05);
                }

                .modern-video video {
                    width: 100%;
                    height: 100%;
                    object-fit: contain;
                    background: #000;
                }

                .ai-automation {
                    background: linear-gradient(135deg, #111 0%, #000 100%);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    position: relative;
                }

                .ai-pulse {
                    position: absolute;
                    width: 60px;
                    height: 60px;
                    background: var(--primary-color);
                    border-radius: 50%;
                    filter: blur(20px);
                    opacity: 0.3;
                    animation: pulse 2s infinite ease-in-out;
                }

                .modern-visual span {
                    font-size: 0.8rem;
                    font-weight: 800;
                    letter-spacing: 4px;
                    color: #333;
                }

                @keyframes pulse {
                    0% { transform: scale(1); opacity: 0.2; }
                    50% { transform: scale(1.5); opacity: 0.4; }
                    100% { transform: scale(1); opacity: 0.2; }
                }

                .experience-featured-card {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    background: var(--card-bg);
                    border-radius: 32px;
                    overflow: hidden;
                    border: 1px solid rgba(255, 255, 255, 0.05);
                    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.4);
                }

                .featured-card-content {
                    padding: 3.5rem;
                    display: flex;
                    flex-direction: column;
                    gap: 1.5rem;
                }

                .featured-card-content h3 {
                    font-size: 2.2rem;
                    color: #fff;
                    line-height: 1.2;
                }

                .problem-intro p {
                    color: #888;
                    font-size: 1.1rem;
                    line-height: 1.6;
                }

                .solution-box {
                    background: rgba(255, 255, 255, 0.03);
                    padding: 2rem;
                    border-radius: 20px;
                    border: 1px solid rgba(255, 255, 255, 0.05);
                }

                .solution-box h4 {
                    color: var(--primary-color);
                    margin-bottom: 1rem;
                    font-size: 1.2rem;
                }

                .solution-box p {
                    color: #aaa;
                    margin-bottom: 1.5rem;
                    font-size: 0.95rem;
                }

                .solution-features {
                    display: flex;
                    flex-direction: column;
                    gap: 0.5rem;
                    margin-bottom: 2rem;
                }

                .solution-features li {
                    color: #fff;
                    font-size: 0.9rem;
                    font-weight: 500;
                }

                .beta-notice {
                    display: flex;
                    gap: 1rem;
                    align-items: center;
                    padding: 1rem;
                    background: rgba(59, 130, 246, 0.05);
                    border-radius: 12px;
                    border: 1px solid rgba(59, 130, 246, 0.1);
                }

                .beta-notice .icon {
                    font-size: 1.2rem;
                }

                .beta-notice p {
                    margin: 0;
                    font-size: 0.8rem;
                    color: var(--primary-color);
                    font-style: italic;
                }

                .featured-card-visual {
                    background: linear-gradient(135deg, #111 0%, #050505 100%);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    padding: 3rem;
                    position: relative;
                }

                .screenshots-gallery {
                    display: flex;
                    flex-direction: column;
                    gap: 2.5rem;
                    width: 100%;
                    max-width: 500px;
                }

                .screenshot-item {
                    display: flex;
                    flex-direction: column;
                    gap: 1rem;
                }

                .screenshot-img {
                    width: 100%;
                    border-radius: 12px;
                    border: 1px solid rgba(255, 255, 255, 0.1);
                    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.6);
                    transition: transform 0.3s ease;
                }

                .screenshot-img:hover {
                    transform: scale(1.02);
                }

                .screenshot-caption {
                    color: var(--primary-color);
                    font-size: 0.8rem;
                    font-style: italic;
                    text-align: center;
                    opacity: 0.9;
                    line-height: 1.4;
                }

                .modern-img {
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                    border-radius: 12px;
                    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
                }

                /* Lightbox Styles */
                .lightbox-overlay {
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background: rgba(0, 0, 0, 0.9);
                    backdrop-filter: blur(10px);
                    z-index: 1000;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    animation: fadeIn 0.3s ease;
                }

                .lightbox-content {
                    position: relative;
                    max-width: 90vw;
                    max-height: 90vh;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }

                .enlarged-media {
                    max-width: 100%;
                    max-height: 90vh;
                    object-fit: contain;
                    border-radius: 8px;
                    box-shadow: 0 0 50px rgba(59, 130, 246, 0.2);
                    display: block;
                    margin: auto;
                }

                .close-lightbox {
                    position: absolute;
                    top: -40px;
                    right: -40px;
                    background: none;
                    border: none;
                    color: #fff;
                    font-size: 3rem;
                    cursor: pointer;
                    line-height: 1;
                    transition: color 0.3s ease;
                }

                .close-lightbox:hover {
                    color: var(--primary-color);
                }

                .clickable-img {
                    cursor: pointer;
                    transition: transform 0.3s ease, box-shadow 0.3s ease;
                }

                .clickable-img:hover {
                    transform: scale(1.02);
                    box-shadow: 0 0 30px rgba(59, 130, 246, 0.2);
                }

                @media (max-width: 1024px) {
                    .comparison-container {
                        grid-template-columns: 1fr;
                    }
                    .modern-item, .modern-item.reversed {
                        grid-template-columns: 1fr;
                        text-align: center;
                    }
                    .modern-item.reversed .modern-content {
                        order: 0;
                    }
                    .modern-badge {
                        margin: 0 auto;
                    }
                    .experience-featured-card {
                        grid-template-columns: 1fr;
                    }
                    .featured-card-content {
                        padding: 2.5rem 1.5rem;
                    }
                    .featured-card-visual {
                        padding: 2rem 1rem;
                    }
                }

                @media (max-width: 768px) {
                    .close-lightbox {
                        top: -50px;
                        right: 10px;
                        font-size: 2.5rem;
                    }
                }
            `}</style>
        </section>
    );
};

export default Portfolio;
